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
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Activity {
  activity_id: string;
  activity_name: string;
  date: string;
  points: number;
  deadline: string;
  document_url: string | null;
  approved_status: boolean;
  student_usn: string | null;
}

interface ActivitiesListProps {
  userRole: "student" | "counselor";
}

export function ActivitiesList({ userRole }: ActivitiesListProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      console.log("Fetching activities...");
      let query = supabase.from("activities").select("*");
      
      if (userRole === "counselor") {
        const user = await supabase.auth.getUser();
        const teacherId = user.data.user?.id;
        
        // Only fetch activities from assigned students
        query = query.in(
          'student_usn',
          supabase
            .from('student_counseling')
            .select('student_usn')
            .eq('teacher_id', teacherId)
        );
      }
      
      const { data, error } = await query.order("date", { ascending: false });

      if (error) {
        console.error("Activities fetch error:", error);
        throw error;
      }

      console.log("Activities fetched:", data);
      setActivities(data || []);
      setError(null);
    } catch (error) {
      console.error("Error in fetchActivities:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
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

  const handleDownload = async (url: string) => {
    try {
      window.open(url, '_blank');
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (activityId: string) => {
    try {
      const user = await supabase.auth.getUser();
      const { error } = await supabase
        .from("activities")
        .update({ 
          approved_status: true,
          approved_by_teacher_id: user.data.user?.id
        })
        .eq("activity_id", activityId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Activity approved successfully",
      });

      fetchActivities();
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        title: "Error",
        description: "Failed to approve activity",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading activities...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Document</TableHead>
            {userRole === "counselor" && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={userRole === "counselor" ? 7 : 6} className="text-center">
                No activities found
              </TableCell>
            </TableRow>
          ) : (
            activities.map((activity) => (
              <TableRow key={activity.activity_id}>
                <TableCell>{activity.activity_name}</TableCell>
                <TableCell>{format(new Date(activity.date), "PPP")}</TableCell>
                <TableCell>{activity.points}</TableCell>
                <TableCell>{format(new Date(activity.deadline), "PPP")}</TableCell>
                <TableCell>
                  {activity.approved_status ? "Approved" : "Pending"}
                </TableCell>
                <TableCell>
                  {activity.document_url && (
                    <Button
                      variant="link"
                      onClick={() => handleDownload(activity.document_url!)}
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </Button>
                  )}
                </TableCell>
                {userRole === "counselor" && (
                  <TableCell>
                    {!activity.approved_status && (
                      <Button
                        variant="outline"
                        onClick={() => handleApprove(activity.activity_id)}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}