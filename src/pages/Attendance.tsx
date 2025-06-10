
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Calendar as CalendarLucide } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Worker {
  id: string;
  name: string;
  dailyWage: number;
  type: "عامل" | "حرفي";
}

interface AttendanceRecord {
  id: string;
  date: string;
  presentWorkers: string[];
  totalWages: number;
}

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [presentWorkers, setPresentWorkers] = useState<string[]>([]);
  
  // Mock workers data
  const workers: Worker[] = [
    { id: "1", name: "أحمد محمد", dailyWage: 300, type: "حرفي" },
    { id: "2", name: "محمد علي", dailyWage: 250, type: "عامل" },
    { id: "3", name: "خالد سعد", dailyWage: 280, type: "حرفي" },
    { id: "4", name: "عبدالله أحمد", dailyWage: 230, type: "عامل" },
    { id: "5", name: "سعد محمود", dailyWage: 270, type: "عامل" },
  ];

  // Mock attendance records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: "1",
      date: "2024-12-15",
      presentWorkers: ["1", "2", "3", "4", "5"],
      totalWages: 1330,
    },
    {
      id: "2",
      date: "2024-12-14",
      presentWorkers: ["1", "3", "4", "5"],
      totalWages: 1080,
    },
  ]);

  const toggleWorkerAttendance = (workerId: string) => {
    setPresentWorkers(prev => 
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const calculateTotalWages = () => {
    return presentWorkers.reduce((total, workerId) => {
      const worker = workers.find(w => w.id === workerId);
      return total + (worker?.dailyWage || 0);
    }, 0);
  };

  const saveAttendance = () => {
    if (presentWorkers.length === 0) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار عامل واحد على الأقل",
        variant: "destructive",
      });
      return;
    }

    const totalWages = calculateTotalWages();
    const dateString = format(selectedDate, "yyyy-MM-dd");
    
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date: dateString,
      presentWorkers: [...presentWorkers],
      totalWages,
    };

    // Remove existing record for the same date if any
    const filteredRecords = attendanceRecords.filter(r => r.date !== dateString);
    setAttendanceRecords([...filteredRecords, newRecord]);
    
    // Reset selection
    setPresentWorkers([]);
    
    toast({
      title: "نجح",
      description: `تم حفظ الحضور لتاريخ ${format(selectedDate, "dd/MM/yyyy")}. إجمالي الأجور: ${totalWages.toLocaleString('ar-SA')} ر.س`,
    });
  };

  // Get existing attendance for selected date
  const existingAttendance = attendanceRecords.find(r => r.date === format(selectedDate, "yyyy-MM-dd"));

  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">الحضور</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Date Selection & Workers */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اختيار التاريخ</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setPresentWorkers([]); // Reset selection when date changes
                      }
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                تسجيل حضور العمال - {format(selectedDate, "dd/MM/yyyy")}
              </CardTitle>
              {existingAttendance && (
                <p className="text-sm text-muted-foreground">
                  يوجد سجل موجود. قم بتحديث الحضور أدناه.
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {workers.map((worker) => (
                <div key={worker.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox
                      id={worker.id}
                      checked={presentWorkers.includes(worker.id)}
                      onCheckedChange={() => toggleWorkerAttendance(worker.id)}
                    />
                    <div>
                      <label htmlFor={worker.id} className="font-medium cursor-pointer">
                        {worker.name}
                      </label>
                      <p className="text-sm text-muted-foreground">{worker.type}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{worker.dailyWage.toLocaleString('ar-SA')} ر.س</p>
                    <p className="text-xs text-muted-foreground">أجر يومي</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Summary & Save */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ملخص اليوم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">العمال الحاضرون</p>
                <p className="text-2xl font-bold">{presentWorkers.length}</p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">إجمالي الأجور</p>
                <p className="text-2xl font-bold text-green-600">
                  {calculateTotalWages().toLocaleString('ar-SA')} ر.س
                </p>
              </div>
              
              <Button 
                onClick={saveAttendance}
                className="w-full"
                disabled={presentWorkers.length === 0}
              >
                حفظ الحضور
              </Button>
            </CardContent>
          </Card>

          {/* Recent Records */}
          <Card>
            <CardHeader>
              <CardTitle>سجلات حديثة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceRecords
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((record) => (
                    <div key={record.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">
                          {format(new Date(record.date), "dd/MM")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.presentWorkers.length} عامل
                        </p>
                      </div>
                      <span className="font-semibold">{record.totalWages.toLocaleString('ar-SA')} ر.س</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
