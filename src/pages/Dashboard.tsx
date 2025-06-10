
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download, TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 11, 1),
    to: new Date(2024, 11, 31),
  });

  // Mock data - in a real app, this would come from your backend
  const stats = {
    totalJobExpenses: 1250.75,
    totalWorkerExpenses: 2400.00,
    totalWages: 4200.00,
    totalPayments: 8500.00,
  };

  const balance = stats.totalPayments - (stats.totalJobExpenses + stats.totalWorkerExpenses + stats.totalWages);
  const isPositive = balance >= 0;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">لوحة التحكم</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-auto justify-start text-right font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd MMM")} -{" "}
                      {format(dateRange.to, "dd MMM yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd MMM yyyy")
                  )
                ) : (
                  "اختر التاريخ"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مصروفات العمل</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.totalJobExpenses.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مصروفات العمال</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.totalWorkerExpenses.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأجور</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.totalWages.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدفوعات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalPayments.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-center">الرصيد الإجمالي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-4xl font-bold text-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{balance.toLocaleString('ar-SA')} ر.س
          </div>
          <p className="text-center text-muted-foreground mt-2">
            المدفوعات - (مصروفات العمل + مصروفات العمال + الأجور)
          </p>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">دفعة من شركة البناء الحديث</p>
                <p className="text-sm text-muted-foreground">١٥ ديسمبر ٢٠٢٤</p>
              </div>
              <span className="font-bold text-green-600">+٥٠٠٠ ر.س</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">مصروف وقود</p>
                <p className="text-sm text-muted-foreground">١٤ ديسمبر ٢٠٢٤</p>
              </div>
              <span className="font-bold text-red-600">-٨٥ ر.س</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">أجور يوم العمل</p>
                <p className="text-sm text-muted-foreground">١٤ ديسمبر ٢٠٢٤</p>
              </div>
              <span className="font-bold text-red-600">-٤٢٠ ر.س</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
