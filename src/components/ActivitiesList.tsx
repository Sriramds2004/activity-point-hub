
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useActivities } from "@/hooks/useActivities";
import { ActivitiesTableHeader } from "@/components/activities/ActivitiesTableHeader";
import { ActivityRow } from "@/components/activities/ActivityRow";

interface ActivitiesListProps {
  userRole: "student" | "counselor" | "club";
}

export function ActivitiesList({ userRole }: ActivitiesListProps) {
  const { activities, loading, fetchActivities } = useActivities(userRole);
  const { toast } = useToast();

  const handleDownload = async (url: string) => {
    try {
      window.open(url, '_blank');
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "Failed to download file",
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
          students_can_download: true,
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

  return (
    <div className="rounded-md border">
      <Table>
        <ActivitiesTableHeader 
          showActions={userRole === "counselor"} 
          userRole={userRole}
        />
        <TableBody>
          {activities.length === 0 ? (
            <tr>
              <td colSpan={userRole === "counselor" ? 7 : 6} className="text-center py-4">
                No activities found
              </td>
            </tr>
          ) : (
            activities.map((activity) => (
              <ActivityRow
                key={activity.activity_id}
                activity={activity}
                userRole={userRole}
                onDownload={handleDownload}
                onApprove={handleApprove}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
