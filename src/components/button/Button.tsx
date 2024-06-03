import React from "react";
import classnames from 'classnames'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType: 'primary' | 'success' | 'danger',
  loading?: boolean,
}

const Button: React.FC<ButtonProps> = ({...props}) => {
  return (
    <button 
      {...props}
      disabled={!props.loading}
      className={classnames(
        props.className ?? "",
        'outline-none outline-offset-0 p-2 px-3 rounded-md hover:transition-all focus:transition-all',
        {
          'bg-green-600 hover:outline-green-600/70 hover:outline-[3px] active:bg-green-700 active:outline-green-700/70' : props.buttonType === 'success' && props.loading,
          'bg-yellow-600 hover:outline-yellow-600/70 hover:outline-[3px] active:bg-yellow-700 active:outline-yellow-700/70': props.buttonType === 'primary' && props.loading,
          'bg-red-600 hover:outline-red-600/70 hover:outline-[3px] active:bg-red-700 active:outline-red-700/70': props.buttonType === 'danger' && props.loading,

          'hover:outline-none hover:outline-0 active:outline-0 active:outline-none bg-gray-600': !props.loading
        }
      )}
    >
      {!props.loading ? props.children : "Loading..."}
    </button>
  )
}

export default Button;