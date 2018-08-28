import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const styles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'no-wrap',
  padding: '0 1rem',
  height: '100%',
}

const StoryContainer = ({ children }) => (
  <div style={styles}>
    <div>{children}</div>
  </div>
)

export default StoryContainer
