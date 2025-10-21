import { Link } from '@/i18n/routing';
import { paths } from '@/config/paths';

export function Logo() {
  return (
    <Link href={paths.home.getHref()} className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-white font-bold">L</span>
      </div>
      <span className="text-lg font-semibold">LinkerAI</span>
    </Link>
  );
}
