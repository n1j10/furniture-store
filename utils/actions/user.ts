"use server";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

export const getAuthUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }
  return user;
};

export const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");
  return user;
};
