import React from "react";
import classnames from 'classnames'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {

}

const Input: React.FC<InputProps> = ({...props}) => {
  return (
    <input 
      {...props}
      className={classnames(
        props.className,
        'outline-none outline-offset-0 bg-[#A3A1A1]/30 text-white/70 rounded text-lg p-2.5',
        'focus:outline-[#A3A1A1]/60 focus:outline-[3px] transition-all'
      )}
    />
  )
}

export default Input;