import React from 'react'

export interface TagInputState {
  tag: string[],
  input: string,
  suggestions: () => string[],
}

export default function TagInput() {
  return (
    <div>TagInput</div>
  )
}