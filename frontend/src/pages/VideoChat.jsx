import { useEffect, useRef, useState } from 'react';
import {Phone} from "lucide-react"

const VideoChat = ({ socket, userId, receiverId }) => {
    // Store connection state
    const [callStatus, setCallStatus] = useState('idle'); // idle, calling, connected
    const [isReceivingCall, setIsReceivingCall] = useState(false);
    
    // WebRTC references
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    
    // Initialize WebRTC peer connection with STUN servers
    const initializePeerConnection = () => {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
        
        const peerConnection = new RTCPeerConnection(configuration);
        
        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', {
                    candidate: event.candidate,
                    to: receiverId
                });
            }
        };
        
        // Handle receiving remote stream
        peerConnection.ontrack = (event) => {
            remoteStreamRef.current = event.streams[0];
            const remoteAudio = document.getElementById('remoteAudio');
            if (remoteAudio) {
                remoteAudio.srcObject = event.streams[0];
            }
        };
        
        peerConnectionRef.current = peerConnection;
    };

    // Start call function
    const startCall = async () => {
        try {
            // Get local audio stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            
            // Add local stream to peer connection
            stream.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, stream);
            });
            
            // Create and send offer
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            
            socket.emit('call-user', {
                offer,
                to: receiverId
            });
            
            setCallStatus('calling');
        } catch (error) {
            console.error('Error starting call:', error);
        }
    };

    // Answer call function
    const answerCall = async () => {
        try {
            // Get local audio stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            
            // Add local stream to peer connection
            stream.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, stream);
            });
            
            // Create and send answer
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            
            socket.emit('call-answered', {
                answer,
                to: receiverId
            });
            
            setCallStatus('connected');
            setIsReceivingCall(false);
        } catch (error) {
            console.error('Error answering call:', error);
        }
    };

    // End call function
    const endCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        setCallStatus('idle');
        setIsReceivingCall(false);
        
        socket.emit('end-call', {
            to: receiverId
        });
    };

    useEffect(() => {
        // Initialize WebRTC peer connection
        initializePeerConnection();

        // Socket event listeners
        socket.on('incoming-call', ({ from, offer }) => {
            setIsReceivingCall(true);
            peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        });

        socket.on('call-answered', ({ answer }) => {
            peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            setCallStatus('connected');
        });

        socket.on('ice-candidate', ({ candidate }) => {
            peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on('call-ended', () => {
            endCall();
        });

        return () => {
            // Cleanup
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            
            // Remove socket listeners
            socket.off('incoming-call');
            socket.off('call-answered');
            socket.off('ice-candidate');
            socket.off('call-ended');
        };
    }, [socket, receiverId]);

    return (
        <div className="p-4 flex gap-5">
            <audio id="remoteAudio" autoPlay />
            
            {callStatus === 'idle' && !isReceivingCall && (
                <button 
                    onClick={startCall}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Start Call
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
            
            <div className="mt-2">
                Status: {callStatus}
            </div>
        </div>
    );
};

export default VideoChat;