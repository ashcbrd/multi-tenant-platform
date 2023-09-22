import { headers } from "next/headers";
import { getInfosForSite } from "@/lib/fetchers";

export default async function Sitemap() {
  const headersList = headers();
  const domain =
    headersList
      .get("host")
      ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    "platformstest.vercel.app";

  const infos = await getInfosForSite(domain);

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...infos.map(({ slug }) => ({
      url: `https://${domain}/${slug}`,
      lastModified: new Date(),
    })),
  ];
}
