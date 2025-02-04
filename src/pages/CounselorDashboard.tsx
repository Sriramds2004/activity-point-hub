import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitiesList } from "@/components/ActivitiesList";

const CounselorDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Counselor Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Activities to Approve</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivitiesList userRole="counselor" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CounselorDashboard;