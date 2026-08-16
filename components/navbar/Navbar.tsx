import React, { Suspense } from 'react'
import Container from '../global/Container'
import Logo from './Logo'
import NavSearch from './NavSearch'
import CartButton from './CartButton'
import DarkMode from './DarkMode'
import LinksDropdown from './LinksDropdown'

function Navbar() {
  return (
    <div className='border-b'>
      <Container className='flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap ' >
        <Logo/>
        <Suspense fallback={<div className='w-full sm:w-auto h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'/>}  >
        <NavSearch/>
        </Suspense>
        <div className='flex gap-4 items-center'>
          <CartButton/>
          <DarkMode/>
          <LinksDropdown/>

        </div>
      </Container>
      </div>
  )
}

export default Navbar