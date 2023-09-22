"use client";

import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { cn } from "@/lib/utils";

interface CategoriesProps {
  data: Category[];
}

export const Categories = ({ data }: CategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId");

  const onClick = (id: string | undefined) => {
    const query = { categoryId: id };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true },
    );
    router.push(url);
  };

  return (
    <div className="flex w-full justify-start space-x-2 overflow-auto p-1">
      <button
        onClick={() => onClick(undefined)}
        className={cn(
          `
        flex
        items-center
        rounded-md
        px-2
        py-2
        text-center
        text-xs
        transition
        md:px-4
        md:py-3
        md:text-sm
        `,
          !categoryId
            ? "bg-primary text-white dark:text-black"
            : "border border-primary bg-none hover:-translate-y-2",
        )}
      >
        Newest
      </button>
      {data.map((item) => (
        <button
          onClick={() => onClick(item.id)}
          key={item.id}
          className={cn(
            `
        flex
        items-center
        rounded-md
        px-2
        py-2
        text-center
        text-xs
        transition
        md:px-4
        md:py-3
        md:text-sm
        `,
            item.id === categoryId
              ? "bg-primary text-white dark:text-black"
              : "border border-primary bg-none hover:-translate-y-1",
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
