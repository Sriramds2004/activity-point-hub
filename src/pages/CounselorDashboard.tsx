import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CounselorDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Counselor Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Students Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No students assigned yet</p>
          {/* TODO: Add students list and verification requests */}
        </CardContent>
      </Card>
    </div>
  );
};

export default CounselorDashboard;