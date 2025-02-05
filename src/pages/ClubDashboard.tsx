import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityForm } from "@/components/ActivityForm";
import { ActivitiesList } from "@/components/ActivitiesList";
import { Button } from "@/components/ui/button";
import { PlusCircle, Award, Calendar, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ClubDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    totalActivities: 0,
    pendingActivities: 0,
    approvedActivities: 0,
  });

  const fetchStats = async () => {
    try {
      console.log("Fetching activity stats...");
      const { data: activities, error } = await supabase
        .from("activities")
        .select("*");

      if (error) throw error;

      const total = activities?.length || 0;
      const pending = activities?.filter(a => !a.approved_status).length || 0;
      const approved = activities?.filter(a => a.approved_status).length || 0;

      console.log("Stats fetched:", { total, pending, approved });
      setStats({
        totalActivities: total,
        pendingActivities: pending,
        approvedActivities: approved,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to changes
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
          console.log("Activities changed, refreshing stats...");
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Club Dashboard</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {showForm ? "Hide Form" : "Add Activity"}
        </Button>
      </div>

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

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityForm onSuccess={() => {
              setShowForm(false);
              fetchStats();
            }} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Activities Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivitiesList userRole="counselor" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDashboard;