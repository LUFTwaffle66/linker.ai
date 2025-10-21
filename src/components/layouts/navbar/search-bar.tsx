'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { paths } from '@/config/paths';

export function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(paths.public.browse.getHref({ q: searchQuery }));
    }
  };

  return (
    <div className="hidden md:flex flex-1 max-w-lg mx-8">
      <form onSubmit={handleSearch} className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search for AI experts, automation services..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
    </div>
  );
}
