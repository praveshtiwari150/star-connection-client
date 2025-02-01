import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SIGNALING_SERVER } from "../utils/constant";

interface PeerProviderProps {
  children: React.ReactNode;
}

interface Message {
  text: string;
  name: string;
  timestamp: number;
  peerId: string | null;
}

interface PeerContextType {
  peerId: string | null;
  peerName: string | null;
  sessionId: string | null;
  status: "accepted" | "rejected" | "pending" | "invalid" | null;
  peerSocket: WebSocket | null;
  pc: RTCPeerConnection | null;
  peerStream: MediaStream | null;
  hostStream: MediaStream | null;
  screenStream: MediaStream | null;
  streams: MediaStream[];
  isVideoEnabled: boolean;
  setIsVideoEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isAudioEnabled: boolean;
  setIsAudioEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setPeerStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  sendJoinRequest: (name: string, sessionId: string) => void;
  terminateSession: (flag: boolean) => void;
  messages: Message[];
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}

const PeerContext = React.createContext<PeerContextType | null>(null);

export const PeerProvider = ({ children }: PeerProviderProps) => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [peerName, setPeerName] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "accepted" | "rejected" | "pending" | "invalid" | null
  >(null);
  const [peerSocket, setpeerSocket] = useState<WebSocket | null>(null);
  let pc: RTCPeerConnection | null = null;
  const navigate = useNavigate();
  const [peerStream, setPeerStream] = useState<MediaStream | null>(null);
  const [hostStream, setHostStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [streams, setStreams] = useState<MediaStream[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  const getPeerStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setPeerStream(stream);

      stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = isVideoEnabled));
      stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = isAudioEnabled));
    } catch (err) {
      console.log("Error while accessing the stream: ", err);
    }
  };

  const sendJoinRequest = async (name: string, sessionId: string) => {
    await getPeerStream();
    const ws = new WebSocket(SIGNALING_SERVER);
    setpeerSocket(ws);
    setSessionId(sessionId);
    setPeerName(name);
    setStatus("pending");
  };

  const handleParticipantAdded = async (message: any) => {
    const { peerId, sdp } = message;
    pc = new RTCPeerConnection();
    setPeerId(peerId);
    setStatus("accepted");

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        peerSocket?.send(
          JSON.stringify({
            type: "ice-candidate",
            peerId,
            sessionId,
            candidate: event.candidate,
          })
        );
      } else {
        console.log("Ice gathering complete");
      }
    };
    pc.ontrack = (event) => {
      const newStream = event.streams[0];

      setStreams((prev) => {
        const isDuplicate = prev.some((stream) => stream.id === newStream.id);
        if (!isDuplicate) {
          return [...prev, newStream];
        } else {
          return prev;
        }
      });
    };

    // Add the local participant's stream to the peer connection
    if (peerStream) {
      peerStream.getTracks().forEach((track) => {
        pc?.addTrack(track, peerStream);
      });
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      peerSocket?.send(
        JSON.stringify({
          type: "answer",
          sessionId,
          peerId,
          sdp: answer,
        })
      );
    } catch (err) {
      console.error("Error during the participant add process:", err);
    }

    pc.onconnectionstatechange = () => {
      if (pc?.connectionState === "closed") {
        console.log("connection state changed to close");
      }
    };
  };

  const handleIceCandidate = async (message: any) => {
    const { candidate } = message;
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const handleOffer = async (message: any) => {
    const { sdp, peerId } = message;
    setPeerId(peerId);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (peerSocket) {
        peerSocket.send(
          JSON.stringify({
            type: "answer",
            peerId,
            sessionId,
            sdp: answer,
            for: "screen share",
          })
        );
      }

      if (!peerSocket) {
        console.log("peerSocket not found");
      }
    }

    if (!pc) {
      console.log("Pc not found");
    }
  };

  const removeScreenStream = (message: any) => {
    const { trackId } = message;
    console.log(trackId);
    setStreams((prev) => {
      return prev.filter(
        (stream) => !stream.getTracks().some((track) => track.id === trackId)
      );
    });
  };

  const terminateSession = (flag: boolean) => {
    if (pc) {
      pc.getSenders().forEach((sender) => {
        pc?.removeTrack(sender);
      });
      pc.close();
      pc = null;
    }

    if (peerStream) {
      peerStream.getTracks().forEach((track) => track.stop());
    }

    if (peerSocket && peerSocket.readyState !== WebSocket.CLOSED) {
      peerSocket.send(
        JSON.stringify({
          type: "close-connection",
          from: "peer",
          peerId,
          sessionId,
        })
      );
      peerSocket.close();
    }
    setpeerSocket(null);
    setPeerId(null);
    setSessionId(null);
    setPeerName(null);
    setPeerStream(null);
    setStreams([]);
    setStatus(null);
    setMessages([]);
    if (!flag) navigate("/");
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      peerSocket?.send(
        JSON.stringify({
          type: "live-chat",
          text: inputMessage,
          name: peerName,
          timestamp: Date.now(),
          peerId: peerId,
          sessionId,
        })
      );
    }
    setInputMessage("");
  };

  const handleLiveChat = (message: any) => {
    const { text, name, timestamp, peerId } = message;
    setMessages((prev) => [...prev, { text, name, timestamp, peerId }]);
  };

  useEffect(() => {
    if (streams.length === 1) {
      setHostStream(streams[0]);
      setScreenStream(null);
    }
    if (streams.length === 2) {
      setHostStream(streams[0]);
      setScreenStream(streams[1]);
    }
  }, [streams]);


  useEffect(() => {
    if (!peerSocket) return;

    peerSocket.onopen = () => {
      peerSocket.send(
        JSON.stringify({ type: "join-meeting", peerName, sessionId })
      );
      navigate(`/approval/${sessionId}`);
    };

    peerSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "participant-added":
          handleParticipantAdded(message);
          break;
        case "ice-candidate":
          handleIceCandidate(message);
          break;
        case "participant-rejected":
          if (peerStream) {
            peerStream.getTracks().forEach((track) => track.stop());
          }
          setPeerStream(null);
          setStatus("rejected");
          break;

        case "offer":
          handleOffer(message);
          break;

        case "stop-screen-stream":
          removeScreenStream(message);
          break;

        case "live-chat":
          handleLiveChat(message);
          break;

        case "close-connection":
          terminateSession(false);
          break;

        default:
          console.warn("Unhandled message type:", message.type);
      }
    };

    peerSocket.onclose = () => {
      console.log("peerSocket connection closed");
      terminateSession(false);
    };

    peerSocket.onerror = (err) => {
      console.log("peerSocket error: ", err);

      return () => {
        terminateSession(true);
      };
    };
  }, [peerSocket]);

  const value = {
    peerId,
    peerName,
    sessionId,
    status,
    peerSocket,
    pc,
    peerStream,
    hostStream,
    screenStream,
    streams,
    isVideoEnabled,
    setIsVideoEnabled,
    isAudioEnabled,
    setIsAudioEnabled,
    setPeerStream,
    sendJoinRequest,
    terminateSession,
    messages,
    inputMessage,
    setInputMessage,
    handleSendMessage,
  };

  return <PeerContext.Provider value={value}>{children}</PeerContext.Provider>;
};

export const usePeer = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }
  return context;
};
