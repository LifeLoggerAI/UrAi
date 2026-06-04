import React, { useState } from 'react';
import './Companion.css';

interface CompanionInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const CompanionInput: React.FC<CompanionInputProps> = ({ onSubmit, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="companion-input-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Ask URAI quietly..."
        className="companion-input"
        disabled={disabled}
      />
      <button type="submit" className="companion-send-button" disabled={disabled}>
        Send
      </button>
    </form>
  );
};
