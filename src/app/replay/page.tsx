
import { NextPage } from "next";

const ReplayPage: NextPage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#02040d] text-white">
      <div className="glass-card p-8 text-center">
        <h1 className="text-2xl font-semibold">Replay</h1>
        <p className="mt-2 text-white/70">Your memory replay will open here.</p>
      </div>
    </div>
  );
};

export default ReplayPage;
