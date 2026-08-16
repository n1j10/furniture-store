import React from 'react'
import Link from 'next/link'
import { Button, buttonVariants } from '../ui/button'
import { LuShoppingCart } from 'react-icons/lu'
import { dropDownMenuLinks, links } from '@/utils/links'
import { cn } from '@/lib/utils'

const cartItems = 9
function CartButton() {

  return (
    <Button variant="outline" size="icon">
    <Link
      href={dropDownMenuLinks[5].href} 
      className='flex justify-center items-center  relative'
    >
      <LuShoppingCart  />
      <span className='absolute -top-3 -right-3  bg-blue-500 text-amber-50 w-4 h-4 text-xs flex items-center justify-center rounded-full'>{cartItems}</span>

    </Link>
    </Button>
  )
}

export default CartButton


