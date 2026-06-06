import React from 'react';
import { CompanionMessage } from '@/lib/companion';
import './Companion.css';

interface CompanionMessageListProps {
  messages: CompanionMessage[];
}

export const CompanionMessageList: React.FC<CompanionMessageListProps> = ({ messages }) => {
  return (
    <div className="companion-message-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message-bubble message-from-${msg.role}`}>
          <p>{msg.text}</p>
        </div>
      ))}
    </div>
  );
};
