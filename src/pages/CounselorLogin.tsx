
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CounselorLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dept, setDept] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting authentication process...");
    
    try {
      if (isSignUp) {
        console.log("Starting signup process...");
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'counselor'
            }
          }
        });

        if (signUpError) {
          toast({
            title: "Error",
            description: signUpError.message,
            variant: "destructive",
          });
          return;
        }

        if (signUpData.user) {
          console.log("User signed up, creating teacher record...");
          const { error: teacherError } = await supabase
            .from('teachers')
            .insert([
              {
                teacher_id: signUpData.user.id,
                dept,
                email,
                first_name: firstName,
                last_name: lastName,
              }
            ]);

          if (teacherError) {
            toast({
              title: "Error",
              description: "Failed to create counselor profile",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Success",
            description: "Account created successfully",
          });
          navigate("/counselor-dashboard");
        }
      } else {
        console.log("Attempting counselor login...");
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          toast({
            title: "Error",
            description: signInError.message,
            variant: "destructive",
          });
          return;
        }

        if (signInData.user) {
          console.log("Login successful, checking teacher record...");
          const { data: teacherData, error: teacherError } = await supabase
            .from('teachers')
            .select('*')
            .eq('email', email)
            .maybeSingle();

          if (teacherError) {
            toast({
              title: "Error",
              description: "Failed to fetch counselor profile",
              variant: "destructive",
            });
            return;
          }

          if (!teacherData) {
            toast({
              title: "Error",
              description: "No counselor account found. Please sign up first.",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Success",
            description: "Logged in successfully",
          });
          navigate("/counselor-dashboard");
        }
      }
    } catch (error) {
      console.error('Auth process error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{isSignUp ? "Create Counselor Account" : "Counselor Login"}</CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Create a new account to manage student activities" 
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

export default CounselorLogin;
