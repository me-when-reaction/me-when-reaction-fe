import InsertImage from '@/app/(common)/(auth)/image/insert/components/insert-image/InsertImage'
import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Insert new Reaction Image",
    robots: "noindex, nofollow"
  }
}

export default function InsertImagePage() {
  return (
    <InsertImage />
  )
}
