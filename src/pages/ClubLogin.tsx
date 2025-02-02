import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClubLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clubName, setClubName] = useState("");
  const [department, setDepartment] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const departments = [
    "Computer Science",
    "Information Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        console.log("Starting club registration process...");
        
        // Validate inputs
        if (!email.endsWith("@gmail.com")) {
          throw new Error("Please use a valid Gmail address");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        if (!department) {
          throw new Error("Please select a department");
        }

        if (!firstName || !lastName) {
          throw new Error("Please enter your full name");
        }

        // Sign up new club coordinator
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'club_coordinator',
              department: department
            }
          }
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          console.log("Club coordinator account created, creating teacher record...");
          
          // First create the teacher record
          const { data: teacherData, error: teacherError } = await supabase
            .from('teachers')
            .insert([
              {
                email,
                dept: department,
                first_name: firstName,
                last_name: lastName
              }
            ])
            .select()
            .single();

          if (teacherError) throw teacherError;

          console.log("Teacher record created, creating club record...");
          
          // Then create club record with the teacher's ID
          const { error: clubError } = await supabase
            .from('clubs')
            .insert([
              {
                faculty_coordinator_id: teacherData.teacher_id,
                no_of_activity: 0
              }
            ]);

          if (clubError) throw clubError;

          console.log("Club registration successful!");
          
          toast({
            title: "Success!",
            description: "Your club account has been created. Please check your email for verification.",
          });
        }
      } else {
        console.log("Attempting club coordinator login...");
        
        // Sign in existing club coordinator
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        console.log("Login successful!");
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in to your club account.",
        });
        
        navigate("/club-dashboard");
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
          <CardTitle>{isSignUp ? "Create Club Account" : "Club Login"}</CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Create a new account for your club" 
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
                  <Label htmlFor="clubName">Club Name</Label>
                  <Input
                    id="clubName"
                    type="text"
                    placeholder="Enter club name"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={department}
                    onValueChange={setDepartment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default ClubLogin;