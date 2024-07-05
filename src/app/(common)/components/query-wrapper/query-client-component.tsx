'use client'

import BreadcrumbLite from '@/components/breadcrumb-lite/BreadcrumbLite'
import { useGlobalState } from '@/utilities/store'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export default function QueryWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = useGlobalState(x => x.query.queryClient)
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
