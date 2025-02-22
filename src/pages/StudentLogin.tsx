
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

const StudentLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleMode = () => setIsSignUp(!isSignUp);

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
          {isSignUp ? (
            <SignupForm onToggleMode={toggleMode} />
          ) : (
            <LoginForm onToggleMode={toggleMode} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLogin;
