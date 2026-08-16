
import FavoriteToggleButton from '@/components/prodcuts/FavoriteToggleButton';
import AddtoCart from '@/components/single-prodcut/AddtoCart';
import BreadCrumb from '@/components/single-prodcut/BreadCrumb';
import ProductRating from '@/components/single-prodcut/ProductRating';
import { fetchSingleProduct } from '@/utils/actions';
import { formatCurrency } from '@/utils/format';
import Image from 'next/image';

// interface replace with PageProps
// interface Params {
//     id: string
// }
const ProductDetailsPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;

    const product = await fetchSingleProduct(id);
    const dinarAmount = formatCurrency(product.price)

    return (
        <section>
            <BreadCrumb name={product.name} />
            <section className='grid lg:grid-cols-2 mt-5 gap-y-6 lg:gap-x-16'>

                {/* image */}
                <div className='relative h-full '>
                    <Image src={product.image}
                        alt={product.name}
                        fill
                        priority
                        className='w-full rounded-md object-cover'
                        sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw, 33vw '

                    />

                </div>

                {/* Product Info */}
                <div >
                    <div className='flex gap-x-8 items-center' >
                        <h2 className='capitalize text-3xl font-bold'>{product.name}</h2>
                        <FavoriteToggleButton productId={id} />
                    </div>
                    <ProductRating productId={product.id} />
                    {/* <ShareButton name={product.name} productId={params.id} /> */}
                    <h4 className='text-md p-2 mt-3  bg-muted  rounded-md inline-block'>
                        {dinarAmount}
                    </h4>
                    <p className='mt-6 leading-8 text-muted-foreground '>{product.description}</p>
                    <AddtoCart  productID={product.id} />

                </div>

                <div></div>
            </section>

        </section>

    )
}

export default ProductDetailsPage 