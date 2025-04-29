import { useEffect, useRef, useState } from 'react';
import { Phone, PhoneOff, MicOff, Mic, X } from 'lucide-react';

const VideoChat = ({ socket, userId, receiverId, selectedUser }) => {
    const [callStatus, setCallStatus] = useState('idle');
    const [isReceivingCall, setIsReceivingCall] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const ringtoneRef = useRef(null);
    const callTimerRef = useRef(null);

    // Call notification state
    const [callNotification, setCallNotification] = useState('');
    const notificationTimeoutRef = useRef(null);

    // State to control fullscreen call UI
    const [showFullscreenCall, setShowFullscreenCall] = useState(false);

    const clearNotificationTimeout = () => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }
    };

    const initializePeerConnection = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        console.log('Initializing new PeerConnection.');
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
            ],
        };

        const peerConnection = new RTCPeerConnection(configuration);

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', {
                    candidate: event.candidate,
                    to: receiverId,
                });
            }
        };

        peerConnection.ontrack = (event) => {
            console.log('Track received:', event.streams[0]);
            remoteStreamRef.current = event.streams[0];
            const remoteAudio = document.getElementById('remoteAudio');
            if (remoteAudio) {
                remoteAudio.srcObject = event.streams[0];
            }
        };

        peerConnection.onconnectionstatechange = () => {
            console.log('Connection state changed:', peerConnection.connectionState);
            if (peerConnection.connectionState === 'failed' || 
                peerConnection.connectionState === 'disconnected' ||
                peerConnection.connectionState === 'closed') {
                endCall();
            }
        };

        peerConnectionRef.current = peerConnection;
        return peerConnection;
    };

    const startCall = async () => {
        try {
            if (callStatus === 'calling' || callStatus === 'connected') {
                console.log('Call already in progress.');
                return;
            }

            cleanupMediaResources();
            const peerConnection = initializePeerConnection();

            const stream = await getMediaStream();
            if (!stream || stream.getTracks().length === 0) {
                throw new Error('No media tracks found in the stream.');
            }

            localStreamRef.current = stream;
            stream.getTracks().forEach((track) => {
                console.log('Adding track:', track.kind);
                peerConnection.addTrack(track, stream);
            });

            const offer = await peerConnection.createOffer({
                offerToReceiveAudio: true
            });
            console.log("offer", offer);
            await peerConnection.setLocalDescription(offer);

            socket.emit('call-user', { 
                offer, 
                to: receiverId 
            });
            setCallStatus('calling');
            setShowFullscreenCall(true);
        } catch (error) {
            console.error('Error starting call:', error);
            endCall();
        }
    };

    const getMediaStream = async () => {
        try {
            return await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (error) {
            console.error('Error accessing user media:', error);
            throw new Error('Failed to access media devices. Please check permissions.');
        }
    };

    const cleanupMediaResources = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                track.stop();
            });
            localStreamRef.current = null;
        }

        if (remoteStreamRef.current) {
            remoteStreamRef.current.getTracks().forEach((track) => {
                track.stop();
            });
            remoteStreamRef.current = null;
        }

        if (ringtoneRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
        }

        const remoteAudio = document.getElementById('remoteAudio');
        if (remoteAudio) {
            remoteAudio.srcObject = null;
        }

        // Clear call timer
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
            callTimerRef.current = null;
            setCallDuration(0);
        }
    };

    const endCall = () => {
        if (callStatus === 'idle' && !isReceivingCall) {
            return;
        }
        
        console.log("Ending call...");
        
        cleanupMediaResources();

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        setCallStatus('idle');
        setIsReceivingCall(false);
        setShowFullscreenCall(false);

        if (!isEndingCall.current) {
            socket.emit('end-call', {
                to: receiverId,
            });
        }
    };

    const answerCall = async () => {
        try {
            if (callStatus === 'connected') {
                console.log('Call already connected.');
                return;
            }

            cleanupMediaResources();

            const stream = await getMediaStream();
            localStreamRef.current = stream;

            const peerConnection = peerConnectionRef.current;
            if (!peerConnection) {
                throw new Error('No peer connection available');
            }

            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
            });

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socket.emit('call-answered', {
                answer,
                to: receiverId
            });

            setCallStatus('connected');
            setIsReceivingCall(false);
            setShowFullscreenCall(true);
            
            // Start call timer
            startCallTimer();

            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
        } catch (error) {
            console.error('Error answering call:', error);
            endCall();
        }
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTracks = localStreamRef.current.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const startCallTimer = () => {
        // Clear any existing timer
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
        }
        
        // Reset duration
        setCallDuration(0);
        
        // Start a new timer that increments every second
        callTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
    };

    const formatCallDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isEndingCall = useRef(false);
    
    useEffect(() => {
        const handleIncomingCall = ({ offer }) => {
            try {
                const peerConnection = initializePeerConnection();
                setIsReceivingCall(true);
                setShowFullscreenCall(true);
                peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

                if (ringtoneRef.current) {
                    ringtoneRef.current.play().catch(err => {
                        console.warn("Couldn't play ringtone automatically:", err);
                    });
                }
            } catch (error) {
                console.error('Error handling incoming call:', error);
                endCall();
            }
        };

        const handleCallEnded = () => {
            if (isEndingCall.current) {
                return;
            }
            
            console.log("Call ended by remote party");
            isEndingCall.current = true;
            
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
            
            setIsReceivingCall(false);
            setCallNotification('Call ended by caller');
            
            clearNotificationTimeout();
            
            notificationTimeoutRef.current = setTimeout(() => {
                setCallNotification('');
                setShowFullscreenCall(false);
            }, 3000);
            
            setTimeout(() => {
                if (callStatus !== 'idle') {
                    endCall();
                } else {
                    cleanupMediaResources();
                    
                    if (peerConnectionRef.current) {
                        peerConnectionRef.current.close();
                        peerConnectionRef.current = null;
                    }
                }
                isEndingCall.current = false;
            }, 100);
        };

        socket.on('incoming-call', handleIncomingCall);

        socket.on('call-answered', ({ answer }) => {
            try {
                if (peerConnectionRef.current) {
                    peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                    setCallStatus('connected');
                    // Start call timer when call is connected
                    startCallTimer();
                }
            } catch (error) {
                console.error('Error handling call answer:', error);
                endCall();
            }
        });

        socket.on('ice-candidate', ({ candidate }) => {
            try {
                if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
                    peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        });

        socket.on('call-ended', handleCallEnded);

        return () => {
            socket.off('incoming-call', handleIncomingCall);
            socket.off('call-answered');
            socket.off('ice-candidate');
            socket.off('call-ended', handleCallEnded);
            
            endCall();
            clearNotificationTimeout();
        };
    }, [socket, receiverId]);

    // Small call button for header
    const renderCallButton = () => (
        <button 
            onClick={startCall}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full flex items-center justify-center transition-all"
            title="Start call"
        >
            <Phone size={20} />
        </button>
    );

    // Fullscreen call UI
    const renderFullscreenCallUI = () => {
        if (!showFullscreenCall) return null;

        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col items-center justify-center">
                {/* Close button */}
                <button 
                    onClick={() => {
                        if (callStatus === 'idle') {
                            setShowFullscreenCall(false);
                        } else {
                            endCall();
                        }
                    }}
                    className="absolute top-4 right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700"
                >
                    <X size={24} />
                </button>

                {/* Profile picture and status */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                            <img 
                                src={selectedUser?.profilePic || "/avatar.png"} 
                                alt={selectedUser?.firstName || "User"} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {callStatus === 'connected' && (
                            <div className="absolute bottom-2 right-0 bg-green-500 p-2 rounded-full">
                                <Phone size={20} className="text-white" />
                            </div>
                        )}
                    </div>
                    <h2 className="text-white text-2xl font-semibold">
                        {selectedUser?.firstName || "User"}
                    </h2>
                    <p className="text-gray-300 mt-1">
                        {isReceivingCall ? "Incoming call..." : 
                         callStatus === 'calling' ? "Calling..." : 
                         callStatus === 'connected' ? "On call" : 
                         callNotification || "Call ended"}
                    </p>
                    
                    {/* Call duration */}
                    {callStatus === 'connected' && (
                        <div className="text-gray-300 mt-2">
                            {formatCallDuration(callDuration)}
                        </div>
                    )}
                </div>

                {/* Call action buttons */}
                <div className="flex gap-6 mt-6">
                    {isReceivingCall ? (
                        <>
                            <button 
                                onClick={answerCall}
                                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full flex items-center justify-center transition-all"
                            >
                                <Phone size={24} />
                            </button>
                            <button 
                                onClick={endCall}
                                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full flex items-center justify-center transition-all"
                            >
                                <PhoneOff size={24} />
                            </button>
                        </>
                    ) : callStatus !== 'idle' ? (
                        <>
                            <button 
                                onClick={toggleMute}
                                className={`${isMuted ? 'bg-gray-600' : 'bg-gray-500'} hover:bg-gray-600 text-white p-4 rounded-full flex items-center justify-center transition-all`}
                            >
                                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                            </button>
                            <button 
                                onClick={endCall}
                                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full flex items-center justify-center transition-all"
                            >
                                <PhoneOff size={24} />
                            </button>
                        </>
                    ) : null}
                </div>

                {/* Status notification */}
                {callNotification && (
                    <div className="mt-6 px-4 py-2 bg-gray-800 rounded-lg text-white">
                        {callNotification}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Hidden audio elements */}
            <audio ref={ringtoneRef} src="./ringtone.mp3" loop />
            <audio id="remoteAudio" autoPlay />
            
            {/* Call button in header */}
            {renderCallButton()}
            
            {/* Fullscreen call interface */}
            {renderFullscreenCallUI()}
        </>
    );
};

export default VideoChat;