
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

export const useActivities = (userRole: "student" | "counselor" | "club") => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      console.log("Fetching activities...");
      let query = supabase.from("activities").select("*");
      
      if (userRole === "counselor") {
        const user = await supabase.auth.getUser();
        const { data: teacherData } = await supabase
          .from('teachers')
          .select('teacher_id')
          .eq('email', user.data.user?.email)
          .maybeSingle();
          
        if (teacherData) {
          const { data: counselingData } = await supabase
            .from('student_counseling')
            .select('student_usn');
            
          const studentUsns = counselingData?.map(record => record.student_usn) || [];
          if (studentUsns.length > 0) {
            query = query.in('student_usn', studentUsns);
          }
        }
      }
      
      const { data } = await query.order("date", { ascending: false });
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
  }, [userRole]);

  return { activities, loading, fetchActivities };
};
