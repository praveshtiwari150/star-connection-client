import React, { useContext, useEffect, useState } from "react";
import { SIGNALING_SERVER } from "../utils/constant";
import { useNavigate } from "react-router-dom";

interface HostProviderProps {
  children: React.ReactNode;
}

interface Participant {
  peerId: string;
  peerName: string;
  status: "accepted" | "pending";
  pc: RTCPeerConnection | null;
  dc: RTCDataChannel | null;
  stream: MediaStream | null;
}

interface Message {
  text: string;
  name: string;
  timestamp: number;
  peerId: string | null;
}

interface HostContextType {
  isHost: boolean;
  hostName: string | null;
  hostEmail: string | null;
  sessionId: string | null;
  hostWs: WebSocket | null;
  hostStream: MediaStream | null;
  setHostStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  screenStream: MediaStream | null;
  setScreenStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  isScreenSharingEnabled: boolean;
  participants: Participant[];
  startShareScreen: () => Promise<void>;
  stopShareScreen: (stream: MediaStream) => void;
  createMeeting: (hostName: string, hostEmail: string) => void;
  handleParticipantJoinRequest: (peerId: string, peerName: string) => void;
  acceptParticipant: (peerId: string) => void;
  removeAndUpdateParticipant: (peerId: string) => void;
  terminateSession: (flag: boolean) => void;
  messages: Message[];
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}

const HostContext = React.createContext<HostContextType | null>(null);

