import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import InfoCard from "./information-card";
import Image from "next/image";

export default async function Infos({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  const infos = await prisma.info.findMany({
    where: {
      userId: session.user.id as string,
      ...(siteId ? { siteId } : {}),
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      site: true,
    },
    ...(limit ? { take: limit } : {}),
  });

  return infos.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {infos.map((info) => (
        <InfoCard key={info.id} data={info} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Venues Yet</h1>
      <Image
        alt="missing venue"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any venues yet. Create one to get started.
      </p>
    </div>
  );
}
