
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ActivitiesTableHeaderProps {
  showActions: boolean;
  userRole: "student" | "counselor" | "club";
}

export function ActivitiesTableHeader({ showActions, userRole }: ActivitiesTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Activity Name</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Points</TableHead>
        <TableHead>Deadline</TableHead>
        {userRole === "student" && <TableHead>Status</TableHead>}
        <TableHead>Document</TableHead>
        {userRole === "counselor" && showActions && <TableHead>Actions</TableHead>}
      </TableRow>
    </TableHeader>
  );
}
