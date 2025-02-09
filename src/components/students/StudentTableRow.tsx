
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Database } from "@/integrations/supabase/types";

type Student = Database["public"]["Tables"]["students"]["Row"];

interface StudentTableRowProps {
  student: Student;
  isAssigned: boolean;
  onAssign: (usn: string) => void;
  onUnassign: (usn: string) => void;
}

export function StudentTableRow({ 
  student, 
  isAssigned, 
  onAssign, 
  onUnassign 
}: StudentTableRowProps) {
  return (
    <TableRow>
      <TableCell>{student.usn}</TableCell>
      <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
      <TableCell>{student.dept}</TableCell>
      <TableCell>{student.year}</TableCell>
      <TableCell>
        {isAssigned ? (
          <Button
            variant="destructive"
            onClick={() => onUnassign(student.usn)}
          >
            Unassign
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => onAssign(student.usn)}
          >
            Assign
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
