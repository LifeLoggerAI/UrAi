import type { AppProps } from "next/app";

export default function UraiPagesApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
