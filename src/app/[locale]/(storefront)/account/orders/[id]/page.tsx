import Link from "next/link";
import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import { OrderDetail } from "@/components/account/OrderDetail";
import { getOrder } from "@/lib/data/orders";
import { buildBasePath } from "@/lib/utils/path";

interface OrderDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  await connection();
  const { locale, id } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "orders",
  });
  const basePath = buildBasePath(locale);
  const order = await getOrder(id);

  if (!order || order.completed_at === null) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          {t("orderNotFound")}
        </h2>
        <p className="text-gray-500 mb-6">{t("orderNotFoundDescription")}</p>
        <Link
          href={`${basePath}/account/orders`}
          className="text-primary hover:text-primary font-medium"
        >
          {t("backToOrders")}
        </Link>
      </div>
    );
  }

  return <OrderDetail order={order} basePath={basePath} locale={locale} />;
}
