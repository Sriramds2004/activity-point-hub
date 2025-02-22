
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from '@supabase/supabase-js';

interface SignupFormProps {
  onToggleMode: () => void;
}

export const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const { toast } = useToast();
  
  const validateEmail = (email: string) => {
    if (!email.endsWith('@rvce.edu.in')) {
      throw new Error('Email must be a valid RVCE email address (@rvce.edu.in)');
    }
  };

  const validateUSN = (usn: string) => {
    if (!usn.toLowerCase().startsWith('1rv22')) {
      throw new Error('USN must start with "1RV22"');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const usn = formData.get('usn') as string;
    const dept = formData.get('dept') as string;
    const year = formData.get('year') as string;

    try {
      // Validate email and USN format
      validateEmail(email);
      validateUSN(usn);

      // Check if email exists in students table first
      const { data: existingStudent } = await supabase
        .from('students')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (existingStudent) {
        toast({
          title: "Account Exists",
          description: "A student with this email already exists. Please login instead.",
          variant: "destructive",
        });
        onToggleMode();
        return;
      }

      // Sign up new student
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'student'
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create student record
        const { error: studentError } = await supabase
          .from('students')
          .insert([
            {
              usn,
              year: parseInt(year),
              dept,
              first_name: firstName,
              last_name: lastName,
              email,
              dob: new Date().toISOString(),
            }
          ]);

        if (studentError) throw studentError;

        toast({
          title: "Success!",
          description: "Your student account has been created. Please check your email for verification.",
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email (@rvce.edu.in)</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your RVCE email"
          pattern=".*@rvce\.edu\.in$"
          title="Must be a valid RVCE email address"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Enter your first name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Enter your last name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="usn">USN (starts with 1RV22)</Label>
        <Input
          id="usn"
          name="usn"
          type="text"
          placeholder="Enter your USN"
          pattern="1RV22.*"
          title="USN must start with 1RV22"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dept">Department</Label>
        <Input
          id="dept"
          name="dept"
          type="text"
          placeholder="Enter your department"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          name="year"
          type="number"
          placeholder="Enter your year"
          required
          min="1"
          max="4"
        />
      </div>
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onToggleMode}
      >
        Already have an account? Login
      </Button>
    </form>
  );
};
