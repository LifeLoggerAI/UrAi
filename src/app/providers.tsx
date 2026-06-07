'use client';

import * as React from 'react';
import { UraiAudioProvider } from '@/providers/UraiAudioProvider';
import { UraiAuthProvider } from '@/providers/UraiAuthProvider';
import { UraiCloudSyncProvider } from '@/providers/UraiCloudSyncProvider';
import { UraiExportProvider } from '@/providers/UraiExportProvider';
import { UraiFeatureFlagProvider } from '@/providers/UraiFeatureFlagProvider';
import { UraiGroundProvider } from '@/providers/UraiGroundProvider';
import { UraiLegacyProvider } from '@/providers/UraiLegacyProvider';
import { UraiLifeMapProvider } from '@/providers/UraiLifeMapProvider';
import { UraiMirrorProvider } from '@/providers/UraiMirrorProvider';
import { UraiNotificationProvider } from '@/providers/UraiNotificationProvider';
import { UraiOnboardingProvider } from '@/providers/UraiOnboardingProvider';
import { UraiPassportProvider } from '@/providers/UraiPassportProvider';
import { UraiRitualProvider } from '@/providers/UraiRitualProvider';
import { UraiShadowProvider } from '@/providers/UraiShadowProvider';
import { UraiVoiceProvider } from '@/providers/UraiVoiceProvider';
import { UraiSettingsProvider } from '@/providers/UraiSettingsProvider';
import { UraiErrorBoundary } from '@/components/system/UraiErrorBoundary';
import { installProductionConsoleGuard } from '@/lib/debug/productionConsoleGuard';

export default function AppProviders({ children }: { children?: React.ReactNode }) {
  React.useEffect(() => {
    installProductionConsoleGuard();
  }, []);

  return (
    <UraiErrorBoundary>
      <UraiAuthProvider>
        <UraiCloudSyncProvider>
          <UraiFeatureFlagProvider>
            <UraiSettingsProvider>
              <UraiAudioProvider>
                <UraiVoiceProvider>
                  <UraiNotificationProvider>
                    <UraiOnboardingProvider>
                      <UraiPassportProvider>
                        <UraiExportProvider>
                          <UraiRitualProvider>
                            <UraiGroundProvider>
                              <UraiLifeMapProvider>
                                <UraiMirrorProvider>
                                  <UraiShadowProvider>
                                    <UraiLegacyProvider>{children}</UraiLegacyProvider>
                                  </UraiShadowProvider>
                                </UraiMirrorProvider>
                              </UraiLifeMapProvider>
                            </UraiGroundProvider>
                          </UraiRitualProvider>
                        </UraiExportProvider>
                      </UraiPassportProvider>
                    </UraiOnboardingProvider>
                  </UraiNotificationProvider>
                </UraiVoiceProvider>
              </UraiAudioProvider>
            </UraiSettingsProvider>
          </UraiFeatureFlagProvider>
        </UraiCloudSyncProvider>
      </UraiAuthProvider>
    </UraiErrorBoundary>
  );
}
