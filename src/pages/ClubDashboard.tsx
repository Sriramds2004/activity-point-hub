import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClubDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Club Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Activities Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No activities created yet</p>
          {/* TODO: Add activities list and creation form */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDashboard;