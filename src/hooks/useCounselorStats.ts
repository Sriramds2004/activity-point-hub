
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CounselorStats {
  totalActivities: number;
  pendingActivities: number;
  approvedActivities: number;
}

export function useCounselorStats() {
  const [stats, setStats] = useState<CounselorStats>({
    totalActivities: 0,
    pendingActivities: 0,
    approvedActivities: 0,
  });
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      console.log("Fetching counselor stats...");
      const user = await supabase.auth.getUser();
      
      if (!user.data.user?.email) {
        console.error("No user email found");
        toast({
          title: "Error",
          description: "User email not found. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Fetching teacher record for email:", user.data.user.email);
      
      const { data: teacherData, error: teacherError } = await supabase
        .from("teachers")
        .select("teacher_id")
        .eq("email", user.data.user.email)
        .maybeSingle();
        
      if (teacherError) {
        console.error("Error fetching teacher record:", teacherError);
        toast({
          title: "Error",
          description: "Failed to fetch teacher record. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!teacherData) {
        console.error("No teacher record found for email:", user.data.user.email);
        toast({
          title: "Account Not Found",
          description: "No counselor account found. Please sign up first.",
          variant: "destructive",
        });
        return;
      }

      console.log("Teacher record found:", teacherData);

      const { data: counselingData, error: counselingError } = await supabase
        .from('student_counseling')
        .select('student_usn')
        .eq('teacher_id', teacherData.teacher_id);

      if (counselingError) {
        console.error("Error fetching counseling data:", counselingError);
        toast({
          title: "Error",
          description: "Failed to fetch student assignments.",
          variant: "destructive",
        });
        return;
      }

      const studentUsns = counselingData?.map(record => record.student_usn) || [];
      console.log("Assigned students:", studentUsns);

      const { data: activities, error: activitiesError } = await supabase
        .from("activities")
        .select("*");

      if (activitiesError) {
        console.error("Error fetching activities:", activitiesError);
        toast({
          title: "Error",
          description: "Failed to fetch activities.",
          variant: "destructive",
        });
        return;
      }

      const total = activities?.length || 0;
      const pending = activities?.filter(a => !a.approved_status).length || 0;
      const approved = activities?.filter(a => a.approved_status).length || 0;

      console.log("Activities stats:", { total, pending, approved });
      setStats({
        totalActivities: total,
        pendingActivities: pending,
        approvedActivities: approved,
      });
    } catch (error) {
      console.error("Unexpected error in fetchStats:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStats();

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
          console.log("Activities changed, refreshing counselor stats...");
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return stats;
}
