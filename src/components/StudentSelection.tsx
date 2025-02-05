import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Student = Database["public"]["Tables"]["students"]["Row"];

export function StudentSelection() {
  const [students, setStudents] = useState<Student[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    fetchAssignedStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data: studentsData, error } = await supabase
        .from("students")
        .select("*");

      if (error) throw error;
      setStudents(studentsData || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  const fetchAssignedStudents = async () => {
    try {
      const { data: counselingData, error } = await supabase
        .from("student_counseling")
        .select("student_usn")
        .eq("teacher_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      setAssignedStudents(counselingData.map(d => d.student_usn || ''));
    } catch (error) {
      console.error("Error fetching assigned students:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignStudent = async (usn: string) => {
    try {
      const { error } = await supabase
        .from("student_counseling")
        .insert({
          student_usn: usn,
          teacher_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student assigned successfully",
      });

      setAssignedStudents([...assignedStudents, usn]);
    } catch (error) {
      console.error("Error assigning student:", error);
      toast({
        title: "Error",
        description: "Failed to assign student",
        variant: "destructive",
      });
    }
  };

  const unassignStudent = async (usn: string) => {
    try {
      const { error } = await supabase
        .from("student_counseling")
        .delete()
        .eq("student_usn", usn)
        .eq("teacher_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student unassigned successfully",
      });

      setAssignedStudents(assignedStudents.filter(id => id !== usn));
    } catch (error) {
      console.error("Error unassigning student:", error);
      toast({
        title: "Error",
        description: "Failed to unassign student",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading students...</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>USN</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.usn}>
              <TableCell>{student.usn}</TableCell>
              <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
              <TableCell>{student.dept}</TableCell>
              <TableCell>{student.year}</TableCell>
              <TableCell>
                {assignedStudents.includes(student.usn) ? (
                  <Button
                    variant="destructive"
                    onClick={() => unassignStudent(student.usn)}
                  >
                    Unassign
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => assignStudent(student.usn)}
                  >
                    Assign
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}