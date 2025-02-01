import { useEffect, useRef, useState } from 'react';
import {Phone} from 'lucide-react'

const VideoChat = ({ socket, userId, receiverId }) => {
    const [callStatus, setCallStatus] = useState('idle');
    const [isReceivingCall, setIsReceivingCall] = useState(false);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const ringtoneRef = useRef(null); // Reference for ringtone audio

    // Refactor to ensure peer connection is created only once
    const initializePeerConnection = () => {
        if (peerConnectionRef.current) {
            console.log("Reusing existing peer connection.");
            return peerConnectionRef.current;
        }

        console.log('Initializing PeerConnection.');
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
            if (peerConnection.connectionState === 'failed') {
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

            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }

            const stream = await getMediaStream();
            if (!stream || stream.getTracks().length === 0) {
                throw new Error('No media tracks found in the stream.');
            }

            const peerConnection = initializePeerConnection();

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

    const endCall = () => {
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

        const remoteAudio = document.getElementById('remoteAudio');
        if (remoteAudio) {
            remoteAudio.srcObject = null;
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        setCallStatus('idle');
        setIsReceivingCall(false);

        socket.emit('end-call', {
            to: receiverId,
        });
    };

    const answerCall = async () => {
        try {
            if (callStatus === 'connected') {
                console.log('Call already connected.');
                return;
            }

            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }

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

    useEffect(() => {
        socket.on('incoming-call', ({ offer }) => {
            try {
                const peerConnection = initializePeerConnection();
                setIsReceivingCall(true);
                peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

                // Play ringtone when receiving a call
                if (ringtoneRef.current) {
                    ringtoneRef.current.play();
                }
            } catch (error) {
                console.error('Error handling incoming call:', error);
                endCall();
            }
        });

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
                if (peerConnectionRef.current) {
                    peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        });

        socket.on('call-ended', endCall);

        return () => {
            endCall();
            socket.off('incoming-call');
            socket.off('call-answered');
            socket.off('ice-candidate');
            socket.off('call-ended');
        };
    }, [socket, receiverId]);

    return (
        <div className="p-4 flex gap-5">
            <audio ref={ringtoneRef} src="./ringtone.mp3" loop />

            <audio id="remoteAudio" autoPlay />
            
            {callStatus === 'idle' && !isReceivingCall && (
                <button 
                    onClick={startCall}
                    className=" text-white px-4 py-2 rounded"
                >
                   <Phone/>
                </button>
            )}
            
            {isReceivingCall && (
                <button 
                    onClick={answerCall}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Answer Call
                </button>
            )}
            
            {callStatus !== 'idle' && (
                <button 
                    onClick={endCall}
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                >
                    End Call
                </button>
            )}

            {
                callStatus == 'idle' ? 
                <div> </div>
                 :
            <div className="mt-2">
            Status: {callStatus}
        </div>

            }
           
        </div>
    );
};

export default VideoChat;
