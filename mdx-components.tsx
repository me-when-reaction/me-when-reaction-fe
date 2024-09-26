import React from 'react';
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => (
      <h1 className='text-3xl py-10 font-bold'>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className='text-lg py-5 font-bold'>{children}</h2>
    ),
    ul: ({ children }) => (
      <ul className='markdown-ul'>{children}</ul>
    ),
    li: ({ children }) => (
      <li className=''>{children}</li>
    ),
    p: ({ children }) => (
      <p className='text-sm pb-1'>{children}</p>
    ),
  }
}