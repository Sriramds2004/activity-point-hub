
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ActivitiesTableHeaderProps {
  showActions: boolean;
}

export function ActivitiesTableHeader({ showActions }: ActivitiesTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Activity Name</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Points</TableHead>
        <TableHead>Deadline</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Document</TableHead>
        {showActions && <TableHead>Actions</TableHead>}
      </TableRow>
    </TableHeader>
  );
}
