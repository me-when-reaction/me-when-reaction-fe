'use client'

import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const makeQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 6000,
    }
  }
});

let browserQueryClient: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (typeof window === 'undefined') return makeQueryClient();
  else if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export default function QueryProvider({children} : {children: React.ReactNode}){
  const queryClient = getQueryClient();
  return (<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>)
}