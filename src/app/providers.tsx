'use client';

import * as React from 'react';
// import { SpatialUniverseProvider } from '@/components/urai/SpatialUniverseProvider';
// import { UraiAudioProvider } from '@/providers/UraiAudioProvider';
import { UraiAuthProvider } from '@/providers/UraiAuthProvider';
// import { UraiCloudSyncProvider } from '@/providers/UraiCloudSyncProvider';
// import { UraiExportProvider } from '@/providers/UraiExportProvider';
import { UraiFeatureFlagProvider } from '@/providers/UraiFeatureFlagProvider';
// import { UraiGroundProvider } from '@/providers/UraiGroundProvider';
// import { UraiLegacyProvider } from '@/providers/UraiLegacyProvider';
// import { UraiLifeMapProvider } from '@/providers/UraiLifeMapProvider';
// import { UraiMirrorProvider } from '@/providers/UraiMirrorProvider';
// import { UraiNotificationProvider } from '@/providers/UraiNotificationProvider';
import { UraiOnboardingProvider } from '@/providers/UraiOnboardingProvider';
// import { UraiRitualProvider } from '@/providers/UraiRitualProvider';
import { UraiSettingsProvider } from '@/providers/UraiSettingsProvider';
// import { UraiShadowProvider } from '@/providers/UraiShadowProvider';
// import { UraiVoiceProvider } from '@/providers/UraiVoiceProvider';
// import { UraiCaptionBubble } from '@/components/voice/UraiCaptionBubble';
import { UraiErrorBoundary } from '@/components/system/UraiErrorBoundary';
import { installProductionConsoleGuard } from '@/lib/debug/productionConsoleGuard';

/**
 * URAI MASTER COMPLETION PASS 1:
 * This provider stack has been patched to disable all non-essential and high-risk
 * systems. The goal is to establish a safe, minimal foundation for the application
 * before proceeding with further implementation.
 */
export default function AppProviders({ children }: { children?: React.ReactNode }) {
  React.useEffect(() => {
    installProductionConsoleGuard();
  }, []);

  return (
    <UraiErrorBoundary>
      <UraiAuthProvider>
        <UraiFeatureFlagProvider>
          <UraiSettingsProvider>
            <UraiOnboardingProvider>
              {/* Disabled providers for Pass 1:
              <UraiCloudSyncProvider>
                <UraiAudioProvider>
                  <UraiVoiceProvider>
                    <UraiNotificationProvider>
                      <UraiExportProvider>
                        <UraiRitualProvider>
                          <UraiGroundProvider>
                            <UraiLifeMapProvider>
                              <UraiMirrorProvider>
                                <UraiShadowProvider>
                                  <UraiLegacyProvider>
                                    <SpatialUniverseProvider>
                                      {children}
                                    </SpatialUniverseProvider>
                                  </UraiLegacyProvider>
                                </UraiShadowProvider>
                              </UraiMirrorProvider>
                            </UraiLifeMapProvider>
                          </UraiGroundProvider>
                        </UraiRitualProvider>
                      </UraiExportProvider>
                      <UraiCaptionBubble />
                    </UraiNotificationProvider>
                  </UraiVoiceProvider>
                </UraiAudioProvider>
              </UraiCloudSyncProvider>
              */}
              {children}
            </UraiOnboardingProvider>
          </UraiSettingsProvider>
        </UraiFeatureFlagProvider>
      </UraiAuthProvider>
    </UraiErrorBoundary>
  );
}
