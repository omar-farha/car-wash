أنت الآن تعمل كـ Senior Full-Stack Engineer + UI/UX Designer داخل هذا المشروع.

مهم جدًا:

- ابدأ التنفيذ الفعلي مباشرة.
- لا تكتب لي خطة تنفيذ طويلة قبل البدء.
- لا تنتظر موافقتي على أي خطوة.
- لا تتوقف بعد كل مرحلة لتسألني ماذا أفعل.
- افحص المشروع الحالي بسرعة، ثم نفّذ كل المطلوب.
- إذا وجدت شيئًا غير محدد، اختر أبسط حل احترافي ومنطقي واستمر.
- لا تضف Features غير مطلوبة لمجرد زيادة حجم المشروع.
- لا تعمل Over-engineering.
- لا تغيّر الـTech Stack بدون سبب قوي.
- لا تترك أجزاء Mock أو Placeholder إذا كان من الممكن تنفيذها فعليًا.
- بعد الانتهاء، قم بعدة جولات من المراجعة والإصلاح بنفسك قبل اعتبار المشروع مكتملًا.

# 1. فكرة المشروع

نريد بناء نظام كامل لإدارة مغسلة سيارات لها فرع واحد.

النظام يتكون من:

1. موقع للعميل Customer Website.
2. Dashboard للـOwner.
3. Dashboard للـEmployee.
4. نظام حجز مواعيد.
5. نظام إدارة Orders.
6. نظام إدارة العملاء.
7. نظام الخدمات والأسعار.
8. نظام فواتير.
9. نظام Finance وتقارير.
10. WhatsApp notifications architecture قابلة للربط.
11. Authentication وصلاحيات.
12. Database كاملة.

كل واجهة المستخدم وكل النصوص داخل النظام يجب أن تكون باللغة العربية بالكامل وبـRTL.

العملة: EGP / جنيه مصري.

# 2. Tech Stack

استخدم:

- Next.js
- App Router
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- MUI أو shadcn/ui أو أي UI primitives مناسبة إذا كانت ستنتج تصميمًا أفضل.

التزم بالـStack الموجود في المشروع إذا كان المشروع موجودًا بالفعل ولا تعِد بناء المشروع من الصفر بدون داعٍ.

# 3. أهم أولوية: التصميم

التصميم مهم جدًا.

لا أريد Dashboard تقليدية أو شكل Admin Template جاهز.

أريد تصميمًا Premium وModern واحترافيًا جدًا، مناسبًا لشركة Car Wash حقيقية.

Visual Identity:

- الأبيض ودرجاته.
- الأحمر ودرجاته.
- Dark text بدرجات مناسبة.
- استخدم الأحمر كـAccent وليس بشكل مبالغ فيه.
- مساحات بيضاء جيدة.
- Typography عربية ممتازة.
- Cards نظيفة.
- Borders ناعمة.
- Shadows خفيفة.
- Border radius حديث.
- Micro-interactions.
- Smooth transitions.
- Hover states.
- Loading states.
- Empty states.
- Success/Error states.
- Skeleton loading عند الحاجة.

التصميم يجب أن يكون متناسقًا في كل المشروع.

استخدم خط عربي مناسب وحديث، مثل Cairo أو ما يناسب المشروع.

لا تستخدم ألوانًا كثيرة بلا سبب.

لا تستخدم Gradients بشكل مبالغ فيه.

لا تجعل الواجهة مزدحمة.

لا تجعل كل شيء Card داخل Card داخل Card.

المطلوب Design System واضح ومتناسق.

# 4. Customer Website

أنشئ موقعًا عامًا للعميل يحتوي على:

## الرئيسية

Hero section قوية جدًا واحترافية.

يجب أن يكون واضحًا:

- اسم المغسلة يمكن تغييره لاحقًا.
- خدماتنا.
- حجز موعد.
- CTA واضح للحجز.
- معلومات التواصل.
- تصميم Mobile ممتاز.

بما أن اسم المغسلة غير محدد حاليًا، استخدم اسمًا مؤقتًا واضحًا وسهل تغييره من Settings.

## الخدمات

عرض الخدمات الموجودة.

كل Service تعرض:

