'use client';

import { ConsentGate } from '@/components/privacy/ConsentGate';
import { useUraiOnboarding } from '@/providers/UraiOnboardingProvider';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { OnboardingChoice } from '@/lib/onboarding/onboardingTypes';
import { ONBOARDING_STEP_ORDER } from '@/lib/onboarding/onboardingTypes';

type UraiOnboardingFlowProps = {
    isOpen: boolean;
    onComplete: () => void;
    onSkip: () => void;
    onOpenPassport?: () => void;
    onOpenLifeMapPreview?: () => void;
    onOpenGroundPreview?: () => void;
    onOpenCompanion?: () => void;
    onEnableSound?: () => void;
    onKeepSoundOff?: () => void;
    onEnableNotifications?: () => void;
    onKeepNotificationsOff?: () => void;
};

function progressFor(stepId: string): string {
    const index = ONBOARDING_STEP_ORDER.indexOf(stepId as never);
    if (index < 0) return '0%';
    return `${Math.round(((index + 1) / ONBOARDING_STEP_ORDER.length) * 100)}%`;
}

export function UraiOnboardingFlow({ isOpen, onComplete, onSkip, onOpenPassport, onOpenLifeMapPreview, onOpenGroundPreview, onOpenCompanion, onEnableSound, onKeepSoundOff, onEnableNotifications, onKeepNotificationsOff }: UraiOnboardingFlowProps) {
    const reduceMotion = useReducedMotion();
    const onboarding = useUraiOnboarding();
    const firstButtonRef = useRef<HTMLButtonElement | null>(null);
    const step = onboarding.currentStep;

    useEffect(() => {
        if (!isOpen) return;
        const timeout = window.setTimeout(() => firstButtonRef.current?.focus(), 80);
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onboarding.skipOnboarding();
                onSkip();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.clearTimeout(timeout);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, onboarding, onSkip, step.id]);

    const finishOrAdvance = () => {
        if (step.id === 'complete') {
            onboarding.completeOnboarding();
            onComplete();
            return;
        }
        onboarding.completeStep(step.id);
    };

    const handleChoice = (choice: OnboardingChoice) => {
        if (choice.action === 'skip') {
            onboarding.skipOnboarding();
            onSkip();
            return;
        }
        if (choice.action === 'open_passport') onOpenPassport?.();
        if (choice.action === 'apply_safe_defaults') onboarding.applySafeDefaults();
        if (choice.action === 'enable_sound') {
            onboarding.markSoundOffered();
            onEnableSound?.();
        }
        if (choice.action === 'keep_sound_off') {
            onboarding.markSoundOffered();
            onKeepSoundOff?.();
        }
        if (choice.action === 'enable_notifications') {
            onboarding.markNotificationsOffered();
            onEnableNotifications?.();
        }
        if (choice.action === 'keep_notifications_off') {
            onboarding.markNotificationsOffered();
            onKeepNotificationsOff?.();
        }
        if (choice.action === 'open_life_map_preview') onOpenLifeMapPreview?.();
        if (choice.action === 'open_ground_preview') onOpenGroundPreview?.();
        if (choice.action === 'open_companion') onOpenCompanion?.();
        finishOrAdvance();
    };

    const renderContent = () => {
        if (step.consentLayerId) {
            return (
                <ConsentGate
                    layerId={step.consentLayerId}
                    onConfirm={() => {
                        if (step.id === 'passport_intro') {
                            onOpenPassport?.();
                        }
                        finishOrAdvance();
                    }}
                    onCancel={finishOrAdvance}
                    onReviewPassport={onOpenPassport}
                />
            );
        }

        return (
            <div className="relative z-10">
                <div className="mb-5 h-1 overflow-hidden rounded-full bg-white/[0.07]" aria-hidden="true">
                    <div className="h-full rounded-full bg-white/28 transition-all" style={{ width: progressFor(step.id) }} />
                </div>
                <div className="mb-5 flex items-center gap-3">
                    <motion.div className="h-12 w-12 rounded-full border border-white/20 bg-white/10 shadow-[0_0_34px_rgba(190,215,255,0.36)]" animate={reduceMotion ? undefined : { scale: [1, 1.045, 1], opacity: [0.75, 1, 0.75] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
                    <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/42">Genesis entry</p>
                        {step.caption ? <p className="mt-1 text-sm text-white/60">{step.caption}</p> : null}
                    </div>
                </div>
                <h2 id="urai-onboarding-title" className="text-3xl font-medium tracking-[-0.03em] text-white md:text-4xl">{step.title}</h2>
                <p className="mt-4 max-w-lg text-base leading-7 text-white/70">{step.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {step.choices.map((choice, index) => (
                        <button
                            key={choice.id}
                            ref={index === 0 ? firstButtonRef : undefined}
                            type="button"
                            onClick={() => handleChoice(choice)}
                            className={index === 0 ? 'rounded-full bg-white/16 px-4 py-2 text-sm text-white shadow-[0_0_24px_rgba(255,255,255,0.1)]' : 'rounded-full bg-white/[0.07] px-4 py-2 text-sm text-white/68'}
                        >
                            {choice.label}
                        </button>
                    ))}
                </div>
                <button type="button" onClick={() => { onboarding.skipOnboarding(); onSkip(); }} className="mt-5 text-xs text-white/42 underline-offset-4 hover:text-white/66 hover:underline">Skip onboarding</button>
            </div>
        );
    }

    return (
        <AnimatePresence>
            {isOpen ? (
                <motion.section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="urai-onboarding-title"
                    className="fixed inset-0 z-[100] grid place-items-end bg-black/18 px-4 py-5 text-white backdrop-blur-[2px] md:place-items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        key={step.id}
                        className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/12 bg-black/42 p-5 shadow-2xl backdrop-blur-2xl"
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.98 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(180,210,255,0.16),transparent_34%),radial-gradient(circle_at_85%_85%,rgba(255,220,160,0.12),transparent_28%)]" />
                        {renderContent()}
                    </motion.div>
                </motion.section>
            ) : null}
        </AnimatePresence>
    );
}
