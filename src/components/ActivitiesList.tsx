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
}

export function ActivitiesList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      console.log("Fetching activities...");
      const { data, error } = await supabase
        .from("activities")
        .select("*")
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
                    <Button
                      variant="link"
                      onClick={() => handleDownload(activity.document_url!)}
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </Button>
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