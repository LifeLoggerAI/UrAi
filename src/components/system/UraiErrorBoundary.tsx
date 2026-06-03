"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type UraiErrorBoundaryProps = {
  children: ReactNode;
  onOpenSettings?: () => void;
  onReturnHome?: () => void;
};

type UraiErrorBoundaryState = {
  hasError: boolean;
};

export class UraiErrorBoundary extends Component<UraiErrorBoundaryProps, UraiErrorBoundaryState> {
  state: UraiErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): UraiErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== "production") {
      console.error("URAI render boundary caught an error", error, info.componentStack);
    }
  }

  private returnToGenesis = () => {
    this.setState({ hasError: false });
    if (this.props.onReturnHome) this.props.onReturnHome();
    else if (typeof window !== "undefined") window.location.assign("/");
  };

  private openSettings = () => {
    this.setState({ hasError: false });
    this.props.onOpenSettings?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_32%,#203963_0%,#101a38_48%,#050714_100%)] p-6 text-white">
        <section className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-black/35 p-6 text-center shadow-2xl backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/38">URAI</p>
          <h1 className="mt-3 text-2xl font-medium">Something didn’t open cleanly.</h1>
          <p className="mt-3 text-sm leading-6 text-white/62">You can return to Genesis. No private technical details are shown here.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={this.returnToGenesis} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Return to Genesis</button>
            {this.props.onOpenSettings ? <button type="button" onClick={this.openSettings} className="rounded-full bg-white/[0.08] px-5 py-3 text-sm text-white/72">Open Settings</button> : null}
          </div>
        </section>
      </main>
    );
  }
}
