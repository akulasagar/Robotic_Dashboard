import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Room, RoomEvent, RemoteParticipant, Track } from 'livekit-client';
 // We'll create this file for styling

const VideoStreaming = ({ serverUrl, roomName, viewerName }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [remoteTrack, setRemoteTrack] = useState(null);
    const [room, setRoom] = useState(null);
    const videoRef = useRef(null);

    // Function to handle a new video track being subscribed
    const handleTrackSubscribed = (track, publication, participant) => {
        if (track.kind === Track.Kind.Video) {
            console.log(`Subscribed to video track from: ${participant.identity}`);
            // Set the first video track we find
            if (!remoteTrack) {
                setRemoteTrack(track);
            }
        }
    };

    // Function to handle a participant disconnecting
    const handleParticipantDisconnected = (participant) => {
        console.log(`Participant disconnected: ${participant.identity}`);
        // If the participant with the current video track leaves, clear it
        if (remoteTrack && remoteTrack.sid.startsWith(participant.sid)) {
            setRemoteTrack(null);
        }
    };

    // Main connection function, wrapped in useCallback for stability
    const connectToRoom = useCallback(async () => {
        if (isConnected || room) return;

        console.log('Attempting to connect...');
        
        try {
            // 1. Fetch Token from your server
            const response = await fetch(`${serverUrl}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomName, participantName: viewerName }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch token: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const { url, token } = data;

            // 2. Create and configure the Room object
            const newRoom = new Room({
                adaptiveStream: true,
                dynacast: true,
            });

            // 3. Set up event listeners
            newRoom
                .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
                .on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected)
                .on(RoomEvent.Disconnected, () => {
                    console.log('Disconnected from room');
                    setIsConnected(false);
                    setRemoteTrack(null);
                    setRoom(null); // Clean up the room object
                });

            // 4. Connect to the room
            await newRoom.connect(url, token);
            
            console.log(`Successfully connected to room: ${newRoom.name}`);
            setRoom(newRoom);
            setIsConnected(true);

        } catch (error) {
            console.error("Failed to connect to LiveKit room:", error);
            alert("Connection failed. Check the console for details.");
            setIsConnected(false);
        }
    }, [serverUrl, roomName, viewerName, isConnected, room, remoteTrack]); // Dependencies for useCallback

    // Disconnection function
    const disconnectFromRoom = async () => {
        if (room) {
            await room.disconnect();
            // The 'Disconnected' event listener will handle the state cleanup
        }
    };

    // useEffect to attach the video track to the <video> element
    useEffect(() => {
        if (remoteTrack && videoRef.current) {
            remoteTrack.attach(videoRef.current);
        }

        // Cleanup function to detach the track when it changes or on unmount
        return () => {
            if (remoteTrack) {
                remoteTrack.detach();
            }
        };
    }, [remoteTrack]);
    
    // useEffect for component cleanup
    useEffect(() => {
        return () => {
            if(room) {
                room.disconnect();
            }
        }
    }, [room]);


    return (
        <div className="livekit-container">
            <div className="video-wrapper">
                {remoteTrack ? (
                    <video ref={videoRef} width="100%" height="auto" />
                ) : (
                    <div className="video-placeholder">
                        <p>Waiting for video stream...</p>
                        {!isConnected && <small>Press "Start" to connect</small>}
                    </div>
                )}
            </div>
            <div className="controls">
                <button onClick={connectToRoom} disabled={isConnected}>
                    Start
                </button>
                <button onClick={disconnectFromRoom} disabled={!isConnected}>
                    Stop
                </button>
            </div>
        </div>
    );
};

export default VideoStreaming;