- الاسم.
- وصف مختصر.
- السعر للسيارة.
- السعر للموتوسيكل/السكوتر.

الأسعار يتم جلبها من Database وليس Hardcoded.

## حجز موعد

العميل لا يحتاج إلى Account أو Login.

يملأ فقط:

- الاسم.
- رقم الهاتف.
- نوع المركبة:
  - سيارة.
  - موتوسيكل / سكوتر.

- الخدمة.
- التاريخ.
- الوقت.

ثم يؤكد الحجز.

يجب منع حجز نفس الـTime Slot إذا كان محجوزًا بالفعل.

بعد نجاح الحجز:

- يظهر Success screen واضح.
- يظهر ملخص الحجز.
- يتم تجهيز WhatsApp confirmation flow.

# 5. Customer Data

نريد الاحتفاظ ببيانات بسيطة فقط:

- الاسم.
- رقم الهاتف.

لا تضف:

- Email.
- Address.
- Car model.
- Car color.
- License plate.
- صور.
- أي بيانات إضافية.

يمكن ربط العميل بعدة Orders وBookings باستخدام رقم الهاتف.

# 6. Booking System

الـBooking يحتوي على:

- Customer.
- Service.
- Vehicle type.
- Date.
- Time.
- Status.
- Created at.

Statuses:

- قيد الانتظار
- تم الوصول
- جاري الخدمة
- مكتمل
- ملغي

عند وصول العميل للمغسلة يمكن تحويل الحجز إلى Order.

يجب منع تضارب المواعيد.

اعرض الـAvailable Slots فقط عندما تكون متاحة.

لا تسمح للعميل باختيار موعد محجوز.

# 7. Walk-in Orders

المغسلة لا تعتمد فقط على Online Booking.

الموظف يستطيع إنشاء Order جديد مباشرة من Dashboard للعميل الذي حضر بدون حجز.

عند إنشاء Order:

- اسم العميل.
- رقم الهاتف.
- نوع المركبة.
- الخدمة.

السعر يحسب تلقائيًا من الخدمة + نوع المركبة.

# 8. Order Workflow

كل Order يجب أن يكون له Status واضح.

Workflow الأساسي:

WAITING
↓
WASHING
↓
CLEANING
↓
READY
↓
COMPLETED

يمكن للموظف تحديث الـStatus.

الواجهة يجب أن تجعل تغيير الحالة سريعًا جدًا.

استخدم Badges / Buttons واضحة لكل حالة.

عند الضغط على "إتمام الطلب":

1. يتحول Order إلى Completed.
2. يتم تسجيل الدفع كـCash.
3. يتم إنشاء Invoice تلقائيًا.
4. يتم تسجيل الإيراد.
5. تظهر الفاتورة مباشرة للموظف.
6. يمكن طباعة الفاتورة.
7. يمكن العودة للطلبات.

# 9. Invoice

عند إتمام Order تظهر Invoice مباشرة.

الفاتورة تحتوي على:

- اسم المغسلة.
- رقم الفاتورة.
- التاريخ والوقت.
- اسم العميل.
- رقم الهاتف.
- نوع المركبة.
- الخدمة.
- السعر.
- طريقة الدفع: كاش.
- الإجمالي.

مثال:

مغسلة السيارات

فاتورة رقم #1024

العميل: أحمد محمد
الهاتف: 010xxxxxxxx

الخدمة: غسيل داخلي وخارجي
المركبة: سيارة

طريقة الدفع: كاش

الإجمالي: 150 جنيه

يجب أن تكون الفاتورة مصممة بشكل احترافي وقابلة للطباعة.

# 10. Services & Pricing

Owner فقط يستطيع تعديل الخدمات والأسعار.

كل Service لديها:

- Name
- Description
- Car Price
- Motorcycle/Scooter Price
- Active/Inactive

مثلاً:

غسيل خارجي
سيارة: 100
موتوسيكل: 60

غسيل داخلي وخارجي
سيارة: 150
موتوسيكل: 80

هذه مجرد أمثلة.

لا تفترض أن هذه هي الأسعار النهائية.

يجب أن يستطيع Owner تعديلها بالكامل من Dashboard.

عند تعديل السعر، الطلبات القديمة والفواتير القديمة يجب أن تحتفظ بالسعر الذي تم دفعه وقتها.

