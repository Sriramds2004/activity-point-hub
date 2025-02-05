import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitiesList } from "@/components/ActivitiesList";
import { supabase } from "@/integrations/supabase/client";
import { Award, Calendar, CheckCircle } from "lucide-react";

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalActivities: 0,
    pendingActivities: 0,
    approvedActivities: 0,
  });

  const fetchStats = async () => {
    try {
      console.log("Fetching student stats...");
      const user = await supabase.auth.getUser();
      const email = user.data.user?.email;

      // Get student USN from email
      const { data: studentData } = await supabase
        .from('students')
        .select('usn')
        .eq('email', email)
        .single();

      if (!studentData?.usn) {
        console.log("No student USN found for email:", email);
        return;
      }

      const { data: activities, error } = await supabase
        .from("activities")
        .select("*")
        .eq('student_usn', studentData.usn);

      if (error) throw error;

      const total = activities?.length || 0;
      const pending = activities?.filter(a => !a.approved_status).length || 0;
      const approved = activities?.filter(a => a.approved_status).length || 0;

      console.log("Student stats fetched:", { total, pending, approved });
      setStats({
        totalActivities: total,
        pendingActivities: pending,
        approvedActivities: approved,
      });
    } catch (error) {
      console.error("Error fetching student stats:", error);
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