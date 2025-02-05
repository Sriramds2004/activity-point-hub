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
      console.log("Fetching students...");
      const { data: studentsData, error } = await supabase
        .from("students")
        .select("*");

      if (error) throw error;
      console.log("Students fetched:", studentsData);
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
      const user = await supabase.auth.getUser();
      console.log("Current user:", user.data.user);
      
      // First verify if the teacher record exists
      const { data: teacherData, error: teacherError } = await supabase
        .from("teachers")
        .select("teacher_id")
        .eq("email", user.data.user?.email)
        .single();
        
      if (teacherError) {
        console.error("Teacher record not found:", teacherError);
        throw new Error("Teacher record not found. Please contact support.");
      }

      const { data: counselingData, error } = await supabase
        .from("student_counseling")
        .select("student_usn")
        .eq("teacher_id", teacherData.teacher_id);

      if (error) throw error;
      console.log("Assigned students fetched:", counselingData);
      setAssignedStudents(counselingData.map(d => d.student_usn || ''));
    } catch (error) {
      console.error("Error fetching assigned students:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignStudent = async (usn: string) => {
    try {
      const user = await supabase.auth.getUser();
      
      // Get teacher_id from teachers table
      const { data: teacherData, error: teacherError } = await supabase
        .from("teachers")
        .select("teacher_id")
        .eq("email", user.data.user?.email)
        .single();
        
      if (teacherError) {
        throw new Error("Teacher record not found. Please contact support.");
      }

      console.log("Assigning student with teacher_id:", teacherData.teacher_id);
      
      const { error } = await supabase
        .from("student_counseling")
        .insert({
          student_usn: usn,
          teacher_id: teacherData.teacher_id,
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
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const unassignStudent = async (usn: string) => {
    try {
      const user = await supabase.auth.getUser();
      
      // Get teacher_id from teachers table
      const { data: teacherData, error: teacherError } = await supabase
        .from("teachers")
        .select("teacher_id")
        .eq("email", user.data.user?.email)
        .single();
        
      if (teacherError) {
        throw new Error("Teacher record not found. Please contact support.");
      }

      const { error } = await supabase
        .from("student_counseling")
        .delete()
        .eq("student_usn", usn)
        .eq("teacher_id", teacherData.teacher_id);

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