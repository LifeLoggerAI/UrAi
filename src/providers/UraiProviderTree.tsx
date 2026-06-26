'use client';

import { HomeScene } from "@/components/urai/scenes/HomeScene";
import { UraiAudioProvider } from "@/providers/UraiAudioProvider";
import { UraiExportProvider } from "@/providers/UraiExportProvider";
import { UraiGroundProvider } from "@/providers/UraiGroundProvider";
import { UraiLegacyProvider } from "@/providers/UraiLegacyProvider";
import { UraiLifeMapProvider } from "@/providers/UraiLifeMapProvider";
import { UraiMirrorProvider } from "@/providers/UraiMirrorProvider";
import { UraiNotificationProvider } from "@/providers/UraiNotificationProvider";
import { UraiOnboardingProvider } from "@/providers/UraiOnboardingProvider";
import { UraiRitualProvider } from "@/providers/UraiRitualProvider";
import { UraiSettingsProvider } from "@/providers/UraiSettingsProvider";
import { UraiShadowProvider } from "@/providers/UraiShadowProvider";
import { UraiSceneProvider } from "./UraiSceneProvider";

export default function UraiProviderTree({ children }: { children: React.ReactNode }) {
  return (
    <UraiAudioProvider>
      <UraiNotificationProvider>
        <UraiOnboardingProvider>
          <UraiSettingsProvider>
            <UraiExportProvider>
              <UraiLifeMapProvider>
                <UraiGroundProvider>
                  <UraiMirrorProvider>
                    <UraiShadowProvider>
                      <UraiLegacyProvider>
                        <UraiRitualProvider>
                          <UraiSceneProvider>
                            {children}
                          </UraiSceneProvider>
                        </UraiRitualProvider>
                      </UraiLegacyProvider>
                    </UraiShadowProvider>
                  </UraiMirrorProvider>
                </UraiGroundProvider>
              </UraiLifeMapProvider>
            </UraiExportProvider>
          </UraiSettingsProvider>
        </UraiOnboardingProvider>
      </UraiNotificationProvider>
    </UraiAudioProvider>
  );
}
