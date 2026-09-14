import { z } from "zod";

// Egyptian mobile numbers: 01 followed by 0/1/2/5 and 8 more digits.
const phoneRegex = /^01[0125][0-9]{8}$/;

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "رقم الهاتف مطلوب")
  .regex(phoneRegex, "أدخل رقم هاتف مصري صحيح (مثال: 01012345678)");

export const bookingFormSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب").max(80, "الاسم طويل جدًا"),
  phone: phoneSchema,
  vehicleType: z.enum(["car", "motorcycle"]),
  serviceId: z.string().uuid("اختر خدمة"),
  bookingDate: z.string().min(1, "اختر التاريخ"),
  bookingTime: z.string().min(1, "اختر الوقت"),
});
export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const walkInOrderSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب").max(80, "الاسم طويل جدًا"),
  phone: phoneSchema,
  vehicleType: z.enum(["car", "motorcycle"]),
  serviceId: z.string().uuid("اختر خدمة"),
});
export type WalkInOrderValues = z.infer<typeof walkInOrderSchema>;

export const bookingToOrderSchema = z.object({
  bookingId: z.string().uuid(),
});

export const serviceFormSchema = z.object({
  name: z.string().trim().min(2, "اسم الخدمة مطلوب").max(80),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  carPrice: z.coerce.number().min(0, "السعر لا يمكن أن يكون سالبًا"),
  motorcyclePrice: z.coerce.number().min(0, "السعر لا يمكن أن يكون سالبًا"),
  isActive: z.boolean(),
});
export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export const employeeFormSchema = z.object({
  fullName: z.string().trim().min(2, "الاسم مطلوب").max(80),
  email: z.string().trim().email("بريد إلكتروني غير صحيح"),
  phone: z.string().trim().optional().or(z.literal("")),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const expenseFormSchema = z.object({
  description: z.string().trim().min(2, "الوصف مطلوب").max(150),
  amount: z.coerce.number().positive("المبلغ يجب أن يكون أكبر من صفر"),
  category: z.enum([
    "supplies",
    "salaries",
    "utilities",
    "maintenance",
    "rent",
    "other",
  ]),
  expenseDate: z.string().min(1, "التاريخ مطلوب"),
});
export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export const settingsFormSchema = z.object({
  businessName: z.string().trim().min(2, "اسم المغسلة مطلوب").max(80),
  whatsappNumber: z.string().trim().max(20).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  currency: z.string().trim().min(1).max(10),
  invoiceFooterText: z.string().trim().max(200).optional().or(z.literal("")),
});
export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().trim().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
export type LoginFormValues = z.infer<typeof loginFormSchema>;
