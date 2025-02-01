import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { HostProvider } from "./context/HostProvider.tsx";
import { PeerProvider } from "./context/PeerProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <HostProvider>
      <PeerProvider>
          <App />
      </PeerProvider>
    </HostProvider>
  </BrowserRouter>
);
