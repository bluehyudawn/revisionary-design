import Image from 'next/image';
import Link from 'next/link';

const NAV_LINKS = ['Score Calculator', 'VCE Schedule', 'Features', 'Contact'];

export function Footer() {
  return (
    <footer className="bg-[#D6D3D1] relative h-[380px] overflow-hidden">
      {/* Symbol — top left */}
      <Image
        src="/symbol.svg"
        alt=""
        width={76}
        height={76}
        className="absolute left-[50px] top-9"
      />

      {/* Nav links — right column */}
      <div className="absolute left-[60.3%] top-9 flex flex-col gap-4 font-medium text-xl text-black leading-[1.4] whitespace-nowrap">
        {NAV_LINKS.map((item) => (
          <Link key={item} href="#" className="text-inherit no-underline">
            {item}
          </Link>
        ))}
      </div>

      {/* Wordmark — bottom left */}
      <Image
        src="/wordmark.png"
        alt="Revisionary Online"
        width={655}
        height={71}
        className="absolute left-[50px] bottom-[31px]"
      />

      {/* Copyright — bottom right */}
      <div className="absolute left-[60.3%] bottom-9 font-medium text-xs text-[#1f1f1f] opacity-50 leading-[1.5] whitespace-nowrap">
        <p>REVISION ONLINE PTY LTD©2026</p>
        <p>Trademarks and brands are the property of RevisionaryOnline.</p>
      </div>
    </footer>
  );
}
