
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitiesList } from "@/components/ActivitiesList";
import { StudentSelection } from "@/components/StudentSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/counselor/StatsCards";
import { useCounselorStats } from "@/hooks/useCounselorStats";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useStudentAssignment } from "@/hooks/useStudentAssignment";

const CounselorDashboard = () => {
  const stats = useCounselorStats();
  const { students, assignedStudents } = useStudentAssignment();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

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
            <CardContent className="space-y-6">
              <div className="w-full max-w-xs">
                <Select
                  value={selectedStudent || ""}
                  onValueChange={(value) => setSelectedStudent(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students
                      .filter(student => assignedStudents.includes(student.usn))
                      .map((student) => (
                        <SelectItem key={student.usn} value={student.usn}>
                          {student.first_name} {student.last_name} ({student.usn})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedStudent ? (
                <ActivitiesList 
                  userRole="counselor" 
                  studentUsn={selectedStudent}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  Select a student to view their activities
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CounselorDashboard;
