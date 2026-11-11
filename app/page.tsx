import Header from "@/components/layout/Header";
import Explorer from "@/components/Explorer";

export default function Home() {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <Explorer />
    </div>
  );
}