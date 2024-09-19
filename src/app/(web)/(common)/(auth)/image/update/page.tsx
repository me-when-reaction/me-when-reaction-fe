import React from 'react'
import { Metadata } from 'next';
import UpdateImage from '@/components/app/image/update-image/UpdateImage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Update existing Reaction Image - Me When Reaction",
    robots: "noindex, nofollow"
  }
}

export default function InsertImagePage() {
  return (<UpdateImage />);
}
