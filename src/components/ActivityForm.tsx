import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ActivityFormData {
  activity_name: string;
  date: string;
  points: number;
  deadline: string;
  document?: File;
}

export function ActivityForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ActivityFormData>();

  const onSubmit = async (data: ActivityFormData) => {
    try {
      setIsLoading(true);
      console.log("Starting activity submission:", data);

      let document_url = null;
      if (data.document) {
        console.log("Uploading document:", data.document.name);
        const fileExt = data.document.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('activity_documents')
          .upload(fileName, data.document);

        if (uploadError) {
          console.error("Document upload error:", uploadError);
          throw uploadError;
        }

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('activity_documents')
            .getPublicUrl(fileName);
          document_url = publicUrl;
          console.log("Document uploaded successfully:", document_url);
        }
      }

      console.log("Inserting activity with data:", {
        activity_name: data.activity_name,
        date: data.date,
        points: data.points,
        deadline: data.deadline,
        document_url
      });

      const { error: insertError } = await supabase
        .from("activities")
        .insert({
          activity_name: data.activity_name,
          date: data.date,
          points: data.points,
          deadline: data.deadline,
          document_url
        });

      if (insertError) {
        console.error("Activity insert error:", insertError);
        throw insertError;
      }

      console.log("Activity added successfully");
      toast({
        title: "Success",
        description: "Activity added successfully",
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error in activity submission:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="activity_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Name</FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points</FormLabel>
              <FormControl>
                <Input type="number" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Supporting Document (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Activity"}
        </Button>
      </form>
    </Form>
  );
}