import React, { useState, useEffect } from 'react';
import {
  CompanionMessage,
  getLocalCompanionResponse,
  getCompanionQuickPrompts,
} from '@/lib/companion';
import { CompanionMessageList } from './CompanionMessageList';
import { CompanionInput } from './CompanionInput';
import { CompanionQuickPrompts } from './CompanionQuickPrompts';
import './Companion.css';

interface CompanionShellProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanionShell: React.FC<CompanionShellProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getLocalCompanionResponse("welcome").message;
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = (text: string) => {
    const userMessage: CompanionMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    setTimeout(() => {
      const companionResponse = getLocalCompanionResponse(text);
      setMessages(prev => [...prev, companionResponse.message]);
      setIsSending(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="companion-shell-overlay">
      <div className="companion-shell">
        <div className="companion-header">
          <h2>Companion</h2>
          <button onClick={onClose} className="close-button" aria-label="Close Companion">&times;</button>
        </div>
        <CompanionMessageList messages={messages} />
        <CompanionQuickPrompts prompts={getCompanionQuickPrompts()} onPromptClick={handleSendMessage} />
        <CompanionInput onSubmit={handleSendMessage} disabled={isSending} />
      </div>
    </div>
  );
};
