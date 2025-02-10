
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitiesList } from "@/components/ActivitiesList";
import { StudentSelection } from "@/components/StudentSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/counselor/StatsCards";
import { useCounselorStats } from "@/hooks/useCounselorStats";

const CounselorDashboard = () => {
  const stats = useCounselorStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Counselor Dashboard</h1>

      <StatsCards
        totalActivities={stats.totalActivities}
        pendingActivities={stats.pendingActivities}
        approvedActivities={stats.approvedActivities}
      />

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Manage Students</TabsTrigger>
          <TabsTrigger value="activities">Student Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Assign Students</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentSelection />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Student Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivitiesList userRole="counselor" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CounselorDashboard;
