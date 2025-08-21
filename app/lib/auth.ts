import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";

export async function getSession() {
  return await getServerSession(authOptions);
}
