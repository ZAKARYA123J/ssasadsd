"use client";

import React from 'react';
import type { NavItemConfig } from '@/types/nav';
import Link from 'next/link';

export const navItems: NavItemConfig[] = [
  { key: 'overview', title: 'Overview', href: '/dashboard', icon: 'chart-pie' },
  { key: 'customers', title: 'Posts', href: '/dashboard/posts', icon: 'users' },
  { key: 'integrations', title: 'Orders', href: '/dashboard/orders', icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: '/dashboard/settings', icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: '/dashboard/account', icon: 'user' },
  // { key: 'error', title: 'Error', href: '/errors/notFound', icon: 'x-square' },
];

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul>
        {navItems.map(({ key, title, href, icon }) => (
          href && (
            <li key={key}>
              <Link href={href}>
                <a>
                  <i className={`icon-${icon}`} /> {title}
                </a>
              </Link>
            </li>
          )
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