لا تجعل الفواتير القديمة تتغير عندما يتم تغيير سعر الخدمة.

# 11. Owner Dashboard

أنشئ Dashboard احترافية جدًا.

الـOwner يستطيع الوصول إلى:

- Dashboard
- Orders
- Bookings
- Customers
- Services
- Employees
- Finance
- Reports
- Settings

## Dashboard Overview

اعرض:

- إيرادات اليوم.
- عدد السيارات اليوم.
- صافي الربح.
- عدد الحجوزات.
- الطلبات الحالية.
- السيارات المنتظرة.
- السيارات تحت الخدمة.
- السيارات الجاهزة.

أضف Chart مناسب للإيرادات والمصروفات.

أضف قسم:

"حالة المغسلة الآن"

يعرض:

- Waiting.
- Washing.
- Cleaning.
- Ready.

# 12. Orders Dashboard

اعرض كل الطلبات بشكل واضح.

Features:

- Search.
- Filter by status.
- Filter by date.
- Filter by employee.
- Filter by service.
- View Order.
- Update Status.
- Complete Order.

اجعل إنشاء Order جديد سريعًا جدًا.

# 13. Bookings Dashboard

اعرض الحجوزات القادمة.

Filters:

- اليوم.
- غدًا.
- هذا الأسبوع.
- تاريخ مخصص.

اعرض:

- العميل.
- الهاتف.
- الخدمة.
- نوع المركبة.
- الموعد.
- الحالة.

Owner وEmployee يستطيعان إدارة الحجوزات.

# 14. Customers

أنشئ Customers page.

اعرض:

- الاسم.
- رقم الهاتف.
- عدد الزيارات.
- إجمالي المدفوعات.
- آخر زيارة.

عند فتح Customer:

اعرض تاريخ طلباته السابقة.

لا تجمع بيانات إضافية غير مطلوبة.

# 15. Employees

يوجد نوعان من المستخدمين:

OWNER
EMPLOYEE

Owner يستطيع:

- إضافة Employee.
- حذف Employee.
- تعطيل Employee.
- إعادة تفعيل Employee.

Employee يستطيع:

- رؤية الطلبات.
- إنشاء Orders.
- تحديث Order status.
- رؤية الحجوزات.
- رؤية العملاء.
- إتمام Orders.

Employee لا يستطيع:

- تعديل الأسعار.
- إدارة Employees.
- تعديل إعدادات النظام.
- رؤية أو تعديل كل إعدادات Finance الحساسة.

# 16. Finance

نظام مالي بسيط وليس ERP معقد.

عند Complete Order:

Revenue يتم تسجيله تلقائيًا.

Payment method:

Cash فقط حاليًا.

Owner يستطيع إضافة Expenses يدويًا.

Expense يحتوي على:

- الاسم / الوصف.
- المبلغ.
- Category.
- التاريخ.

Dashboard Finance تعرض:

- Income.
- Expenses.
- Net Profit.

Net Profit = Income - Expenses.

أضف Filters:

- اليوم.
- هذا الأسبوع.
- هذا الشهر.
- الشهر السابق.
- هذا العام.
- Custom Range.

# 17. Reports

Owner فقط يستطيع رؤية Reports.

اعرض:

- Total Revenue.
- Total Expenses.
- Net Profit.
- Number of Orders.
- Number of Cars.
- Completed Orders.
- Cancelled Orders.
- Most requested Services.
- Employee performance.

أضف Charts بسيطة وواضحة.

لا تجعل الـReports معقدة بشكل غير ضروري.

# 18. WhatsApp

نريد WhatsApp notifications.

جهز architecture نظيفة تسمح بربط WhatsApp API لاحقًا.

Events المطلوبة:

1. Booking confirmation.
2. Booking reminder.
3. Order ready notification.

لا تدخل في Integration معقد أو مدفوع حاليًا إذا كانت credentials غير موجودة.

اجعل النظام جاهزًا للربط بدون كسر المشروع.

لا ترسل رسائل حقيقية إذا لم توجد credentials.

# 19. Authentication

Owner وEmployee يحتاجان Login.

Customer لا يحتاج Login.

استخدم Supabase Auth.

Role-based access control واضح.

