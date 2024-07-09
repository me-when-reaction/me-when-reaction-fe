import React from 'react'
import UpdateImage from './components/UpdateImage'
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Update existing Reaction Image - Me When Reaction",
    robots: "noindex, nofollow"
  }
}

export default function InsertImagePage() {
  return (<UpdateImage />);
}
