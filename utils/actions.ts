"use server"
import { redirect } from "next/navigation";
import db from "./db";
import { currentUser } from "@clerk/nextjs/server";
import { imageSchema, productSchema, validateFuctionSchema } from "./schema";
import { deleteImage, uploadImage } from "./supabase";
import { revalidatePath } from "next/cache";
import { links } from "./links";


//fetch all featured products
export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};


//fetch all  products
export async function fetchAllProducts({ search = '' }: { search: string }) {
  const products = await db.product.findMany({

    where: {
      OR: [
        {
          name: { contains: search, mode: 'insensitive' }
        }
      ]
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  return products;
}


//find product

export async function fetchSingleProduct(productID: string) {
  const product = await db.product.findUnique({
    where: {
      id: productID
    },
  });
  if (!product) {
    redirect('/products')
  }

  return product
}



const getAuthUser = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/")
  }
  return user;
}

const renderError = (error: unknown): { message: string } => { //check error mesage 
  return {
    message: error instanceof Error ? error.message : "Unknown Error"
  }
}

// fuc connect with zod to make validate to info
export async function createProductAction(prevState: any, formData: FormData):
  Promise<{ message: string }> {
  const user = await getAuthUser();
  try {
    const rowData = Object.fromEntries(formData); // validate for all form input without image
    const fileImage = formData.get('image') as File;

    const validateData = validateFuctionSchema(productSchema, rowData)
    const validateImage = validateFuctionSchema(imageSchema, { image: fileImage })

    const fullImagePath = await uploadImage(validateImage.image);


    await db.product.create({
      data: {
        ...validateData,
        image: fullImagePath,
        clerkId: user.id,
      }
    });
    return { message: 'Product Created' }

  } catch (error) {
    return renderError(error);

  }
};

//AdminUser
const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect('/');
  return user;
};

//fetch admin posts
export const fetchAdminPosts = async () => {
  await getAdminUser();
  const user = await getAuthUser();
  const products = await db.product.findMany({
    where: {
      clerkId: user.id
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  return products;
}



export const deleteProductAction = async (prevState: { productId: string }) => {

  const { productId } = prevState

  await getAdminUser();

  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteImage(product.image);
    // revalidatePath('/admin/products');

    return { message: 'product removed' };


  } catch (error) {
    return renderError(error);
  }

};

//edie product = update text data only 
export const updateProductAction = async ( prevState: any,formData: FormData) => {

  await getAdminUser();
  try {
    const productId = formData.get('id') as string; 

    const rawData = Object.fromEntries(formData);

    const validateData = validateFuctionSchema(productSchema, rawData);



    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validateData,
      },
    });

    revalidatePath(`${links.AdminProducts.href}/${productId}/edit`);
    
     return { message: 'Product updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};



//image update action 
export const updateProductImageAction = async ( prevState: any,formData: FormData) => {

  await getAuthUser();
  try {
    const image = formData.get('image') as File; 
    const productId = formData.get('id') as string;
    const oldImageUrl = formData.get('url') as string;

  const validateImageFile = validateFuctionSchema(imageSchema, {image});

  const fullImagePath =  await uploadImage(validateImageFile.image);
  
 await deleteImage(oldImageUrl);
 await db.product.update({
  where:{
    id:productId,
  },
  data:{
    image:fullImagePath,
  }
 });
 
    revalidatePath(`${links.AdminProducts.href}/${productId}/edit`);
    
     return { message: 'Image updated successfully' };

  } catch (error) {
    return renderError(error);
  }
};


// fetch faveroit 

export const fetchFavoritID = async (productID:string)=> {

  const user = await getAuthUser();
  const fav = await db.favorite.findFirst({

    where: {
      productId: productID,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  });
  return fav?.id || null;
}


type toggleFavActionProps ={
  productID:string;
  FavoriteID:string |null;
}
//fetch add or Favorite using button
export const toggleFavAction = async (prevState:toggleFavActionProps)=>{
  const user = await getAuthUser();

  const { productID, FavoriteID }=prevState;
  try {
    if(FavoriteID){
      await db.favorite.delete({
        where:{
          id:FavoriteID,
        }
      })
    }
    else{
      await db.favorite.create({
        data:{
          productId:productID,
          clerkId:user.id, 
        }
      })
    }
revalidatePath("");

return {message: FavoriteID ?'removed from favorite':'added to favorite'};

  } catch (error) {
    return renderError(error);
  }
  }


// user -> product -> fav
export const fetchUserFav = async () => {
  const user = await getAuthUser();
  const fav = await db.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true,
    },
  });
  return fav;
} 