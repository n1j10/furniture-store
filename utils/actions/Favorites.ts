"use server";
import { auth } from "@clerk/nextjs/server";
import db from "../db";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "./user";
import { renderError } from "./global";

export const fetchFavoritID = async (productID: string) => {
  const { userId } = await auth();
  if (!userId) return null;
  const fav = await db.favorite.findFirst({
    where: { productId: productID, clerkId: userId },
    select: { id: true },
  });
  return fav?.id || null;
};

type toggleFavActionProps = {
  productID: string;
  FavoriteID: string | null;
};

export const toggleFavAction = async (prevState: toggleFavActionProps) => {
  const user = await getAuthUser();
  const { productID, FavoriteID } = prevState;
  try {
    if (FavoriteID) {
      await db.favorite.delete({ where: { id: FavoriteID } });
    } else {
      await db.favorite.create({
        data: { productId: productID, clerkId: user.id },
      });
    }
    revalidatePath("");
    return {
      message: FavoriteID ? "removed from favorite" : "added to favorite",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchUserFav = async () => {
  const user = await getAuthUser();
  const fav = await db.favorite.findMany({
    where: { clerkId: user.id },
    include: { product: true },
  });
  return fav;
};
