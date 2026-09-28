"use server";
import { redirect } from "next/navigation";
import db from "../db";
import { revalidatePath } from "next/cache";
import { startZainCashCheckout } from "@/lib/zaincash";
import { getAuthUser, getAdminUser } from "./user";
import { renderError } from "./global";
import { fetchOrCreateCart } from "./cart";

export const createOrderAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  let paymentUrl: string | null = null;

  try {
    const cart = await fetchOrCreateCart({ userId: user.id, errorOnFailure: true });
    if (!cart.cartItems.length) throw new Error("Cart is empty");

    const order = await db.order.create({
      data: {
        clerkId: user.id,
        products: cart.numItemsInCart,
        orderTotal: cart.orderTotal,
        tax: cart.tax,
        shipping: cart.shipping,
        email: user.emailAddresses[0]?.emailAddress ?? "",
      },
    });

    const checkout = await startZainCashCheckout({
      clerkId: user.id,
      orderId: order.id,
      cartId: cart.id,
    });
    paymentUrl = checkout.redirectUrl;
  } catch (error) {
    return renderError(error);
  }

  if (!paymentUrl) return renderError(new Error("Unable to start payment"));
  redirect(paymentUrl);
};

export const payOrderAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  const orderId = formData.get("orderId") as string;
  if (!orderId) return renderError(new Error("Order ID is required"));

  let paymentUrl: string | null = null;
  try {
    const order = await db.order.findFirst({ where: { id: orderId, clerkId: user.id } });
    if (!order) throw new Error("Order not found");
    const cart = await db.cart.findFirst({ where: { clerkId: user.id } });
    if (!cart) throw new Error("Cart not found");
    const checkout = await startZainCashCheckout({ clerkId: user.id, orderId, cartId: cart.id });
    paymentUrl = checkout.redirectUrl;
  } catch (error) {
    return renderError(error);
  }

  if (!paymentUrl) return renderError(new Error("Unable to start payment"));
  redirect(paymentUrl);
};

export const fetchUserOrders = async () => {
  const user = await getAuthUser();
  const orders = await db.order.findMany({
    where: { clerkId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return orders;
};

export const fetchAdminOrders = async () => {
  await getAdminUser();
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return orders;
};
