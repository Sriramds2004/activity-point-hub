
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const StudentLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [usn, setUsn] = useState("");
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        // First check if email exists in auth
        const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
        const emailExists = users?.some(user => user.email === email);

        if (emailExists) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please login instead.",
            variant: "destructive",
          });
          setIsSignUp(false);
          return;
        }

        // Then check if student record exists
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
          setIsSignUp(false);
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
                dob: new Date().toISOString(), // You might want to add a date picker for this
              }
            ]);

          if (studentError) throw studentError;

          toast({
            title: "Success!",
            description: "Your student account has been created. Please check your email for verification.",
          });
        }
      } else {
        // Sign in existing student
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          if (signInError.message === "Invalid login credentials") {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
            return;
          }
          throw signInError;
        }

        toast({
          title: "Welcome back!",
          description: "Successfully logged in to your student account.",
        });
        
        navigate("/student-dashboard");
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
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{isSignUp ? "Create Student Account" : "Student Login"}</CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Create a new account to track your activities" 
              : "Enter your credentials to access your dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usn">USN</Label>
                  <Input
                    id="usn"
                    type="text"
                    placeholder="Enter your USN"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dept">Department</Label>
                  <Input
                    id="dept"
                    type="text"
                    placeholder="Enter your department"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="Enter your year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    min="1"
                    max="4"
                  />
                </div>
              </>
            )}
            <Button type="submit" className="w-full">
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLogin;
