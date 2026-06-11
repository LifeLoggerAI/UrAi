'use client';

import { LifeMapStar, LifeMapStarType } from "@/lib/lifemap/lifeMapTypes";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight, X } from "lucide-react";


type LifeMapStarDetailProps = {
  star: LifeMapStar | null;
  onClose: () => void;
  onOpenPassport?: () => void;
  onReflect?: (star: LifeMapStar) => void;
};

const starTypeLabels: Record<LifeMapStarType, string> = {
  memory: "Memory",
  mood: "Mood",
  relationship: "Relationship",
  ritual: "Ritual",
  milestone: "Milestone",
  recovery: "Recovery",
  shadow: "Shadow Work",
  legacy: "Legacy",
  passport: "Passport",
  system: "System",
};

export function LifeMapStarDetail({
  star,
  onClose,
  onOpenPassport,
  onReflect,
}: LifeMapStarDetailProps) {

  const actions = [
    {
      label: "Explore in Passport",
      handler: onOpenPassport,
      isPrimary: true,
      condition: onOpenPassport,
    },
    {
      label: "Reflect on this Memory",
      handler: onReflect ? () => star && onReflect(star) : undefined,
      isPrimary: false,
      condition: onReflect,
    },
  ];

  return (
    <AnimatePresence>
      {star && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-white/10 bg-gray-900/80 p-6 backdrop-blur-md md:left-auto md:w-[380px] md:rounded-lg md:border md:shadow-xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-white/50">
                {starTypeLabels[star.type]}
              </p>
              <h3 className="mt-1 text-2xl font-bold text-white">{star.title}</h3>
              <p className="mt-2 text-white/70">{star.summary}</p>
            </div>
            <Button
              variant="tertiary"
              onClick={onClose}
              className="-mr-2 shrink-0"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="mt-6 flex flex-col items-stretch gap-3">
            {actions.map(
              (action, index) =>
                action.condition && (
                  <Button
                    key={index}
                    onClick={action.handler}
                    variant={action.isPrimary ? "primary" : "secondary"}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>{action.label}</span>
                    {action.isPrimary && <ArrowRight className="h-4 w-4" />}
                  </Button>
                )
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
