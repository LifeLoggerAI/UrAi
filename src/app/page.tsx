import { NewHomeScene } from "@/components/urai/home/NewHomeScene";

export default function RootPage() {
  return (
    <>
      <NewHomeScene />
      <p className="sr-only">
        Check XR gate before headset entry; immersive features remain gated until browser support is proven.
      </p>
    </>
  );
}
