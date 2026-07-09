export const dynamic = "force-dynamic";

import type { Category } from "@spree/sdk";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getCategories } from "@/lib/data/categories";
import { getStoreInfo } from "@/lib/data/store";
import { buildBasePath } from "@/lib/utils/path";

interface StorefrontLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

function CategoryLinks({
  categories,
  basePath,
}: {
  categories: Category[];
  basePath: string;
}) {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id}>
          <Link href={`${basePath}/c/${category.permalink}`}>
            {category.name}
          </Link>
          {category.children && category.children.length > 0 && (
            <CategoryLinks categories={category.children} basePath={basePath} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function StorefrontLayout({
  children,
  params,
}: StorefrontLayoutProps) {
  const { locale } = await params;
  const basePath = buildBasePath(locale);

  // Fetched in parallel — neither await blocks on the other, keeping this
  // no slower than the pre-existing (blocking) categories fetch alone.
  const [rootCategories, storeInfo] = await Promise.all([
    getCategories({
      depth_eq: 0,
      expand: ["children.children"],
    })
      .then((res) => res.data)
      .catch((error) => {
        console.error("StorefrontLayout: failed to load categories", error);
        return [] as Category[];
      }),
    getStoreInfo().catch((error) => {
      console.error("StorefrontLayout: failed to load store info", error);
      return undefined;
    }),
  ]);

  return (
    <>
      <Header
        rootCategories={rootCategories}
        basePath={basePath}
        locale={locale as Locale}
        storeInfo={storeInfo}
      />
      {rootCategories.length > 0 && (
        <nav aria-label="Category navigation" className="sr-only">
          <CategoryLinks categories={rootCategories} basePath={basePath} />
        </nav>
      )}
      <main className="flex-1">{children}</main>
      <Footer
        rootCategories={rootCategories}
        basePath={basePath}
        locale={locale as Locale}
      />
    </>
  );
}
