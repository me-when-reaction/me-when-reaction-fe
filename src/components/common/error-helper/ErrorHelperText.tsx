import classNames from 'classnames'
import React from 'react'

export interface ErrorHelperTextProps extends React.HTMLProps<HTMLSpanElement> {
  message: string | undefined
}

export default function ErrorHelperText(props: ErrorHelperTextProps) {
  return (
    <>
      { props.message && <span className={classNames(props.className, 'text-red-500 text-sm')}>{props.message}</span>}
    </>
  )
}
