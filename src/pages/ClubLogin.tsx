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
        console.log("Starting coordinator registration process...");
        
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

        // Sign up new coordinator
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
          console.log("Coordinator account created, creating teacher record...");
          
          // Create the teacher record
          const { error: teacherError } = await supabase
            .from('teachers')
            .insert([
              {
                email,
                dept: department,
                first_name: firstName,
                last_name: lastName
              }
            ]);

          if (teacherError) throw teacherError;

          console.log("Registration successful!");
          
          toast({
            title: "Success!",
            description: "Your account has been created. Please check your email for verification.",
          });
        }
      } else {
        console.log("Attempting coordinator login...");
        
        // Sign in existing coordinator
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        console.log("Login successful!");
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
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
          <CardTitle>{isSignUp ? "Create Coordinator Account" : "Coordinator Login"}</CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Create a new coordinator account" 
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