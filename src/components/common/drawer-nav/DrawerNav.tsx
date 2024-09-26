'use client'

import { Logout } from '@/app/(web)/(common)/action';
import { Route, ROUTES } from '@/constants/routes';
import { Button, Drawer, Sidebar } from 'flowbite-react'
import Link from 'next/link'
import React, { useState } from 'react'

type DrawerNavProps = {
  isLogin: boolean
}

export default function DrawerNav(props : DrawerNavProps) {
  const [open, setOpen] = useState(false);
  const closeDrawer = () => setOpen(false);

  const renderSidebarOptions = (route: Route) => {
    if (route.type === 'single') return (
      <Sidebar.Item key={route.name} as={Link} href={route.action} onClick={closeDrawer} icon={route.icon}>{route.name}</Sidebar.Item>
    )
    else return (
      <Sidebar.Collapse key={route.name} label={route.name} icon={route.icon as React.FunctionComponent<React.SVGProps<SVGSVGElement>>}>
        {route.action.map(r => renderSidebarOptions(r))}
      </Sidebar.Collapse>
    )
  }

  return (
    <>
      <Button color='grey' onClick={() => { setOpen(true); }}>Menu</Button>
      <Drawer open={open} onClose={closeDrawer} position='right'>
        <Drawer.Header title='Menu' titleIcon={() => <></>}></Drawer.Header>
        <Drawer.Items>
          <Sidebar>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {ROUTES.filter(x => props.isLogin || x.anon).map(r => renderSidebarOptions(r))}
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                <Sidebar.Item as={() => (
                  props.isLogin ? (
                    <form action={Logout}>
                      <Button color="failure" className='float-right' type='submit'>Logout</Button>
                    </form>
                  ) : (
                    <Link href={'/login'} passHref className='flex gap-2'>
                      <Button color='gray'>Login</Button>
                    </Link>
                  )
                )}>
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  )
}
