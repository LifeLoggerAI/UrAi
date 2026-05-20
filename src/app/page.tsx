import HomePage, { metadata } from "./home/page";

export { metadata };

export default function Page() {
  return (
    <>
      <h1>Inner Sky Shrine</h1>
      <h2>URAI</h2>
      <HomePage />
    </>
  );
}