export const HostProvider = ({ children }: HostProviderProps) => {
  const [isHost, setIsHost] = useState<boolean>(false);
  const [hostName, setHostName] = useState<string | null>(null);
  const [hostEmail, setHostEmail] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hostWs, setHostWs] = useState<WebSocket | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [hostStream, setHostStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isScreenSharingEnabled, setIsScreenSharingEnabled] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  
  
  const navigate = useNavigate();

  const createMeeting = (hostName: string, hostEmail: string) => {
    const ws = new WebSocket(SIGNALING_SERVER);
    if (!ws) {
      console.log("Websocket instance not created.");
    }
    setIsHost(true);
    setHostName(hostName);
    setHostEmail(hostEmail);
    setHostWs(ws);
  };

  const handleParticipantJoinRequest = (peerId: string, peerName: string) => {
    setParticipants((prev) => [
      ...prev,
      { peerId, peerName, status: "pending", pc: null, dc: null, stream: null },
    ]);
  };

  const acceptParticipant = async (peerId: string) => {
    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel("streamdata");

    setParticipants((prevParticipants) =>
      prevParticipants.map((p) =>
        p.peerId === peerId ? { ...p, status: "accepted", pc, dc } : p
      )
    );

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        hostWs?.send(
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
      setParticipants((prevParticipants) =>
        prevParticipants.map((p) =>
          p.peerId === peerId ? { ...p, stream: newStream } : p
        )
      );
    };

    const participant = participants.find((p) => p.peerId === peerId);

    if (participant) {
      try {
        // adding the host's stream to the new participant
        if (hostStream) {
          hostStream.getTracks().forEach((track) => {
            pc.addTrack(track, hostStream);
          });
        }

        // share screen
        if (screenStream && isScreenSharingEnabled) {
          screenStream.getTracks().forEach((track) => {
            pc.addTrack(track, screenStream);
          });
        }

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("Sending initial offer to the host");
        hostWs?.send(
          JSON.stringify({
            type: "participant-added",
            peerId,
            sessionId,
            sdp: offer,
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const startShareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const track = screenStream.getVideoTracks()[0];

      participants.forEach(async (participant) => {
        if (participant.pc && screenStream) {
          screenStream.getTracks().forEach((track) => {
            participant.pc?.addTrack(track, screenStream);
          });

          const offer = await participant.pc.createOffer();
          await participant.pc.setLocalDescription(offer);
          hostWs?.send(
            JSON.stringify({
              type: "offer",
              peerId: participant.peerId,
              sessionId,
              sdp: offer,
            })
          );
        }
      });

      setScreenStream(screenStream);
      setIsScreenSharingEnabled(true);

      track.onended = () => {
        stopShareScreen(screenStream);
      };
    } catch (err) {
      console.log("Error accessing screenStream  ", err);
    }
  };

  const stopShareScreen = (stream: MediaStream) => {
    const trackId = stream.getTracks()[0].id;
    hostWs?.send(
      JSON.stringify({
        type: "stop-screen-stream",
        sessionId,
        trackId,
      })
    );

    stream.getTracks().forEach(track => track.stop());

    participants.forEach(participant => {
      if (participant.pc) {
        const sender = participant.pc.getSenders().find(s => s.track && s.track.kind === "video" && s.track.id === trackId);

        if (sender) {
          sender.replaceTrack(null);
        }
      }
    })
    setIsScreenSharingEnabled(false);
    setScreenStream(null);
    
  };

  const removeAndUpdateParticipant = (peerId: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.peerId !== peerId)
    );

    hostWs?.send(
      JSON.stringify({ type: "participant-rejected", peerId, sessionId })
    );
  };

  const handleAnswer = async (message: any) => {
    const { peerId, sdp } = message;
    const participant = participants.find((p) => p.peerId === peerId);
    if (participant) {
      const { pc } = participant;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      } else {
        console.log("pc not found for the participant");
      }
    } else {
      console.log("Participant not found");
    }
  };

  const handleIceCandidate = async (message: any) => {
    const { peerId, candidate } = message;
    const participant = participants.find((p) => p.peerId === peerId);
    if (participant) {
      const { pc } = participant;
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } else {
      console.log("Participant not found");
    }
  };

  const handleCloseConnection = async (message: any) => {
    const { peerId } = message;
    const participant = participants.find((p) => p.peerId === peerId);
    if (!participant) return;
    if (participant.pc) {
      participant.pc.getSenders().forEach((sender) => {
        participant.pc?.removeTrack(sender);
      });
      participant.pc.close();
    }

    setParticipants((prev) => prev.filter((p) => p.peerId !== peerId));
  };

  const terminateSession = (flag: boolean) => {
    if (hostWs?.readyState === WebSocket.OPEN) {
      hostWs?.send(
        JSON.stringify({
          type: "close-connection",
          from: "host",
          sessionId,
        })
      );

      hostWs?.close();
    }
    if (participants) {
      participants.forEach((participant) => {
        if (participant.pc && participant.pc.signalingState !== "closed") {
          participant.pc.getSenders().forEach((sender) => {
            participant.pc?.removeTrack(sender);
          });
          participant.pc.close();
        }
      });
    }

    if (hostStream) {
      hostStream.getTracks().forEach((track) => track.stop());
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }

    setHostEmail(null);
    setHostName(null);
    setSessionId(null);
    setHostWs(null);
    setParticipants([]);
    setHostStream(null);
    setScreenStream(null);
    setIsScreenSharingEnabled(false);
    setIsHost(false);
    setMessages([]);
    if (!flag) navigate("/");
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      hostWs?.send(JSON.stringify({
        type: "live-chat",
        text: inputMessage,
        name: "Host",
        timestamp: Date.now(),
        peerId: null,
        sessionId
      }))
    }
    setInputMessage("");
  }

  const handleLiveChat = (message: any) => {
    const { text, name, timestamp, peerId } = message;
    setMessages(prev => [...prev, { text, name, timestamp, peerId }]);
  }


  useEffect(() => {
    if (!hostWs) return;

    hostWs.onopen = () => {
      console.log("Host WebSocket connection opened");
      hostWs.send(JSON.stringify({ type: "create-meeting", email: hostEmail }));
    };

    hostWs.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "meeting-created":
          const { sessionId } = message;
          setSessionId(sessionId);
          navigate(`/room/${sessionId}`);
          break;

        case "join-request": {
          const { peerId, peerName } = message;
          handleParticipantJoinRequest(peerId, peerName);
          break;
        }
        case "answer":
          console.log("Answer recieved");
          handleAnswer(message);
          break;

        case "ice-candidate":
          handleIceCandidate(message);
          break;
        
        case "live-chat":
          handleLiveChat(message)
          break;

        case "participant-rejected": {
          const { peerId } = message;
          removeAndUpdateParticipant(peerId);
          break;
        }

        case "close-connection":
          handleCloseConnection(message);
          break;

        default:
          console.warn("Unhandled message type:", message.type);
      }
    };

    hostWs.onerror = () => {
      console.log("WebSocket connection error: ");
    };

    hostWs.onclose = () => {
      console.log("Host WebSocket connection closed");
    };
  }, [hostWs, createMeeting, participants]);

  const value = {
    isHost,
    hostName,
    hostEmail,
    sessionId,
    hostWs,
    hostStream,
    setHostStream,
    screenStream,
    setScreenStream,
    isScreenSharingEnabled,
    participants,
    startShareScreen,
    stopShareScreen,
    createMeeting,
    handleParticipantJoinRequest,
    acceptParticipant,
    removeAndUpdateParticipant,
    terminateSession,
    messages,
    inputMessage,
    setInputMessage,
    handleSendMessage,
  };

  return <HostContext.Provider value={value}>{children}</HostContext.Provider>;
};

export const useHost = () => {
  const context = useContext(HostContext);
  if (!context) {
    throw new Error("useHost must be used within a HostProvider");
  }
  return context;
};
