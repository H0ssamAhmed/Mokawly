import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import ProtectedRoute from "@/components/protected-route";
import Layout from "@/components/layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Workers from "./pages/Workers";
import Companies from "./pages/Companies";
import Attendance from "./pages/Attendance";
import Expenses from "./pages/Expenses";
import Payments from "./pages/Payments";
import WorkerSummary from "./pages/WorkerSummary";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const App = () => (

  <ThemeProvider defaultTheme="light" storageKey="painting-app-theme">
    <AuthProvider>
      <TooltipProvider>

        <Sonner position="top-center" duration={5000} />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/worker-summary/:workerId" element={<WorkerSummary />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/workers" element={
              <ProtectedRoute>
                <Layout>
                  <Workers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/companies" element={
              <ProtectedRoute>
                <Layout>
                  <Companies />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute>
                <Layout>
                  <Attendance />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute>
                <Layout>
                  <Expenses />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute>
                <Layout>
                  <Payments />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
