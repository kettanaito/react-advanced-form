import React from 'react'

const Button = ({ type, children }) => (
  <button type={type} className="btn btn-primary">
    {children}
  </button>
)

export default Button
