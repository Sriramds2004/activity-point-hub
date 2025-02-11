
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Activity {
  activity_id: string;
  activity_name: string;
  date: string;
  points: number;
  deadline: string;
  document_url: string | null;
  approved_status: boolean;
  student_usn: string | null;
  students_can_download: boolean;
}

export const useActivities = (
  userRole: "student" | "counselor" | "club",
  studentUsn?: string
) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      console.log("Fetching activities...");
      let query = supabase
        .from("activities")
        .select("*")
        .order("date", { ascending: false });
      
      if (userRole === "student") {
        const user = await supabase.auth.getUser();
        const { data: studentData } = await supabase
          .from('students')
          .select('usn')
          .eq('email', user.data.user?.email)
          .maybeSingle();
          
        if (studentData) {
          console.log("Fetching activities for student:", studentData.usn);
          query = query.or(`student_usn.eq.${studentData.usn},and(approved_status.eq.true,student_usn.is.null)`);
        }
      } else if (userRole === "counselor" && studentUsn) {
        console.log("Fetching activities for specific student:", studentUsn);
        query = query.or(`student_usn.eq.${studentUsn},and(approved_status.eq.true,student_usn.is.null)`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      console.log("Activities fetched:", data);
      setActivities(data || []);
    } catch (error) {
      console.error("Error in fetchActivities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch activities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    const channel = supabase
      .channel("activities-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
        },
        () => {
          console.log("Activities changed, refreshing...");
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userRole, studentUsn]);

  return { activities, loading, fetchActivities };
};
