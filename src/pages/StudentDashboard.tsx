import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitiesList } from "@/components/ActivitiesList";

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Available Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivitiesList userRole="student" />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;