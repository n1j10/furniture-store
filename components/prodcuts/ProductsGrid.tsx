import React from 'react'
import { Product } from '@/lib/generated/prisma/client'
import Link from 'next/link'
import { links } from '@/utils/links'
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { formatCurrency } from '@/utils/format';
import FavoriteToggleButton from './FavoriteToggleButton';

function ProductsGrid({ products }: { products: Product[] }) {
  console.log(products, "ProductsGrid")

  return (
    <section className='pb-14 pt-12 grid md:grid-cols-2 gap-4 lg:grid-cols-3'>

     {products.map((product) => {
        // const { name, price, image } = product;  //shortcut for all name iamge price
        const productName = product.name
        const productId = product.id;
        const DinarAmount = formatCurrency(product.price);
        return (
          <div key={productId} className='group relative'>
            <Link href={`${links.PRODUCTS.href}/${productId}`}>
              <Card className='transform group-hover:shadow-xl transition-shadow duration-500'>
                <CardContent >
                  <div className='relative h-64 md:h-48 rounded overflow-hidden '>
                    <Image
                      src={product.image}
                      alt={productName}
                      fill
                      sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw, 33vw '
                      priority
                      className='rounded w-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                    />
                  </div>
                  <div className='mt-4 text-center'>
                    <h2 className='text-lg capitalize'>{productName}</h2>
                    <p className='text-muted-foreground mt-2'>
                      {DinarAmount}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <div className='absolute top-7 right-7 z-5'>
              <FavoriteToggleButton productId={productId} />
            </div>
          </div>
        );
        
      })}







    </section>

  )
}

export default ProductsGrid




//method 22222












     
      // {products.map((product: Product) => (
      //   <div className='group relative' key={product.id}>
      //     <Link href={`${links.PRODUCTS.href}/${product.id}`} >
      //       <Card className='transform group-hover:shadow-xl transition-shadow duration-500'>
      //         <CardContent >
      //           <div className='relative h-64 md:h-48 rounded overflow-hidden '>
      //             <Image
      //               src={product.image}
      //               alt={product.name}
      //               fill
      //               sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw, 33vw '

      //             />
      //           </div>
      //           <div className='mt-4 text-center'>
      //             <h2 className='text-lg capitalize'>

      //               {product.name}
      //             </h2>
      //             <p className='text-muted-foreground mt-2'>
      //               {formatCurrency(product.price)}
      //             </p>

      //           </div>
      //         </CardContent>
      //       </Card>

      //     </Link>
      //     <div className='absolute top-7 right-7 z-5'>
      //       <FavoriteToggleButton productId={product.id} />
      //     </div>
      //   </div>
      // ))}
