'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scissors, MessageCircle, Camera, Calendar } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/salons', label: 'Salons', icon: Scissors },
  { href: '/advisor', label: 'Advisor', icon: MessageCircle },
  { href: '/preview', label: 'Preview', icon: Camera },
  { href: '/planner', label: 'Planner', icon: Calendar },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gold/[0.08] bg-[#080608]/95 backdrop-blur-md safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative transition-colors duration-200 ${
                isActive ? 'text-gold' : 'text-ivory/30'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gold rounded-b" />
              )}
              <Icon className="w-4.5 h-4.5" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[9px] tracking-[0.08em] uppercase font-light">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
