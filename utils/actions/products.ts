"use server";
import { redirect } from "next/navigation";
import db from "../db";
import { imageSchema, productSchema, validateFuctionSchema } from "../schema";
import { deleteImage, uploadImage } from "../supabase";
import { revalidatePath } from "next/cache";
import { links } from "../links";
import { getAdminUser } from "./user";
import { renderError } from "./global";

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({ where: { featured: true } });
  return products;
};

export async function fetchAllProducts({
  search = "",
  categoryId,
}: {
  search?: string;
  categoryId?: string;
}) {
  const products = await db.product.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  return products;
}

export async function fetchSingleProduct(productID: string) {
  const product = await db.product.findUnique({
    where: { id: productID },
  });
  if (!product) redirect("/products");
  return product;
}

export async function createProductAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> {
  const user = await getAdminUser();
  try {
    const rowData = Object.fromEntries(formData);
    const fileImage = formData.get("image") as File;
    const validatedFields = validateFuctionSchema(productSchema, rowData);
    const validateImage = validateFuctionSchema(imageSchema, { image: fileImage });
    const fullImagePath = await uploadImage(validateImage.image);
    await db.product.create({
      data: { ...validatedFields, image: fullImagePath, clerkId: user.id },
    });
    return { message: "Product Created" };
  } catch (error) {
    return renderError(error);
  }
}

export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  await getAdminUser();
  try {
    const product = await db.product.delete({ where: { id: productId } });
    await deleteImage(product.image);
    return { message: "product removed" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductAction = async (prevState: any, formData: FormData) => {
  await getAdminUser();
  try {
    const productId = formData.get("id") as string;
    const rawData = Object.fromEntries(formData);
    const validateData = validateFuctionSchema(productSchema, rawData);
    await db.product.update({ where: { id: productId }, data: { ...validateData } });
    revalidatePath(`${links.AdminProducts.href}/${productId}/edit`);
    return { message: "Product updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductImageAction = async (prevState: any, formData: FormData) => {
  await getAdminUser();
  try {
    const image = formData.get("image") as File;
    const productId = formData.get("id") as string;
    const validateImageFile = validateFuctionSchema(imageSchema, { image });
    // Never trust the old image URL from the client: read it from the DB.
    const existing = await db.product.findUnique({ where: { id: productId }, select: { image: true } });
    if (!existing) throw new Error("Product not found");
    const fullImagePath = await uploadImage(validateImageFile.image);
    await deleteImage(existing.image);
    await db.product.update({ where: { id: productId }, data: { image: fullImagePath } });
    revalidatePath(`${links.AdminProducts.href}/${productId}/edit`);
    return { message: "Image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchAdminPosts = async () => {
  const user = await getAdminUser();
  const products = await db.product.findMany({
    where: { clerkId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return products;
};

