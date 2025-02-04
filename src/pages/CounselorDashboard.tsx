import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitiesList } from "@/components/ActivitiesList";
import { StudentSelection } from "@/components/StudentSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CounselorDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Counselor Dashboard</h1>
      <Tabs defaultValue="activities">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="students">Manage Students</TabsTrigger>
        </TabsList>
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activities to Approve</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivitiesList userRole="counselor" />
            </CardContent>
          </Card>
        </TabsContent>
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
      </Tabs>
    </div>
  );
};

export default CounselorDashboard;