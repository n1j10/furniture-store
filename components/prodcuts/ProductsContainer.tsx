import { fetchAllProducts } from '@/utils/actions'
import React from 'react'
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LuLayoutGrid, LuList } from 'react-icons/lu';
import { links } from '@/utils/links';
import ProductsGrid from './ProductsGrid';
import ProductsList from './ProductsList';

async function ProductsContainer({layout,search}:{layout:string,search:string}) {

  const totalProducts = await fetchAllProducts({search});

  const lengthProducts = totalProducts.length;

  const searchTerm = search ? `&search=${search}` : '';

  return (
    <>
      <section>
        <div className='flex justify-between items-center'>
          <h4 className='font-medium text-lg'> 
            {lengthProducts} product{lengthProducts > 1 && 's'}
          </h4>
          <div className='flex gap-x-4'>
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              size='icon'
            >
              <Link href={`${links.PRODUCTS.href}?layout=grid${searchTerm}`}>
                <LuLayoutGrid />
              </Link>
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'outline'}
              size='icon'
              
            >
              <Link href={`${links.PRODUCTS.href}?layout=list${searchTerm}`}>
                <LuList />
              </Link>
            </Button>
          </div>
        </div>
        <Separator className='mt-4' />
      </section>




        {/* product  */}

      <section>
{
  totalProducts.length === 0 ? (
    <h5>sorry no product Matched your search</h5>
  )  :  layout === 'grid' ? (
    <ProductsGrid products={totalProducts}/>
  ) : (
    <ProductsList products={totalProducts}/>
  )

  
}


      </section>
    </>

  )
}

export default ProductsContainer
