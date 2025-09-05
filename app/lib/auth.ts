import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-config";

export async function getSession() {
  return await getServerSession(authOptions);
}
