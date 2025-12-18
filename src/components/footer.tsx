import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#f5f5f0] border-t-2 border-black z-50">
      <footer className="w-full max-w-6xl mx-auto flex items-center justify-center gap-3 py-4 px-4">
        <span className="text-sm font-semibold uppercase tracking-wider text-black">
          Powered by
        </span>
        <Link
          href="https://bucketprotocol.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="group border-2 border-black bg-black px-3 py-1.5 transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          style={{ boxShadow: "2px 2px 0px 0px #000" }}
        >
          <Image
            className="h-6 w-auto transition-transform duration-200 group-hover:translate-x-1"
            src="/images/bucket-text-logo.svg"
            alt="Bucket Protocol"
            width={120}
            height={32}
          />
        </Link>
      </footer>
    </div>
  );
};

export default Footer;
