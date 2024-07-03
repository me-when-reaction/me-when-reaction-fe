'use client'

import { MENU_LINK, NAV_MENU } from '@/constants/breadcrumb';
import { Breadcrumb } from 'flowbite-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export interface BreadcrumbLiteNav {
  title: string;
  link?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface BreadcrumbLiteProps {
  nav: BreadcrumbLiteNav[];
}

export default function BreadcrumbLite() {

  const path = usePathname() as keyof typeof MENU_LINK;
  const ID = MENU_LINK[path] ?? "";
  const NAV = NAV_MENU[ID] as BreadcrumbLiteNav[] | undefined;

  return (
    <>
    { (ID && !!NAV) &&
      <Breadcrumb className='px-4 py-3 lg bg-[#0D1636]'>
        {NAV.map(n => (
          <Breadcrumb.Item key={n.title} icon={n.icon}>
            {n.link ? (<Link className='hover:text-white' href={n.link}>{n.title}</Link>) : (<>{n.title}</>)}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    }
    </>
  )
}
