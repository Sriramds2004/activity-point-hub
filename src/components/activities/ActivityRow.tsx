
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Activity } from "@/hooks/useActivities";

interface ActivityRowProps {
  activity: Activity;
  userRole: "student" | "counselor" | "club";
  onDownload: (url: string) => void;
  onApprove: (activityId: string) => void;
}

export function ActivityRow({ activity, userRole, onDownload, onApprove }: ActivityRowProps) {
  return (
    <TableRow key={activity.activity_id}>
      <TableCell>{activity.activity_name}</TableCell>
      <TableCell>{format(new Date(activity.date), "PPP")}</TableCell>
      <TableCell>{activity.points}</TableCell>
      <TableCell>{activity.deadline ? format(new Date(activity.deadline), "PPP") : "-"}</TableCell>
      <TableCell>
        {activity.approved_status ? "Approved" : "Pending"}
      </TableCell>
      <TableCell>
        {activity.document_url && (activity.students_can_download || userRole !== "student") && (
          <Button
            variant="link"
            onClick={() => onDownload(activity.document_url!)}
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
              onClick={() => onApprove(activity.activity_id)}
            >
              Approve
            </Button>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}
