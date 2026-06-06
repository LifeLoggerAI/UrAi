import React from 'react';
import { CompanionQuickPrompt } from '@/lib/companion';
import './Companion.css';

interface CompanionQuickPromptsProps {
  prompts: CompanionQuickPrompt[];
  onPromptClick: (prompt: string) => void;
}

export const CompanionQuickPrompts: React.FC<CompanionQuickPromptsProps> = ({ prompts, onPromptClick }) => {
  return (
    <div className="companion-quick-prompts">
      {prompts.map((p) => (
        <button key={p.id} onClick={() => onPromptClick(p.prompt)} className="quick-prompt-button">
          {p.label}
        </button>
      ))}
    </div>
  );
};
