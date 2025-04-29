import { useEffect, useRef, useState } from 'react';
import { Video, Phone, VideoOff, MicOff, Mic } from 'lucide-react';

const VideoChat = ({ socket, userId, receiverId }) => {
    const [callStatus, setCallStatus] = useState('idle');
    const [isReceivingCall, setIsReceivingCall] = useState(false);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const ringtoneRef = useRef(null); // Reference for ringtone audio
    const localVideoRef = useRef(null); // Reference for local video element
    const remoteVideoRef = useRef(null); // Reference for remote video element
    
    // Media controls
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    // Add a state to show call notifications
    const [callNotification, setCallNotification] = useState('');
    
    // Ref to hold timeout ID for notifications
    const notificationTimeoutRef = useRef(null);

    // Clear any existing notification timeouts
    const clearNotificationTimeout = () => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }
    };

    // Refactor to ensure peer connection is created only once per call attempt
    const initializePeerConnection = () => {
        // Always clear existing connection first
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        console.log('Initializing new PeerConnection.');
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.google.com:19302' },
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
            
            // Set the remote video source
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
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

            // Clean up any existing call resources
            cleanupMediaResources();

            // Create a fresh peer connection for each new call
            const peerConnection = initializePeerConnection();

            const stream = await getMediaStream();
            if (!stream || stream.getTracks().length === 0) {
                throw new Error('No media tracks found in the stream.');
            }

            localStreamRef.current = stream;
            
            // Set the local video source
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            
            stream.getTracks().forEach((track) => {
                console.log('Adding track:', track.kind);
                peerConnection.addTrack(track, stream);
            });

            const offer = await peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            
            console.log("offer", offer);
            await peerConnection.setLocalDescription(offer);

            socket.emit('call-user', { 
                offer, 
                to: receiverId 
            });
            setCallStatus('calling');
        } catch (error) {
            console.error('Error starting call:', error);
            endCall();
        }
    };

    const getMediaStream = async () => {
        try {
            return await navigator.mediaDevices.getUserMedia({ 
                audio: true, 
                video: isVideoEnabled 
            });
        } catch (error) {
            console.error('Error accessing user media:', error);
            throw new Error('Failed to access media devices. Please check permissions.');
        }
    };

    // New helper function to clean up media resources
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

        // Stop ringtone if playing
        if (ringtoneRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0; // Reset to the beginning
        }

        // Clear video elements
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
    };

    const endCall = () => {
        // Prevent ending a call that's already ended
        if (callStatus === 'idle' && !isReceivingCall) {
            return;
        }
        
        console.log("Ending call...");
        
        // Clean up media resources
        cleanupMediaResources();

        // Close the peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        setCallStatus('idle');
        setIsReceivingCall(false);

        // Only emit end-call if we're not responding to a call-ended event
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

            // Clean up any existing call resources
            cleanupMediaResources();

            const stream = await getMediaStream();
            localStreamRef.current = stream;
            
            // Set the local video source
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

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

            // Stop the ringtone after answering the call
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0; // Reset to the beginning
            }
        } catch (error) {
            console.error('Error answering call:', error);
            endCall();
        }
    };
    
    // Toggle microphone
    const toggleMicrophone = () => {
        if (localStreamRef.current) {
            const audioTracks = localStreamRef.current.getAudioTracks();
            if (audioTracks.length > 0) {
                const enabled = !isMuted;
                audioTracks.forEach(track => {
                    track.enabled = enabled;
                });
                setIsMuted(!enabled);
            }
        }
    };
    
    // Toggle video
    const toggleVideo = async () => {
        const newVideoState = !isVideoEnabled;
        setIsVideoEnabled(newVideoState);
        
        if (localStreamRef.current && callStatus !== 'idle') {
            // Stop all video tracks
            const videoTracks = localStreamRef.current.getVideoTracks();
            videoTracks.forEach(track => {
                track.stop();
            });
            
            try {
                // Get new stream with updated video state
                const newStream = await navigator.mediaDevices.getUserMedia({ 
                    audio: true, 
                    video: newVideoState 
                });
                
                // Replace the tracks in the peer connection
                if (peerConnectionRef.current) {
                    const senders = peerConnectionRef.current.getSenders();
                    
                    // Replace audio track
                    const audioTrack = newStream.getAudioTracks()[0];
                    const audioSender = senders.find(sender => 
                        sender.track && sender.track.kind === 'audio'
                    );
                    if (audioSender && audioTrack) {
                        audioSender.replaceTrack(audioTrack);
                    }
                    
                    // Replace video track or add it if it doesn't exist
                    if (newVideoState) {
                        const videoTrack = newStream.getVideoTracks()[0];
                        const videoSender = senders.find(sender => 
                            sender.track && sender.track.kind === 'video'
                        );
                        
                        if (videoSender && videoTrack) {
                            videoSender.replaceTrack(videoTrack);
                        } else if (videoTrack) {
                            peerConnectionRef.current.addTrack(videoTrack, newStream);
                        }
                    } else {
                        // If video is disabled, we can just set the track to null
                        const videoSender = senders.find(sender => 
                            sender.track && sender.track.kind === 'video'
                        );
                        if (videoSender) {
                            videoSender.replaceTrack(null);
                        }
                    }
                }
                
                // Update local stream reference and video element
                localStreamRef.current = newStream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = newStream;
                }
            } catch (error) {
                console.error('Error toggling video:', error);
            }
        }
    };

    // Flag to prevent infinite loops in event handlers
    const isEndingCall = useRef(false);
    
    useEffect(() => {
        // Handler for incoming calls
        const handleIncomingCall = ({ offer }) => {
            try {
                // Create a fresh peer connection for each incoming call
                const peerConnection = initializePeerConnection();
                setIsReceivingCall(true);
                peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

                // Play ringtone when receiving a call
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

        // Handler for call declined or ended by remote party
        const handleCallEnded = () => {
            // Prevent infinite loop
            if (isEndingCall.current) {
                return;
            }
            
            console.log("Call ended by remote party");
            isEndingCall.current = true;
            
            // Immediately stop ringtone if it's playing
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
            
            // Reset receiving call state immediately to update UI
            setIsReceivingCall(false);
            
            // Show call ended notification for a few seconds
            setCallNotification('Call ended by caller');
            
            // Clear previous timeout if exists
            clearNotificationTimeout();
            
            // Set timeout to clear notification after 3 seconds
            notificationTimeoutRef.current = setTimeout(() => {
                setCallNotification('');
            }, 3000);
            
            // Use timeout to ensure we're not in a recursive loop
            setTimeout(() => {
                if (callStatus !== 'idle') {
                    endCall();
                } else {
                    // Even if we're in idle state, clean up any lingering resources
                    cleanupMediaResources();
                    
                    // Close any existing peer connection
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
            
            // Cleanup when component unmounts
            endCall();
        };
    }, [socket, receiverId]);

    return (
        <div className="flex flex-col w-full max-w-3xl mx-auto">
            <audio ref={ringtoneRef} src="./ringtone.mp3" loop />
            
            {/* Video container - only show when in a call or calling */}
            {(callStatus !== 'idle' || isReceivingCall) && (
                <div className="relative w-full bg-gray-800 rounded-lg overflow-hidden aspect-video mb-4">
                    {/* Remote video (large) */}
                    <video 
                        ref={remoteVideoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                    />
                    
                    {/* Local video (small overlay) */}
                    <div className="absolute bottom-2 right-2 w-1/4 aspect-video bg-gray-900 rounded overflow-hidden shadow-lg">
                        <video 
                            ref={localVideoRef}
                            className="w-full h-full object-cover mirror"
                            autoPlay
                            playsInline
                            muted // Mute local video to prevent echo
                        />
                    </div>
                </div>
            )}
            
            {/* Call controls */}
            <div className="flex justify-center gap-4 mb-4">
                {callStatus === 'idle' && !isReceivingCall && (
                    <button 
                        onClick={startCall}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
                    >
                        <Video size={18} />
                        <span>Video Call</span>
                    </button>
                )}
                
                {isReceivingCall && (
                    <div className="flex gap-4 justify-center items-center">
                        <button 
                            onClick={answerCall}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full flex items-center gap-2"
                        >
                            <Phone size={18} />
                            <span>Answer</span>
                        </button>
                        <button 
                            onClick={endCall}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full flex items-center gap-2"
                        >
                            <Phone size={18} />
                            <span>Decline</span>
                        </button>
                    </div>
                )}
                
                {callStatus !== 'idle' && !isReceivingCall && (
                    <div className="flex gap-4 justify-center items-center">
                        {/* Mute/Unmute button */}
                        <button 
                            onClick={toggleMicrophone}
                            className={`${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'} text-white p-3 rounded-full`}
                        >
                            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        
                        {/* Video on/off button */}
                        <button 
                            onClick={toggleVideo}
                            className={`${!isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'} text-white p-3 rounded-full`}
                        >
                            {!isVideoEnabled ? <VideoOff size={20} /> : <Video size={20} />}
                        </button>
                        
                        {/* End call button */}
                        <button 
                            onClick={endCall}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
                        >
                            End Call
                        </button>
                    </div>
                )}
            </div>

            {/* Status indicators */}
            <div className="text-center">
                {callStatus !== 'idle' && (
                    <div className="text-blue-600 font-medium">
                        Status: {callStatus}
                    </div>
                )}
                
                {isReceivingCall && (
                    <div className="text-green-600 font-medium animate-pulse">
                        Incoming video call...
                    </div>
                )}
                
                {callNotification && (
                    <div className="text-red-500 font-medium">
                        {callNotification}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoChat;