
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Student = Database["public"]["Tables"]["students"]["Row"];

export function useStudentAssignment() {
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
      const user = await supabase.auth.getUser();
      
      const { data: teacherData } = await supabase
        .from("teachers")
        .select("teacher_id")
        .eq("email", user.data.user?.email)
        .maybeSingle();
        
      if (!teacherData) {
        console.log("No teacher record found");
        return;
      }

      const { data: counselingData } = await supabase
        .from("student_counseling")
        .select("student_usn")
        .eq("teacher_id", teacherData.teacher_id);

      setAssignedStudents(counselingData?.map(d => d.student_usn || '') || []);
    } catch (error) {
      console.error("Error fetching assigned students:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignStudent = async (usn: string) => {
    try {
      const user = await supabase.auth.getUser();
      
      const { data: teacherData } = await supabase
        .from("teachers")
        .select("teacher_id")
        .eq("email", user.data.user?.email)
        .maybeSingle();
        
      if (!teacherData) {
        toast({
          title: "Error",
          description: "Teacher record not found",
          variant: "destructive",
        });
        return;
      }

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
        description: "Failed to assign student",
        variant: "destructive",
      });
    }
  };

  const unassignStudent = async (usn: string) => {
    try {
      const user = await supabase.auth.getUser();
      
      const { data: teacherData } = await supabase
        .from("teachers")
        .select("teacher_id")
        .eq("email", user.data.user?.email)
        .maybeSingle();
        
      if (!teacherData) {
        toast({
          title: "Error",
          description: "Teacher record not found",
          variant: "destructive",
        });
        return;
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

  return {
    students,
    assignedStudents,
    loading,
    assignStudent,
    unassignStudent,
  };
}
