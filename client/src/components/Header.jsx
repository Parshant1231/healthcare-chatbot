import { FaBrain } from "react-icons/fa";

export const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg z-50">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          <FaBrain className="text-3xl text-white/90 animate-pulse" />
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">
              MindCare Companion
            </h1>
            <p className="text-sm md:text-base text-white/90 tracking-wide">
              Your Private Emotional Wellness Partner
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};