import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitiesList } from "@/components/ActivitiesList";
import { StudentSelection } from "@/components/StudentSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Award, Calendar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CounselorDashboard = () => {
  const [stats, setStats] = useState({
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
      
      // First get the teacher record using maybeSingle() instead of single()
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

      // Get assigned students
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

      // Get all activities (not just assigned students' activities)
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Counselor Dashboard</h1>

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

      <Tabs defaultValue="activities">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="students">Manage Students</TabsTrigger>
        </TabsList>
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activities to Approve</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivitiesList userRole="counselor" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Assign Students</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentSelection />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CounselorDashboard;