import { Link } from '@/i18n/routing';
import { paths } from '@/config/paths';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href={paths.home.getHref()} className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-lg overflow-hidden">
        <Image
          src="/logo.jpeg"
          alt="LinkerAI"
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-lg font-semibold">LinkerAI</span>
    </Link>
  );
}
