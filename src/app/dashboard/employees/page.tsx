import type { Metadata } from "next";
import { UserCog } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { EmployeeDialog } from "@/components/dashboard/employees/employee-dialog";
import { EmployeeActions } from "@/components/dashboard/employees/employee-actions";
import { requireOwner } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "الموظفين" };

export default async function EmployeesPage() {
  await requireOwner();
  const supabase = await createClient();
  const { data: employees } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "employee")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="الموظفين"
        description="إدارة حسابات موظفي المغسلة"
        action={<EmployeeDialog />}
      />

      {!employees || employees.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="لا يوجد موظفون بعد"
          description="أضف أول موظف ليتمكن من الدخول لإدارة الطلبات"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>تاريخ الإضافة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>إدارة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-semibold text-ink-900">
                  {employee.full_name}
                </TableCell>
                <TableCell dir="ltr" className="text-right">
                  {employee.phone ?? "—"}
                </TableCell>
                <TableCell>{formatDate(employee.created_at)}</TableCell>
                <TableCell>
                  <Badge variant={employee.is_active ? "success" : "neutral"}>
                    {employee.is_active ? "مفعّل" : "معطّل"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <EmployeeActions
                    employeeId={employee.id}
                    employeeName={employee.full_name}
                    isActive={employee.is_active}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
