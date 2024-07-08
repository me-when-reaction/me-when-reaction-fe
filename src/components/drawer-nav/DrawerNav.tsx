'use client'

import { Logout } from '@/app/(common)/action';
import { Button, Drawer, Sidebar } from 'flowbite-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { BsHouseFill, BsImageFill } from 'react-icons/bs';

export default function DrawerNav() {
  const [open, setOpen] = useState(false);

  const closeDrawer = () => setOpen(false);

  return (
    <>
      <Button color='grey' onClick={() => { setOpen(true); }}>Menu</Button>
      <Drawer open={open} onClose={closeDrawer} position='right'>
        <Drawer.Header title='Me When ...' titleIcon={() => <></>}></Drawer.Header>
        <Drawer.Items>
          <Sidebar>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item as={Link} href="/" onClick={closeDrawer} icon={() => (<BsHouseFill className='text-sm'/>)}>Home</Sidebar.Item> 
                <Sidebar.Collapse label='Images' icon={() => (<BsImageFill className='text-sm'/>)}> 
                  <Sidebar.Item as={Link} onClick={closeDrawer} href="/image/insert">Insert Image</Sidebar.Item>
                </Sidebar.Collapse>
                {/* <Sidebar.Collapse label='Tags' icon={() => (<BsHash className='text-sm'/>)}> 
                  <Sidebar.Item as={Link} onClick={closeDrawer} href="/tag/manage">Manage Tag</Sidebar.Item>
                </Sidebar.Collapse>
                <Sidebar.Collapse label='Users' icon={() => (<BsPersonFill className='text-sm'/>)}> 
                  <Sidebar.Item as={Link} onClick={closeDrawer} href="/tag/manage">Manage Users</Sidebar.Item>
                </Sidebar.Collapse> */}
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
