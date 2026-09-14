# نظام إدارة مغسلة السيارات

نظام كامل لإدارة مغسلة سيارات ذات فرع واحد: موقع عملاء لحجز المواعيد، ولوحتا تحكم
لصاحب المغسلة والموظفين (طلبات، حجوزات، عملاء، خدمات وأسعار، فواتير، ماليات
وتقارير)، مبني بالكامل بالعربية و RTL.

## التقنيات المستخدمة

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth + Row Level Security)
- Recharts, React Hook Form + Zod, Radix UI primitives

## الإعداد

### 1. تثبيت الحزم

```bash
npm install
```

### 2. إنشاء مشروع Supabase

أنشئ مشروعًا جديدًا على [supabase.com](https://supabase.com)، ثم من **Project
Settings → API** انسخ:

- `Project URL`
- `anon public` key
- `service_role` key (سرّي، لا تشاركه أبدًا)

انسخ `.env.local.example` إلى `.env.local` واملأ القيم:

```bash
cp .env.local.example .env.local
```

### 3. تطبيق قاعدة البيانات

من **SQL Editor** في Supabase، نفّذ الملفين بالترتيب:

1. `supabase/migrations/0001_init.sql` — الجداول، القيود، RLS
2. `supabase/seed.sql` — خدمتان تجريبيتان (يمكن تعديلهما لاحقًا من لوحة التحكم)

أو باستخدام Supabase CLI إذا كان المشروع مربوطًا:

```bash
supabase db push
```

### 4. إنشاء أول حساب Owner

لا يوجد حساب Owner افتراضي (لأسباب أمنية). لإنشاء أول حساب:

1. من **Authentication → Users** في Supabase، أضف مستخدمًا جديدًا بالبريد
   الإلكتروني وكلمة المرور التي تريدها لصاحب المغسلة، وفعّل "Auto Confirm User".
2. انسخ الـ `User UID` الخاص به.
3. من **SQL Editor** نفّذ (مع استبدال القيم):

```sql
insert into public.profiles (id, full_name, role, is_active)
values ('USER_UID_HERE', 'اسم صاحب المغسلة', 'owner', true);
```

بعدها يمكن لصاحب المغسلة تسجيل الدخول من `/login` وإضافة الموظفين من لوحة
التحكم مباشرة.

### 5. تشغيل المشروع محليًا

```bash
npm run dev
```

الموقع: `http://localhost:3000`
لوحة الدخول: `http://localhost:3000/login`

## WhatsApp

النظام جاهز للربط مع WhatsApp Business API دون أي كسر إذا لم تتوفر
الاعتمادات بعد. عند ملء `WHATSAPP_API_URL` و`WHATSAPP_API_TOKEN` و
`WHATSAPP_PHONE_NUMBER_ID` في `.env.local` يبدأ النظام تلقائيًا في إرسال:

- تأكيد الحجز
- تذكير بالحجز (يتطلب ربط `/api/cron/booking-reminders` بجدولة خارجية مثل
  Vercel Cron، مرة يوميًا)
- إشعار جاهزية الطلب

بدون هذه الاعتمادات، يتم تسجيل الإشعارات في جدول `notifications` بحالة
`skipped` دون إرسال فعلي، ولا يتأثر عمل النظام.

## البنية

```
src/
  app/            صفحات Next.js (الموقع العام + /login + /dashboard)
  components/     مكونات UI، الموقع، ولوحة التحكم
  lib/
    actions/      Server Actions (المنطق الأساسي لكل عملية)
    data/         استعلامات القراءة من Supabase
    supabase/     عملاء Supabase (browser / server / admin)
  types/          أنواع TypeScript لقاعدة البيانات
supabase/
  migrations/     Schema كامل + RLS
  seed.sql        بيانات تجريبية للخدمات
```

## ملاحظات أمنية

- كل الكتابة الحساسة (تعديل الأسعار، إدارة الموظفين، المصروفات) تمر عبر
  Server Actions تتحقق من الدور (owner/employee) على الخادم، بالإضافة إلى
  RLS على مستوى قاعدة البيانات — لا يعتمد النظام على إخفاء الواجهة فقط.
- مفتاح `service_role` يُستخدم فقط داخل ملفات الخادم (`lib/supabase/admin.ts`)
  ولا يصل إطلاقًا إلى المتصفح.
