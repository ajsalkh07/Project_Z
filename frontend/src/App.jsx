import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

export default function App() {
  const [meetingId, setMeetingId] = useState("");
  const [userId] = useState("user_1");
  const [joined, setJoined] = useState(false);

  const joinMeeting = () => {
    socket.emit("join-meeting", { meetingId, userId });
    setJoined(true);
  };

  useEffect(() => {
    socket.on("user-joined", (id) => console.log("Joined:", id));
    socket.on("user-left", (id) => console.log("Left:", id));
    socket.on("meeting-ended", () => alert("Meeting Ended"));

    return () => socket.off();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <>
          <h2>Project Z – Meeting</h2>
          <input
            placeholder="Meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
          />
          <br /><br />
          <button onClick={joinMeeting}>Join Meeting</button>
        </>
      ) : (
        <h3>In Meeting: {meetingId}</h3>
      )}
    </div>
  );
}
