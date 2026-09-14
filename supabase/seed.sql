-- Sample services so the site is not empty on first run.
-- The owner can edit/add/remove these freely from the dashboard.

insert into public.services (name, description, car_price, motorcycle_price, is_active)
values
  ('غسيل خارجي', 'غسيل كامل لهيكل السيارة الخارجي مع تنشيف يدوي', 100, 60, true),
  ('غسيل داخلي وخارجي', 'غسيل شامل للخارج والداخل مع تنظيف المقاعد والتابلوه', 150, 80, true)
on conflict do nothing;
