'use client'

import { useGlobalState } from '@/utilities/store'
import classNames from 'classnames'
import React from 'react'

export interface ChipProps {
  text: string
  onClick: () => void,
  className?: string
}

export default function Chip(props: ChipProps) {
  return (
    <div className={classNames('text-2xs p-1 rounded bg-slate-600 hover:bg-slate-700 hover:text-slate-300 transition-all text-white overflow-hidden cursor-pointer', props.className ?? "")} onClick={_ => props.onClick()}>
      {props.text}
    </div>
  )
}
