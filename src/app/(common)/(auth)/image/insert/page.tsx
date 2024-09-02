import InsertImage from '@/components/app/image/insert-image/InsertImage'
import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Insert new Reaction Image - Me When Reaction",
    robots: "noindex, nofollow"
  }
}

export default function InsertImagePage() {
  return (
    <InsertImage />
  )
}
