import React, { Suspense } from 'react'
import HeroCarousel from './HeroCarousel'
import { Button } from '../ui/button'
import Link from 'next/link'
import { LoadingHero} from '../global/LoadingContainer'

function Hero() {
  return (
        <section className=' grid grid-cols-1 lg:grid-cols-2 gap-24 items-center'>
      <div>


        <h1 className='max-w-2xl font-bold text-4xl tracking-tight sm:text-6xl'>
          We are changing the way people shop
        </h1>

        
        <p className='mt-8 max-w-xl text-lg leading-8 text-muted-foreground'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
          maxime laboriosam, deserunt velit qui quia? Dolor dolores esse
          corporis. Dolores.
        </p>



     <Button  size='lg' className='mt-10 bg-blue-500 text-white'>
          <Link href='/products'>Our Products</Link>
        </Button>
      </div>


<Suspense fallback={<LoadingHero/>}>
  
      <HeroCarousel />


</Suspense>


    </section>
  )
}

export default Hero
   



