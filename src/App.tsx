import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import HostRoom from "./components/room/HostRoom";
import ApprovalPending from "./components/home/ApprovalPending";
import ParticipantRoom from "./components/room/ParticipantRoom";

function App() {
  return (
    <>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path="/room/:sessionId" element={<HostRoom />} />
        <Route path="/approval/:sessionId" element={<ApprovalPending />} />
        <Route path="/:sessionId" element={<ParticipantRoom />} />
      </Routes>
    </>
  );
}

export default App;