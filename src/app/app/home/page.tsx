import HomeView from "../../home-view";

export const dynamic = "force-static";
export const revalidate = false;

export default function AppHomePage() {
  return <HomeView />;
}
