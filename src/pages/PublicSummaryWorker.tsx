import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Home } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AttendanceRecord, WorkerExpense, WorkerType } from '@/types/SharedTypes';
import { cn } from '@/lib/utils';
import AttendanceTable from '@/components/AttendanceTable';
import ExpensesTable from '@/components/expense/ExpensesTable';
import { workerData } from 'worker_threads';
import CustomBadge from '@/components/CustomBadge';
import ThemeToggler from '@/components/ThemeToggler';
import WorkerNote from '@/components/worker/WorkerNote';


const PublicSummaryWorker = () => {
  const { id } = useParams();

  const [worker, setWorker] = useState<WorkerType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const workerdata = useQuery(api.worker.getPublicWorkerDate, { id: id });
  const [workerDataState, setWorkerDataState] = useState(workerdata);
  const [workerAttendance, setWorkerAttendance] = useState<AttendanceRecord[]>([]);
  const [workerExpenses, setWorkerExpenses] = useState<WorkerExpense[]>([]);

  useEffect(() => {
    if (workerdata) {
      setWorkerDataState(workerdata);

      setWorker(workerdata.data.worker);
      setWorkerAttendance(workerdata.data.attendance);
      setWorkerExpenses(workerdata.data.expenses);

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

  if (!worker && !workerDataState.isPublished) {
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

  if (workerDataState.ok && !workerDataState.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">العامل المطلوب غير متاح</h1>
            <p className="text-muted-foreground mb-4">
              {workerDataState.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate summary values
  const totalEarned = workerAttendance.reduce((sum, record) => sum + record.dailyWage, 0);
  const amountsReceived = workerExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = totalEarned - amountsReceived;

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-card border-b border-border p-2 ">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <User className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-2xl font-bold">{worker?.name}</h1>
              <CustomBadge type={worker.type} />
            </div>
            <p className="text-md text-muted-foreground my-4">
              الاجر اليومي:
              <span className='font-bold mx-4'>
                {worker.dailyWage.toLocaleString('ar-SA')} ر.س/يوم
              </span>
            </p>
          </div>
          <ThemeToggler />
        </div>
      </div>
      {worker.note && (
        <WorkerNote note={worker.note} />
      )}
      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">عدد ايام الحضور</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workerAttendance.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">اجمالي الحساب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalEarned.toLocaleString('ar-SA')} ر.س
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">اجمالي الدفعات المستلمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {amountsReceived.toLocaleString('ar-SA')} ر.س

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">الرصيد المتبقي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${remainingBalance >= 0 ? 'text' : 'text-red-600'}`}>
                {remainingBalance.toLocaleString('ar-SA')} ر.س
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              ايام الحضور
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!totalEarned
              ? <p className="text-muted-foreground text-center text-xl">لا يوجد ايام عمل حتي الأن</p>
              : <AttendanceTable
                worker={worker}
                workerAttendance={workerAttendance}
                totalEarned={totalEarned}
              />}

          </CardContent>
        </Card>

        {/* Expenses History */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            {!amountsReceived ?
              <p className="text-muted-foreground text-center text-xl">لا يوجد مصروفات حتي الأن</p> :
              <ExpensesTable
                workerExpenses={workerExpenses}
                totalEarned={totalEarned}
                amountsReceived={amountsReceived}
              />
            }
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default PublicSummaryWorker;