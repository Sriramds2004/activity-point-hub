import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitiesList } from "@/components/ActivitiesList";
import { supabase } from "@/integrations/supabase/client";
import { Award, Calendar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalActivities: 0,
    pendingActivities: 0,
    approvedActivities: 0,
  });
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      console.log("Fetching student stats...");
      const user = await supabase.auth.getUser();
      const email = user.data.user?.email;

      if (!email) {
        console.error("No user email found");
        toast({
          title: "Error",
          description: "User email not found. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      // Get student USN from email using maybeSingle instead of single
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('usn')
        .eq('email', email)
        .maybeSingle();

      if (studentError) {
        console.error("Error fetching student data:", studentError);
        toast({
          title: "Error",
          description: "Failed to fetch student data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!studentData) {
        console.log("No student USN found for email:", email);
        toast({
          title: "Account Not Found",
          description: "No student account found. Please sign up first.",
          variant: "destructive",
        });
        return;
      }

      console.log("Student data found:", studentData);

      const { data: activities, error: activitiesError } = await supabase
        .from("activities")
        .select("*")
        .eq('student_usn', studentData.usn);

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

      console.log("Student stats:", { total, pending, approved });
      setStats({
        totalActivities: total,
        pendingActivities: pending,
        approvedActivities: approved,
      });
    } catch (error) {
      console.error("Error fetching student stats:", error);
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
          console.log("Activities changed, refreshing student stats...");
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingActivities}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Activities</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedActivities}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivitiesList userRole="student" />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;