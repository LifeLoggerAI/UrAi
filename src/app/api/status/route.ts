import { NextResponse } from "next/server";

type HealthStatus = "operational" | "degraded" | "outage";

type ServiceStatus = {
  id: string;
  label: string;
  status: HealthStatus;
  message?: string;
  updatedAt: string;
  docsUrl?: string;
};

const REQUIRED_FIREBASE_ENV = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

function resolveFirebaseStatus(): Pick<ServiceStatus, "status" | "message"> {
  const missing = REQUIRED_FIREBASE_ENV.filter((key) => !process.env[key]);
  if (missing.length) {
    return {
      status: "degraded",
      message: `Firebase public config is incomplete: missing ${missing.join(", ")}.`,
    };
  }
  return {
    status: "operational",
    message: "Firebase public configuration is present. Runtime service health is verified by deploy smoke tests.",
  };
}

function resolveFunctionsStatus(): Pick<ServiceStatus, "status" | "message"> {
  if (!process.env.FIREBASE_FUNCTIONS_REGION && !process.env.NEXT_PUBLIC_FUNCTIONS_ORIGIN) {
    return {
      status: "degraded",
      message: "Cloud Functions origin is not configured for this environment.",
    };
  }

  return {
    status: "operational",
    message: "Cloud Functions configuration is present. Runtime health is verified by callable/API smoke tests.",
  };
}

function resolveNarratorStatus(): Pick<ServiceStatus, "status" | "message"> {
  if (!process.env.NEXT_PUBLIC_NARRATOR_API_BASE) {
    return {
      status: "degraded",
      message: "Narrator API base URL is not configured; companion/narrator surfaces should use deterministic fallback copy.",
    };
  }

  return {
    status: "operational",
    message: "Narrator API configuration is present. Runtime health is verified by production smoke tests.",
  };
}

export async function GET() {
  const generatedAt = new Date().toISOString();

  const firebase = resolveFirebaseStatus();
  const functions = resolveFunctionsStatus();
  const narrator = resolveNarratorStatus();

  const services: ServiceStatus[] = [
    {
      id: "web-app",
      label: "Web app",
      status: "operational",
      message: "Next.js application bundle is serving this status route.",
      updatedAt: generatedAt,
      docsUrl: "https://urai.app/changelog",
    },
    {
      id: "firebase",
      label: "Firebase",
      status: firebase.status,
      message: firebase.message,
      updatedAt: generatedAt,
      docsUrl: "https://firebase.google.com/docs/hosting",
    },
    {
      id: "functions",
      label: "Cloud Functions",
      status: functions.status,
      message: functions.message,
      updatedAt: generatedAt,
      docsUrl: "https://firebase.google.com/docs/functions",
    },
    {
      id: "narrator",
      label: "Narrator services",
      status: narrator.status,
      message: narrator.message,
      updatedAt: generatedAt,
      docsUrl: "https://urai.app/docs",
    },
  ];

  return NextResponse.json({ services, generatedAt });
}
