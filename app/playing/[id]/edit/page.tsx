import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditCurrentlyPlayingPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  
  const currentlyPlaying = await prisma.currentlyPlaying.findUnique({
    where: { id },
  });

  if (!currentlyPlaying) {
    notFound();
  }

  if (currentlyPlaying.userId !== session.user.id) {
    redirect("/");
  }

  // For now, redirect to profile - edit functionality can be added later
  redirect(`/profile/${session.user.id}`);
}

