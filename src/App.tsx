import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import StudentLogin from "./pages/StudentLogin";
import CounselorLogin from "./pages/CounselorLogin";
import ClubLogin from "./pages/ClubLogin";
import StudentDashboard from "./pages/StudentDashboard";
import CounselorDashboard from "./pages/CounselorDashboard";
import ClubDashboard from "./pages/ClubDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/counselor-login" element={<CounselorLogin />} />
              <Route path="/club-login" element={<ClubLogin />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
              <Route path="/club-dashboard" element={<ClubDashboard />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;