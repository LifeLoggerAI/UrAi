"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at 50% 20%, rgba(120,90,255,.22), transparent 35%), #05040a",
        color: "white",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <p style={{ letterSpacing: "0.22em", opacity: 0.7 }}>URAI</p>
        <h1 style={{ fontSize: "clamp(40px, 8vw, 92px)", margin: "12px 0" }}>
          Entering Genesis
        </h1>
        <p style={{ opacity: 0.75 }}>Opening the URAI home experience.</p>
        <p>
          <Link href="/home" style={{ color: "white", textDecoration: "underline" }}>
            Continue to URAI
          </Link>
        </p>
      </div>
    </main>
  );
}
