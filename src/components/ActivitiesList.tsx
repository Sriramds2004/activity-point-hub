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

  const fetchActivities = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: clubData } = await supabase
        .from("clubs")
        .select("club_id")
        .eq("faculty_coordinator_id", userData.user.id)
        .single();

      if (!clubData) return;

      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("club_id", clubData.club_id)
        .order("date", { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
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
          {activities.map((activity) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}