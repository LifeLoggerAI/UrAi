import { HomeScene } from "@/components/urai/home/HomeScene";
import { UraiAudioProvider } from "@/providers/UraiAudioProvider";
import { UraiAuthProvider } from "@/providers/UraiAuthProvider";
import { UraiExportProvider } from "@/providers/UraiExportProvider";
import { UraiCloudSyncProvider } from "@/providers/UraiCloudSyncProvider";

export default function HomePage() {
  return (
    <UraiAuthProvider>
      <UraiCloudSyncProvider>
        <UraiAudioProvider>
          <UraiExportProvider>
            <HomeScene />
          </UraiExportProvider>
        </UraiAudioProvider>
      </UraiCloudSyncProvider>
    </UraiAuthProvider>
  );
}