تأكد أن Employee لا يستطيع الوصول إلى Owner-only pages حتى لو حاول فتح الـURL مباشرة.

لا تعتمد على إخفاء الـUI فقط.

# 20. Settings

أنشئ Settings للـOwner.

يستطيع منها تعديل:

- اسم المغسلة.
- رقم WhatsApp.
- رقم الهاتف.
- العنوان.
- العملة.
- بيانات الفاتورة.

اسم المغسلة الافتراضي يكون مؤقتًا وقابلًا للتغيير.

# 21. Arabic RTL

كل المشروع RTL.

تأكد من:

- Sidebar.
- Tables.
- Forms.
- Modals.
- Dropdowns.
- Charts.
- Date pickers.
- Invoice.
- Notifications.
- Buttons.
- Navigation.

لا تترك أي English UI text غير ضروري.

يمكن أن تبقى أسماء الـdatabase fields والـcode باللغة الإنجليزية، لكن الـUI للمستخدم عربي بالكامل.

# 22. Responsive

يجب أن يعمل بشكل ممتاز على:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Employee Dashboard خصوصًا يجب أن تكون Mobile friendly لأن الموظف قد يستخدم هاتفًا أو Tablet أثناء العمل.

لا تجعل الجداول تكسر الشاشة.

استخدم responsive tables/cards عند الحاجة.

# 23. UX

ركز جدًا على السرعة وسهولة الاستخدام.

مثلاً إنشاء Order يجب أن يكون سريعًا.

لا تجعل الموظف يفتح 5 صفحات لإتمام عملية بسيطة.

استخدم:

- Quick actions.
- Modals عندما تكون مناسبة.
- Toast notifications.
- Confirmation dialogs للعمليات الخطرة.
- Loading states.
- Empty states.
- Error states.
- Success feedback.

# 24. Database

صمم PostgreSQL schema نظيفًا.

يجب أن تكون هناك جداول مناسبة على الأقل لـ:

- profiles/users
- customers
- employees / profiles حسب التصميم
- services
- bookings
- orders
- order_items إذا احتجت إليها
- invoices
- payments
- expenses
- notifications
- settings

استخدم Foreign Keys وIndexes وConstraints مناسبة.

لا تكرر البيانات بدون داعٍ.

مهم جدًا:

الأسعار التاريخية يجب حفظها داخل Order/Invoice وقت تنفيذ الخدمة.

تغيير Service price مستقبلًا لا يغير الفواتير القديمة.

# 25. Data Integrity

اهتم جدًا بـ:

- Duplicate bookings.
- Invalid statuses.
- Negative prices.
- Negative expenses.
- Missing customers.
- Unauthorized access.
- Race conditions عند حجز نفس الـslot.
- Old invoice prices changing.
- Employee accessing Owner data.
- Invalid date/time.

استخدم Database constraints عندما يكون ذلك مناسبًا بدل الاعتماد على Frontend فقط.

# 26. Performance

لا تبالغ في optimization.

لكن:

- تجنب unnecessary requests.
- استخدم Server Components حيث تكون مناسبة.
- استخدم Client Components فقط عندما تحتاج interaction.
- لا تعمل polling عشوائي.
- لا تحمل بيانات ضخمة بلا داعٍ.
- استخدم pagination إذا كانت البيانات كبيرة.

# 27. Code Quality

اكتب code نظيف وقابل للصيانة.

- TypeScript types واضحة.
- Components منظمة.
- Reusable components.
- لا تكرر نفس الـUI عشر مرات.
- لا تضع كل شيء في ملف واحد.
- لا تستخدم `any` إلا عند الضرورة القصوى.
- لا تترك console errors.
- لا تترك TODOs لمميزات أساسية.

# 28. لا تضف Features غير مطلوبة

ممنوع إضافة:

- Loyalty points.
- Membership system.
- Online payments.
- Delivery.
- Inventory.
- POS hardware integration.
- Attendance.
- Payroll.
- Multi-branch.
- Customer accounts.
- Vehicle registration details.
- Complex CRM.
- AI features.

إلا إذا كانت مطلوبة لاحقًا.

نريد النسخة الحالية بسيطة، قوية، وسريعة.

# 29. التنفيذ

ابدأ الآن.

