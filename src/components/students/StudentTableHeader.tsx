
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function StudentTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>USN</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Department</TableHead>
        <TableHead>Year</TableHead>
        <TableHead>Action</TableHead>
      </TableRow>
    </TableHeader>
  );
}
