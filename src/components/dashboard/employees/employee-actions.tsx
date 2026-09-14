"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { setEmployeeActive, deleteEmployee } from "@/lib/actions/employees";

export function EmployeeActions({
  employeeId,
  employeeName,
  isActive,
}: {
  employeeId: string;
  employeeName: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggleActive(checked: boolean) {
    startTransition(async () => {
      const result = await setEmployeeActive(employeeId, checked);
      if (result.success) {
        toast.success(checked ? "تم تفعيل الموظف" : "تم تعطيل الموظف");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteEmployee(employeeId);
      if (result.success) {
        toast.success("تم حذف الموظف");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Switch checked={isActive} onCheckedChange={toggleActive} disabled={pending} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" disabled={pending} className="text-red-600 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف &quot;{employeeName}&quot;؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف حساب الموظف نهائيًا ولن يتمكن من تسجيل الدخول مرة أخرى.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>تراجع</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>تأكيد الحذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