أولًا افحص المشروع الحالي بسرعة:

- package.json
- existing app structure
- existing components
- existing styles
- existing Supabase setup
- environment variables
- current routes

ثم نفذ المطلوب مباشرة.

إذا كان المشروع فارغًا، ابنِ المشروع بشكل كامل.

إذا كان فيه أجزاء جيدة، أعد استخدامها بدل إعادة كتابتها بلا داعٍ.

# 30. ممنوع التوقف للـPlanning

لا تكتب:

"سأقوم أولًا بوضع خطة..."

ولا تنتظر approval.

لا تسألني عن تفاصيل غير ضرورية.

إذا كانت هناك نقطة غير محددة:

اختر الحل الأبسط والأكثر احترافية ونفذه.

# 31. Self Review

هذه نقطة مهمة جدًا.

بعد الانتهاء من البناء، لا تعتبر المشروع انتهى مباشرة.

قم بنفسك بعدة مراحل مراجعة:

## Review 1 — Build

شغل المشروع وتأكد أنه يبني بدون errors.

أصلح كل build errors.

## Review 2 — TypeScript

شغل type checking.

أصلح كل TypeScript errors.

## Review 3 — Lint

شغل lint.

أصلح المشاكل المهمة.

## Review 4 — Database

راجع:

- Tables.
- Relationships.
- Foreign keys.
- Constraints.
- RLS.
- Permissions.
- Indexes.

## Review 5 — Authentication

اختبر:

Owner login.

Employee login.

تأكد أن Employee لا يستطيع الوصول إلى Owner-only routes.

## Review 6 — Booking

اختبر:

- Create booking.
- Duplicate time slot.
- Invalid data.
- Cancel booking.
- Multiple bookings.
- Date filtering.

## Review 7 — Order

اختبر:

Walk-in order.

Booking → Order.

Status changes.

Complete order.

## Review 8 — Invoice

اختبر أن:

Complete Order

ينتج عنه:

Order completed

- Payment
- Revenue
- Invoice

وتأكد أن السعر التاريخي لا يتغير بعد تعديل Service price.

## Review 9 — Finance

اختبر:

Income.

Expense.

Net Profit.

Date filters.

## Review 10 — UI

راجع كل صفحة بصريًا.

تأكد من:

- Consistent spacing.
- Consistent typography.
- Consistent colors.
- No overflow.
- No broken layouts.
- No ugly default components.
- No unnecessary cards.
- No excessive animations.
- No missing states.

## Review 11 — Responsive

راجع:

Desktop.

Tablet.

Mobile.

خصوصًا:

- Dashboard.
- Tables.
- Forms.
- Booking.
- Invoice.

## Review 12 — UX

تأكد أن الموظف يستطيع تنفيذ السيناريو الكامل بأقل عدد ممكن من الخطوات:

عميل يدخل
→ إنشاء Order
→ اختيار الخدمة
→ بدء الخدمة
→ تغيير الحالة
→ Complete
→ Invoice

يجب أن يكون هذا workflow سريعًا وواضحًا.

# 32. Final cleanup

قبل النهاية:

- احذف unused imports.
- احذف unused components.
- احذف unused variables.
- أصلح warnings المهمة.
- تأكد من عدم وجود broken links.
- تأكد من عدم وجود buttons لا تعمل.
- تأكد من عدم وجود صفحات فارغة.
- تأكد من عدم وجود mock data في الـproduction workflow.
- تأكد من أن البيانات الحقيقية تأتي من Supabase.
- تأكد من أن الـUI لا يحتوي على placeholder text غير مقصود.

# 33. Final result

في النهاية يجب أن يكون لدينا نظام Car Wash Management System حقيقي قابل للاستخدام، وليس مجرد UI demo.

يجب أن يكون:

- Functional.
- Arabic.
- RTL.
- Responsive.
- Premium looking.
- Simple.
- Fast.
- Secure.
- Maintainable.

الأولوية بالترتيب:

1. Functionality.
2. UI/UX quality.
3. Data integrity.
4. Security.
5. Performance.
6. Code quality.

ابدأ التنفيذ الآن ولا تتوقف حتى تنتهي من جميع الأجزاء والمراجعات والإصلاحات المطلوبة.
