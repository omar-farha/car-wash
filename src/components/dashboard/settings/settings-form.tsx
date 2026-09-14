"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { settingsFormSchema } from "@/lib/validations";
import { updateSettings } from "@/lib/actions/settings";
import type { Database } from "@/types/database";

type Settings = Database["public"]["Tables"]["settings"]["Row"];

export function SettingsForm({ settings }: { settings: Settings }) {
  const [businessName, setBusinessName] = useState(settings.business_name);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number ?? "");
  const [phone, setPhone] = useState(settings.phone ?? "");
  const [address, setAddress] = useState(settings.address ?? "");
  const [currency, setCurrency] = useState(settings.currency);
  const [invoiceFooterText, setInvoiceFooterText] = useState(settings.invoice_footer_text ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = settingsFormSchema.safeParse({
      businessName,
      whatsappNumber,
      phone,
      address,
      currency,
      invoiceFooterText,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const result = await updateSettings(parsed.data);
      if (result.success) {
        toast.success("تم حفظ الإعدادات");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="settings-name">اسم المغسلة</Label>
          <Input
            id="settings-name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
          {errors.businessName && (
            <p className="mt-1.5 text-sm text-red-600">{errors.businessName}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="settings-phone">رقم الهاتف</Label>
            <Input
              id="settings-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className="text-right"
              placeholder="0102xxxxxxx"
            />
          </div>
          <div>
            <Label htmlFor="settings-whatsapp">رقم الواتساب</Label>
            <Input
              id="settings-whatsapp"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              dir="ltr"
              className="text-right"
              placeholder="201012345678"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="settings-address">العنوان</Label>
          <Textarea
            id="settings-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="settings-currency">العملة</Label>
            <Input
              id="settings-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="EGP"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="settings-footer">نص أسفل الفاتورة (اختياري)</Label>
          <Textarea
            id="settings-footer"
            value={invoiceFooterText}
            onChange={(e) => setInvoiceFooterText(e.target.value)}
            rows={2}
            placeholder="شكرًا لثقتكم بنا"
          />
        </div>

        <Button type="submit" size="lg" loading={pending}>
          حفظ الإعدادات
        </Button>
      </form>
    </Card>
  );
}
