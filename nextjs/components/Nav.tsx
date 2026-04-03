import Image from 'next/image';
import Link from 'next/link';

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#e7e5e4] h-14">
      <div className="max-w-[1440px] mx-auto px-[50px] h-full flex items-center justify-between">
        {/* Left: logo + nav links */}
        <div className="flex items-center gap-11">
          <Link href="/">
            <Image
              src="/combination.svg"
              alt="Revisionary Online"
              width={120}
              height={30}
              className="h-[30px] w-auto block"
            />
          </Link>
          <div className="flex items-center gap-8">
            {['Score Calculator', 'VCE Schedule', 'Features', 'Contact'].map((item) => (
              <Link
                key={item}
                href="#"
                className="font-medium text-sm text-black whitespace-nowrap leading-[1.4] no-underline"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Login + Sign Up */}
        <div className="flex items-center gap-[21px]">
          <Link href="#" className="font-medium text-sm text-black whitespace-nowrap no-underline">
            Login
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center px-4 py-[7px] rounded-[70px] bg-[#772efe] font-semibold text-sm text-white whitespace-nowrap no-underline"
          >
            Sign Up - It&apos;s free
          </Link>
        </div>
      </div>
    </nav>
  );
}
