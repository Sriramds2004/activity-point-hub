
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitiesList } from "@/components/ActivitiesList";
import { supabase } from "@/integrations/supabase/client";
import { Award, Calendar, CheckCircle, Trophy } from "lucide-react";

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalActivities: 0,
    pendingActivities: 0,
    approvedActivities: 0,
    totalPoints: 0,
  });

  const fetchStats = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Get student USN
      const { data: studentData } = await supabase
        .from('students')
        .select('usn')
        .eq('email', user.data.user?.email)
        .maybeSingle();

      if (!studentData) return;

      // Get activities stats
      const { data: activities } = await supabase
        .from("activities")
        .select("*")
        .or(`student_usn.eq.${studentData.usn},and(approved_status.eq.true,student_usn.is.null)`);

      // Get total points
      const { data: pointsData } = await supabase
        .from('student_activity_points')
        .select('total_points')
        .eq('student_usn', studentData.usn)
        .maybeSingle();

      const total = activities?.length || 0;
      const pending = activities?.filter(a => !a.approved_status).length || 0;
      const approved = activities?.filter(a => a.approved_status).length || 0;

      setStats({
        totalActivities: total,
        pendingActivities: pending,
        approvedActivities: approved,
        totalPoints: pointsData?.total_points || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
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

      <div className="grid gap-4 md:grid-cols-4">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
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
