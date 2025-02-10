
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
  const canDownload = userRole === "counselor" || (userRole === "student" && activity.students_can_download);

  return (
    <TableRow key={activity.activity_id}>
      <TableCell>{activity.activity_name}</TableCell>
      <TableCell>{format(new Date(activity.date), "PPP")}</TableCell>
      <TableCell>{activity.points}</TableCell>
      <TableCell>{activity.deadline ? format(new Date(activity.deadline), "PPP") : "-"}</TableCell>
      {userRole === "student" && (
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-sm ${
            activity.approved_status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}>
            {activity.approved_status ? "Approved" : "Pending"}
          </span>
        </TableCell>
      )}
      <TableCell>
        {activity.document_url && canDownload && (
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
              className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
            >
              Approve
            </Button>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}
