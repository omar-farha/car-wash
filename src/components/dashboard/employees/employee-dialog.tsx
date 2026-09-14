"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { employeeFormSchema } from "@/lib/validations";
import { createEmployee } from "@/lib/actions/employees";

export function EmployeeDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function reset() {
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = employeeFormSchema.safeParse({ fullName, email, phone, password });
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
      const result = await createEmployee(parsed.data);
      if (result.success) {
        toast.success("تم إنشاء حساب الموظف");
        setOpen(false);
        reset();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="size-4" />
          موظف جديد
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة موظف جديد</DialogTitle>
          <DialogDescription>سيتمكن الموظف من الدخول بهذا البريد وكلمة المرور</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="emp-name">الاسم الكامل</Label>
            <Input id="emp-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            {errors.fullName && <p className="mt-1.5 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          <div>
            <Label htmlFor="emp-email">البريد الإلكتروني</Label>
            <Input
              id="emp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="text-right"
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="emp-phone">رقم الهاتف (اختياري)</Label>
            <Input
              id="emp-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className="text-right"
            />
          </div>
          <div>
            <Label htmlFor="emp-password">كلمة المرور</Label>
            <Input
              id="emp-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              className="text-right"
            />
            {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" size="lg" className="w-full" loading={pending}>
              إنشاء الحساب
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
