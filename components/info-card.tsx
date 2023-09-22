import Link from "next/link";
import BlurImage from "./blur-image";

import type { Info } from "@prisma/client";
import { placeholderBlurhash, toDateString } from "@/lib/utils";

interface InfoCardProps {
  data: Pick<
    Info,
    | "name"
    | "slug"
    | "image"
    | "imageBlurhash"
    | "name"
    | "description"
    | "createdAt"
  >;
}

export default function InfoCard({ data }: InfoCardProps) {
  return (
    <Link href={`/${data.slug}`}>
      <div className="ease w-[400px] overflow-hidden rounded-2xl border-2 border-stone-100 bg-white px-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-stone-800 md:w-[360px] md:px-0">
        <BlurImage
          src={data.image!}
          alt={data.name ?? "Blog Post"}
          width={500}
          height={400}
          className="h-64 w-full object-cover"
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        <div className="h-36 border-t border-stone-200 px-5 py-8 dark:border-stone-700 dark:bg-black">
          <h3 className="font-title text-xl tracking-wide dark:text-white">
            {data.name}
          </h3>
          <p className="text-md my-2 truncate italic text-stone-600 dark:text-stone-400">
            {data.description}
          </p>
          <p className="my-2 text-sm text-stone-600 dark:text-stone-400">
            {toDateString(data.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
