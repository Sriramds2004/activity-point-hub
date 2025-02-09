
import { Table, TableBody } from "@/components/ui/table";
import { useStudentAssignment } from "@/hooks/useStudentAssignment";
import { StudentTableHeader } from "@/components/students/StudentTableHeader";
import { StudentTableRow } from "@/components/students/StudentTableRow";

export function StudentSelection() {
  const {
    students,
    assignedStudents,
    loading,
    assignStudent,
    unassignStudent,
  } = useStudentAssignment();

  if (loading) {
    return <div>Loading students...</div>;
  }

  return (
    <div>
      <Table>
        <StudentTableHeader />
        <TableBody>
          {students.map((student) => (
            <StudentTableRow
              key={student.usn}
              student={student}
              isAssigned={assignedStudents.includes(student.usn)}
              onAssign={assignStudent}
              onUnassign={unassignStudent}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
