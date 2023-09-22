import { notFound, redirect } from "next/navigation";
import { getInfoData } from "@/lib/fetchers";
import BlurImage from "@/components/blur-image";
import { toDateString } from "@/lib/utils";
import { ChatBox } from "./components/chat-box";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;
  const data = await getInfoData(domain, slug);
  if (!data) {
    return null;
  }
  const { name, description } = data;

  return {
    name,
    description,
    openGraph: {
      name,
      description,
    },
  };
}
export default async function SiteInfoPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { domain, slug } = params;
  const data = await getInfoData(domain, slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="md:h-150 relative m-auto mb-10 h-[32rem] w-full max-w-screen-lg overflow-hidden md:mb-20 md:w-5/6 md:rounded-2xl lg:w-2/3">
        <ChatBox info={data} />
      </div>

      <footer className="absolute bottom-0 flex h-20 w-full items-center justify-center bg-secondary dark:bg-black">
        <div className="flex items-center justify-center gap-x-4">
          <p className="m-auto my-5 w-10/12 text-sm font-light text-stone-500 dark:text-stone-400 md:text-base">
            {toDateString(data.createdAt)}
          </p>
          <a
            // if you are using Github OAuth, you can get rid of the Twitter option
            href={`https://github.com/${data.site?.user?.gh_username}`}
            rel="noreferrer"
            target="_blank"
          >
            <div className="my-8 flex w-max items-center">
              <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
                {data.site?.user?.image ? (
                  <BlurImage
                    alt={data.site?.user?.name ?? "User Avatar"}
                    height={80}
                    src={data.site.user.image}
                    width={80}
                  />
                ) : (
                  <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">
                    ?
                  </div>
                )}
              </div>
              <div className="text-md ml-3 inline-block align-middle dark:text-white md:text-lg">
                by{" "}
                <span className="font-semibold">{data.site?.user?.name}</span>
              </div>
            </div>
          </a>
        </div>
      </footer>
    </>
  );
}
