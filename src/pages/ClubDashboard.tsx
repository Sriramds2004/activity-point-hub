import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityForm } from "@/components/ActivityForm";
import { ActivitiesList } from "@/components/ActivitiesList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const ClubDashboard = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Club Dashboard</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {showForm ? "Hide Form" : "Add Activity"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Activities Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivitiesList />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDashboard;