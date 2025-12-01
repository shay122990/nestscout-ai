import { supabaseServer } from "./supabaseServer";
import { prisma } from "./prisma";

export async function currentUser() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return null;

  const user = await prisma.user.findUnique({
    where: { authUserId: data.user.id },
  });

  return user;
}
