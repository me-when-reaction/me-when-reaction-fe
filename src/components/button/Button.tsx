import React from "react";
import classnames from 'classnames'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

const Button: React.FC<ButtonProps> = ({...props}) => {
  return (
    <button 
      className={classnames(
        
      )}
      {...props}
    />
  )
}

export default Button;