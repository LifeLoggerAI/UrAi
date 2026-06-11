
import { NextPage } from "next";

const PassportPage: NextPage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#02040d] text-white">
      <div className="glass-card p-8 text-center">
        <h1 className="text-2xl font-semibold">Passport</h1>
        <p className="mt-2 text-white/70">Your preserved identity record will open here.</p>
      </div>
    </div>
  );
};

export default PassportPage;
