import { useRef, useState } from "react";

const MicControl = ({ username, robotId, socket }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioTrackRef = useRef(null);

  // Connect: start mic and notify server
  const connect = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTrack = stream.getTracks()[0];
      audioTrackRef.current = audioTrack;

      socket.emit("mic-status", {
        username,
        robotId,
        status: "on",
      });

      setIsConnected(true);
      setIsMuted(false);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  // Toggle mic mute/unmute
  const toggleMic = () => {
    if (!audioTrackRef.current) return;

    if (isMuted) {
      audioTrackRef.current.enabled = true;
      socket.emit("mic-status", { username, robotId, status: "on" });
    } else {
      audioTrackRef.current.enabled = false;
      socket.emit("mic-status", { username, robotId, status: "muted" });
    }

    setIsMuted(!isMuted);
  };

  // Disconnect: stop mic and notify server
  const disconnect = () => {
    if (audioTrackRef.current) {
      audioTrackRef.current.stop();
      audioTrackRef.current = null;
    }

    socket.emit("mic-status", {
      username,
      robotId,
      status: "off",
    });

    setIsConnected(false);
    setIsMuted(false);
  };

  return (
    <div className="mic-control">
      {!isConnected ? (
        <button onClick={connect} className="btn btn-connect">
          🎙️ Connect Mic
        </button>
      ) : (
        <div>
          <button onClick={toggleMic} className="btn btn-mute">
            {isMuted ? "🔊 Unmute" : "🔇 Mute"}
          </button>
          <button onClick={disconnect} className="btn btn-disconnect">
            ❌ Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default MicControl;
