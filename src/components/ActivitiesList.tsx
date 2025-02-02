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

interface Activity {
  activity_id: string;
  activity_name: string;
  date: string;
  points: number;
  deadline: string;
  document_url: string | null;
  approved_status: boolean;
}

export function ActivitiesList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      console.log("Fetching activities...");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Auth error:", userError);
        throw userError;
      }

      if (!userData.user) {
        console.error("No user found");
        throw new Error("Not authenticated");
      }

      console.log("Fetching club data for user:", userData.user.id);
      const { data: clubData, error: clubError } = await supabase
        .from("clubs")
        .select("club_id")
        .eq("faculty_coordinator_id", userData.user.id)
        .maybeSingle();

      if (clubError) {
        console.error("Club fetch error:", clubError);
        throw clubError;
      }

      if (!clubData) {
        console.log("No club found for this coordinator");
        setError("No club found. Please set up your club first.");
        setActivities([]);
        return;
      }

      console.log("Club found:", clubData);
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("club_id", clubData.club_id)
        .order("date", { ascending: false });

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

    // Set up real-time subscription
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
  }, []);

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
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
                    <a
                      href={activity.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}