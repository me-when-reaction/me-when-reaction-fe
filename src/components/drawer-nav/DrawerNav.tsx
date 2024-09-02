'use client'

import { Logout } from '@/app/(common)/action';
import { Route, ROUTES } from '@/constants/routes';
import { Button, Drawer, Sidebar } from 'flowbite-react'
import Link from 'next/link'
import React, { useState } from 'react'

export default function DrawerNav() {
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
                {ROUTES.map(r => renderSidebarOptions(r))}
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                <Sidebar.Item as={() => (
                  <form action={Logout}>
                    <Button color="failure" className='float-right' type='submit'>Logout</Button>
                  </form>
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
