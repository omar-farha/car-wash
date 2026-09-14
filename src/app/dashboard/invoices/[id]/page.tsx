import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvoiceView } from "@/components/invoice/invoice-view";
import { requireStaff } from "@/lib/auth";
import { getSettings } from "@/lib/data/settings";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "الفاتورة" };

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireStaff();
  const supabase = await createClient();

  const [settings, { data: invoice }] = await Promise.all([
    getSettings(),
    supabase.from("invoices").select("*").eq("id", id).maybeSingle(),
  ]);

  if (!invoice) notFound();

  const { data: customer } = await supabase
    .from("customers")
    .select("name, phone")
    .eq("id", invoice.customer_id)
    .maybeSingle();

  return (
    <InvoiceView
      invoice={{
        invoiceNumber: invoice.invoice_number,
        createdAt: invoice.created_at,
        customerName: customer?.name ?? "",
        customerPhone: customer?.phone ?? "",
        serviceName: invoice.service_name,
        vehicleType: invoice.vehicle_type,
        price: invoice.price,
        paymentMethod: invoice.payment_method,
      }}
      businessName={settings.business_name}
      businessPhone={settings.phone}
      businessAddress={settings.address}
      currency={settings.currency}
      footerText={settings.invoice_footer_text}
    />
  );
}
