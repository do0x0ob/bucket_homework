import { cn } from "@/lib/utils";
import SuiWalletProvider from "@/context/WalletContext";
import { type AppType } from "next/dist/shared/lib/utils";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import { AppContextProvider } from "@/context/AppContext";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import MetaTagsContainer from "@/components/containers/metaTagsContainer";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  {
    ssr: false,
  }
);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiWalletProvider>
        <AppContextProvider>
          <TooltipProvider>
            <MetaTagsContainer />
            <Component {...pageProps} className={cn(inter.className)} />
            <ToastContainer
              theme="light"
              draggable={false}
              position="bottom-right"
              className="mt-20"
              hideProgressBar={false}
              closeButton={true}
              toastClassName="!bg-[#f5f5f0] !border-2 !border-black !shadow-[4px_4px_0px_0px_#000] !rounded-none !text-black !font-sans !p-4 !min-h-0 [&_.Toastify__toast-body]:!text-black [&_.Toastify__toast-body]:!text-sm [&_.Toastify__toast-body]:!font-medium [&_.Toastify__toast-body]:!p-0 [&_.Toastify__toast-body]:!m-0 [&_.Toastify__progress-bar]:!bg-black [&_.Toastify__progress-bar]:!h-0.5"
            />
          </TooltipProvider>
        </AppContextProvider>
      </SuiWalletProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
