"use client";

import UraiHomeLaunchSurface from "@/components/urai/UraiHomeLaunchSurface";

export default function HomePage() {
  return (
    <div data-urai-clean-home>
      <UraiHomeLaunchSurface />

      <style jsx global>{`
        body:has([data-urai-clean-home]) nav,
        body:has([data-urai-clean-home]) [role="navigation"],
        body:has([data-urai-clean-home]) [class*="dock"],
        body:has([data-urai-clean-home]) [class*="Dock"],
        body:has([data-urai-clean-home]) [class*="bottom"],
        body:has([data-urai-clean-home]) [class*="Bottom"] {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
        }
      `}</style>
    </div>
  );
}
