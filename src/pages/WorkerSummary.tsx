import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Home } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CustomBadge from "@/components/CustomBadge";

interface Worker {
  id: string;
  name: string;
  dailyWage: number;
  type: "Worker" | "Craftsman";
  isPublished: boolean;
}

interface AttendanceRecord {
  id: string;
  date: string;
  dailyWage: number;
}

interface WorkerExpense {
  id: string;
  amount: number;
  date: string;
  description?: string;
}

export default function WorkerSummary() {
  const { workerId } = useParams();
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name");
  const type = searchParams.get("type");

  const [worker, setWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const workerdata = useQuery(api.worker.getWorker, { id: workerId })

  // Mock data - in real app, this would come from Supabase
  const mockWorkers: Worker[] = [
    { id: "1", name: "John Smith", dailyWage: 90, type: "Craftsman", isPublished: true },
    { id: "2", name: "Mike Johnson", dailyWage: 75, type: "Worker", isPublished: false },
    { id: "3", name: "David Wilson", dailyWage: 85, type: "Craftsman", isPublished: true },
  ];

  const mockAttendance: AttendanceRecord[] = [
    { id: "1", date: "2024-12-15", dailyWage: 90 },
    { id: "2", date: "2024-12-14", dailyWage: 90 },
    { id: "3", date: "2024-12-13", dailyWage: 90 },
    { id: "4", date: "2024-12-12", dailyWage: 90 },
    { id: "5", date: "2024-12-11", dailyWage: 90 },
  ];

  const mockExpenses: WorkerExpense[] = [
    { id: "1", amount: 200, date: "2024-12-10", description: "Advance payment" },
    { id: "2", amount: 50, date: "2024-12-05", description: "Bonus" },
  ];

  useEffect(() => {
    if (workerdata) {
      setWorker(workerdata.worker);
      setIsLoading(false);
    }
  }, [workerdata]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!worker && workerdata.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">العامل المطلوب غير متاح</h1>
            <p className="text-muted-foreground mb-4">
              {workerdata.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!worker.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              This worker's summary page is currently private and not accessible.
            </p>
            <Button asChild>
              <a href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalEarned = mockAttendance.reduce((sum, record) => sum + record.dailyWage, 0);
  const amountsReceived = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = totalEarned - amountsReceived;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold">{worker.name}</h1>
            <CustomBadge type={worker.type} />

          </div>
          <p className="text-sm text-muted-foreground">
            Daily wage: ${worker.dailyWage}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Days Attended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAttendance.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalEarned.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Amount Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${amountsReceived.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Balance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${remainingBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAttendance.map((record) => (
                <div key={record.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="font-semibold text-green-600">
                    +${record.dailyWage}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockExpenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {new Date(expense.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {expense.description && (
                      <p className="text-sm text-muted-foreground">{expense.description}</p>
                    )}
                  </div>
                  <span className="font-semibold text-blue-600">
                    -${expense.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
