
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import SummaryWorker from "./pages/SummaryWorker";
import PublicSummaryWorker from "./pages/PublicSummaryWorker";

const App = () => (

  <AuthProvider>
    <TooltipProvider skipDelayDuration={0}>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
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
          <Route path="/summary-worker/:id" element={
            <ProtectedRoute>
              <Layout>
                <SummaryWorker />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/Public-summary-worker/:id" element={<PublicSummaryWorker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        removeDelay: 1000,
      }}
    />
  </AuthProvider>
);

export default App;
