"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toCsv, downloadCsv, type CsvColumn } from "@/lib/csv";

export function ExportCsvButton<T>({
  data,
  columns,
  filename,
  label = "تصدير Excel",
}: {
  data: T[];
  columns: CsvColumn<T>[];
  filename: string;
  label?: string;
}) {
  function handleExport() {
    const csv = toCsv(data, columns);
    downloadCsv(filename, csv);
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={data.length === 0}>
      <Download className="size-4" />
      {label}
    </Button>
  );
}
