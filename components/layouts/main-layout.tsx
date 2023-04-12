import React from 'react'

// components
import Nav from '../nav/nav'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Nav />
      {children}
    </div>
  )
}