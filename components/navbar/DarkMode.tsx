"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoonIcon,SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

function DarkMode() {
  const {setTheme}=useTheme();
  return (
<DropdownMenu>
  <DropdownMenuTrigger
    render={<Button variant="outline" size="icon" aria-label="Change theme" />}
  >
      <SunIcon className='h-1.1rem w-1.1rem rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 '/>
      <MoonIcon className='absolute h-1.1rem w-1.1rem rotate-90 scale-0 transition-all dark:scale-100 dark:-rotate-0'/>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={()=>setTheme('light')}>Light</DropdownMenuItem>
      <DropdownMenuItem onClick={()=>setTheme('dark')}>Dark</DropdownMenuItem>
      <DropdownMenuItem onClick={()=>setTheme('system')}>System</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default DarkMode
