import React from 'react'

const Button = ({ children, ...restProps }) => (
  <button {...restProps} className="btn btn-block btn-primary">
    {children}
  </button>
)

export default Button
