import HomeView from "../components/home-view";

export const dynamic = "force-static";
export const revalidate = false;

export default function Page() {
  return <HomeView />;
}
