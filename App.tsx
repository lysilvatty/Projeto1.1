import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ExplorePage from "@/pages/explore-page";
import VideoDetailPage from "@/pages/video-detail-page";
import ProfessionalPage from "@/pages/professional-page";
import StudentDashboard from "@/pages/dashboard/student-dashboard";
import ProfessionalDashboard from "@/pages/dashboard/professional-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/explore" component={ExplorePage} />
      <Route path="/video/:id" component={VideoDetailPage} />
      <Route path="/professional/:id" component={ProfessionalPage} />
      <ProtectedRoute path="/dashboard/student" component={StudentDashboard} />
      <ProtectedRoute path="/dashboard/professional" component={ProfessionalDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
