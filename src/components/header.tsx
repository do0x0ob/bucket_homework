import { useContext } from "react";
import ConnectMenu from "./ui/connectMenu";
import "@mysten/dapp-kit/dist/index.css";
import { AppContext } from "@/context/AppContext";

const Header = () => {
  const { walletAddress, suiName } = useContext(AppContext);

  return (
    <div className="fixed top-0 left-0 w-full bg-[#f5f5f0] border-b-2 border-black z-50">
      <header className="w-full max-w-6xl mx-auto h-20 flex items-center justify-between px-4">
        {/* Title */}
        <span className="text-xl lg:text-3xl font-black uppercase tracking-widest text-black font-mono">
          Bucket Frontend Homework
        </span>
        {/* Connect Menu - Only show when connected */}
        {walletAddress && (
          <ConnectMenu walletAddress={walletAddress} suiName={suiName} />
        )}
      </header>
    </div>
  );
};

export default Header;
