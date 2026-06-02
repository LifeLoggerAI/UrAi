import React, { useState, useEffect, useRef } from 'react';
import styles from './UraiCompanionShell.module.css';
import { CompanionMessage, CompanionMode, CompanionQuickPrompt } from '../../lib/companion/companionTypes';
import { generateLocalCompanionResponse } from '../../lib/companion/localCompanionResponder';
import { URAI_COUNCIL_ROLES, UraiCouncilRole, getCouncilRole } from '../../lib/council/uraiCouncilRoles';
import { COMPANION_QUICK_PROMPTS, COUNCIL_GUIDE_QUICK_PROMPTS, COUNCIL_MIRROR_QUICK_PROMPTS, COUNCIL_GUARDIAN_QUICK_PROMPTS } from '../../lib/companion/quickPrompts';

type GenesisMoodState = string; // Using fallback type

type UraiCompanionShellProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "companion" | "council";
  moodState?: GenesisMoodState;
  onLifeMapOpen?: () => void;
  onPassportOpen?: () => void;
  onSettingsOpen?: () => void;
  onOrbFocusReturn?: () => void;
};

export default function UraiCompanionShell({ 
    isOpen, 
    onClose, 
    initialMode = 'companion', 
    moodState,
    onLifeMapOpen,
    onPassportOpen 
}: UraiCompanionShellProps) {
    const [currentMode, setCurrentMode] = useState<CompanionMode>(initialMode);
    const [messages, setMessages] = useState<CompanionMessage[]>([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [activeCouncilRole, setActiveCouncilRole] = useState<string>('guide');
    const messageListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 'initial-whisper',
                role: 'urai',
                mode: 'companion',
                text: 'I’m here.',
                createdAt: new Date().toISOString(),
                source: 'systemWhisper'
            }]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSend = (text?: string) => {
        const messageText = text || input;
        if (!messageText.trim() || isSending) return;

        const userMessage: CompanionMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            mode: currentMode,
            councilRoleId: currentMode === 'council' ? activeCouncilRole: undefined,
            text: messageText,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsSending(true);

        setTimeout(() => {
            if (messageText.toLowerCase().includes('life map') && onLifeMapOpen) {
                onLifeMapOpen();
                onClose();
                return;
            }
            if (messageText.toLowerCase().includes('passport') && onPassportOpen) {
                onPassportOpen();
                onClose();
                return;
            }

            const response = generateLocalCompanionResponse(
                { text: messageText }, 
                { mode: currentMode, councilRoleId: activeCouncilRole, moodState }
            );
            setMessages(prev => [...prev, response]);
            setIsSending(false);
        }, 500);
    };
    
    const renderQuickPrompts = () => {
        let prompts: CompanionQuickPrompt[] = COMPANION_QUICK_PROMPTS;
        if (currentMode === 'council') {
            switch (activeCouncilRole) {
                case 'guide': prompts = COUNCIL_GUIDE_QUICK_PROMPTS; break;
                case 'mirror': prompts = COUNCIL_MIRROR_QUICK_PROMPTS; break;
                case 'guardian': prompts = COUNCIL_GUARDIAN_QUICK_PROMPTS; break;
            }
        }

        return prompts.map(p => <button key={p.id} className={styles.quickPromptButton} onClick={() => handleSend(p.prompt)}>{p.label}</button>)
    }

    if (!isOpen) return null;

    return (
        <div className={styles.companionShellOpen} role="dialog" aria-modal="true">
            <div className={styles.companionBackdrop} onClick={onClose}></div>
            <div className={styles.companionShell}>
                <div className={styles.companionHeader}>
                    <span className={styles.companionTitle}>URAI</span>
                    <button className={styles.closeButton} aria-label="Close Companion" onClick={onClose}>×</button>
                </div>
                
                <div className={styles.companionModeToggle}>
                    <button 
                        className={`${styles.companionModeButton} ${currentMode === 'companion' ? styles.companionModeButtonActive : ''}`}
                        onClick={() => setCurrentMode('companion')}>
                        Companion
                    </button>
                    <button 
                        className={`${styles.companionModeButton} ${currentMode === 'council' ? styles.companionModeButtonActive : ''}`}
                        onClick={() => setCurrentMode('council')}>
                        Council
                    </button>
                </div>

                {currentMode === 'council' && (
                    <div className={styles.councilRoleRow}>
                        {URAI_COUNCIL_ROLES.filter(r => r.enabled).map(role => (
                            <button 
                                key={role.id} 
                                className={`${styles.councilRoleButton} ${activeCouncilRole === role.id ? styles.councilRoleButtonActive : ''}`}
                                onClick={() => setActiveCouncilRole(role.id)}>
                                {role.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className={styles.messageList} ref={messageListRef}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`${styles.messageBubble} ${msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleUrai}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className={styles.quickPromptRow}>
                    {renderQuickPrompts()}
                </div>

                <div className={styles.composer}>
                    <textarea 
                        className={styles.composerInput}
                        placeholder='Ask URAI…'
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey ? (handleSend(), e.preventDefault()) : null}
                        rows={1}
                        maxLength={500}
                    />
                    <button className={styles.sendButton} onClick={() => handleSend()} disabled={isSending}>Send</button>
                </div>
            </div>
        </div>
    );
}
