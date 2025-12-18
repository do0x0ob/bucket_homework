import { Inter, Space_Mono, IBM_Plex_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { NetworkGuard } from "@/components/network/NetworkGuard";
import { MainnetDashboard } from "@/components/dashboard/MainnetDashboard";
import { TestnetPlayground } from "@/components/playground/TestnetPlayground";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export default function Home() {
  return (
    <main
      className={cn(
        "relative w-full min-h-screen flex flex-col items-center mx-auto py-5 px-4",
        "bg-[#f5f5f0]",
        inter.variable,
        spaceMono.variable
      )}
    >
      <Header />
      <div className="w-full flex-1 py-8 pt-28 pb-24">
        <NetworkGuard
          mainnetView={<MainnetDashboard />}
          testnetView={<TestnetPlayground />}
        />
      </div>
      <Footer />
    </main>
  );
}
