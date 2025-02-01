import { useState } from "react";
import CreateMeeting from "./CreateMeeting";
import JoinMeeting from "./JoinMeeting";
import MeetingToggle from "./MeetingToggle";
import FeatureCard from "./FeatureCard";
import { BsCameraVideoFill } from "react-icons/bs";
import { MdScreenShare } from "react-icons/md";
import { SiLivechat } from "react-icons/si";

const Home = () => {
  const [meeting, setMeeting] = useState<"start" | "join">("start");

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) =>
    setMeeting(event.target.value as "start" | "join");

  return (
    <div className="w-screen min-h-screen flex flex-col pt-14">
      {/* Navbar */}
      <div className="bg-charcoal-7 w-full h-16 fixed top-0 left-0 flex items-center px-8 border-b border-b-charcoal-4 z-50">
        <div className="flex items-center gap-1">
          <span className="text-cobalt-3 text-3xl font-bold font-mono tracking-tighter">
            Vidi
          </span>
          <span className="text-4xl font-bold font-mono tracking-tighter bg-gradient-to-r from-cobalt-4 to-cobalt-6 bg-clip-text text-transparent">
            CON
          </span>
          <div className="w-1 h-8 bg-cobalt-4 rounded-full mx-2"></div>
          <span className="text-charcoal-2 text-sm font-light font-mono tracking-wide">
            Video Conferencing
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center flex-grow px-4 lg:px-8 py-8">
        {/* Left Section - Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mb-8 lg:mb-0 lg:pr-8">
          <h1 className="text-cobalt-4 text-4xl lg:text-5xl font-bold font-mono mb-6">
            Connect Instantly with Video Calls
          </h1>
          <p className="text-cobalt-3 text-lg lg:text-xl font-light font-mono max-w-md">
            High-quality video meetings accessible to everyone. No downloads
            required—just create or join with a single click.
          </p>
        </div>

        {/* Right Section - CreateMeeting Component */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:justify-start gap-6">
          <MeetingToggle meeting={meeting} onToggle={handleCheckbox} />

          {meeting === "start" ? (
            <CreateMeeting className="w-full" />
          ) : (
            <JoinMeeting />
          )}
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="bg-charcoal-7 py-12 px-4 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-cobalt-4 text-3xl lg:text-4xl font-bold font-mono text-center mb-8">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="HD Video Quality"
              description="Crystal clear video quality with automatic bandwidth optimization for smooth conversations."
              icon={BsCameraVideoFill}
              className="w-full"
            />

            <FeatureCard
              title="Screen Sharing"
              description="Share your screen with one click for effective collaboration and presentations."
              icon={MdScreenShare}
              className="w-full"
            />

            <FeatureCard
              title="Live Chat"
              description="Built-in chat functionality for sharing messages."
              icon={SiLivechat}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <footer className="bg-charcoal-7 py-6 px-4 lg:px-8 border-t border-t-charcoal-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-charcoal-2 text-sm font-light font-mono text-center">
            © 2024 VidiCON. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
