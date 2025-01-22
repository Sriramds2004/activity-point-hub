import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Activity Points Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Points: 0</p>
          {/* TODO: Add activity points summary */}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;