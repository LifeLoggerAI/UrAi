
'use client';

import { useState } from 'react';
import { NextPage } from 'next';
import { motion } from 'framer-motion';

const PassportPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#02040d] text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 text-center w-full max-w-2xl"
      >
        <h1 className="text-3xl font-bold tracking-wider">Passport</h1>
        <p className="mt-2 text-white/70">Your preserved identity record.</p>

        <div className="mt-8 flex justify-center border-b border-white/20">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
              activeTab === 'profile' ? 'border-b-2 border-white' : 'text-white/60'
            }`}>
            Profile
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
              activeTab === 'privacy' ? 'border-b-2 border-white' : 'text-white/60'
            }`}>
            Privacy & Consent
          </button>
        </div>

        <div className="mt-8 text-left">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-semibold">Your Digital Essence</h2>
              <p className="mt-4 text-white/80">
                This space will contain your unique URAI passport, a collection of your core traits, memories, and connections that define your digital identity within this space. It is a living record, evolving with you.
              </p>
              <p className="mt-4 text-white/60 text-sm">
                (This feature is under active development)
              </p>
            </motion.div>
          )}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-semibold">Your Sanctuary of Consent</h2>
              <p className="mt-4 text-white/80">
                URAI is designed with your privacy as its core principle. Here, you will have granular control over how your data is used, who can connect with you, and what parts of your identity are shared. You are the architect of your digital boundaries.
              </p>
              <p className="mt-4 text-white/60 text-sm">
                (This feature is under active development)
              </p>
            </motion.div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 bg-white/10 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 hover:bg-white/20"
          onClick={() => (window.location.href = '/galaxy')}
        >
          Return to Life Map
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PassportPage;
