import Link from "next/link";
import { notFound } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import InfoCard from "@/components/info-card";
import { getInfosForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Categories } from "@/components/categories";

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const [data, infos] = await Promise.all([
    getSiteData(params.domain),
    getInfosForSite(params.domain),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl md:mb-28 lg:w-5/6">
      <div className="max-w-screen mt-10">
        <div className="flex w-full flex-wrap justify-center gap-10">
          {infos.map((metadata, index: number) => (
            <InfoCard key={index} data={metadata} />
          ))}
        </div>
      </div>
    </div>
  );
}
