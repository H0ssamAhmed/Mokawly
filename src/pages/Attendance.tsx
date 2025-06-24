
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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

import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from "convex/react";
import { DilayAttendance, WorkerType } from "@/types/SharedTypes";
import { Badge } from "@/components/ui/badge";
import { DayPicker } from "react-day-picker";
import { ar } from "date-fns/locale";
import CustomDayPicker from "@/components/CustomDayPicker";
import CardSkeleton from "@/components/CardSkeleton";
import SpinnerLoader from "@/components/SpinnerLoader";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [presentWorkers, setPresentWorkers] = useState<string[]>([]);
  const getAllWorkers = useQuery(api.worker.getWorkers);
  const saveDailyAttendances = useMutation(api.attendance.saveAttendances);
  const [loading, setLoading] = useState<boolean>(true);
  const [workers, setWorkers] = useState<WorkerType[]>([])
  const [dialynote, setDialynote] = useState<string>("")

  // Mock workers data
  useEffect(() => {
    if (getAllWorkers) {
      setWorkers(getAllWorkers.workers);
      setLoading(false);
    }
  }, [getAllWorkers])
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

  const toggleWorkerAttendance = (workerId: string, worker: WorkerType) => {
    //  setAttendanceWorkersInfo(prev => prev.includes(worker) ? prev.filter(w => w._id !== worker._id) : [...prev, worker])

    setPresentWorkers(prev =>
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );


  };

  const calculateTotalWages = () => {
    return presentWorkers.reduce((total, workerId) => {
      const worker = workers.find(w => w._id === workerId);
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



    const attendancedata: DilayAttendance[] = []
    workers.filter((worker) => {
      if (presentWorkers.includes(worker._id)) {
        attendancedata.push({
          workerId: worker._id,
          name: worker.name,
          dailyWage: worker.dailyWage,
          date: dateString,
          note: dialynote
        })
      }
    })
    saveDailyAttendances({ records: attendancedata })
      .then((res) => {
        console.log(res);
      }).catch((err) => {
        console.error(err);
      })


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
            <CardContent className="flex flex-col gap-4">
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

                  <CustomDayPicker
                    OnSelectFn={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setPresentWorkers([]); // Reset selection when date changes
                      }
                    }}
                    selectedDate={selectedDate}
                  />
                </PopoverContent>
              </Popover>
              <div>
                <Label htmlFor="note" className="text-xl block py-4" >ملاحظات لليوم </Label>
                <Textarea
                  onChange={(e) => setDialynote(e.target.value)}
                  value={dialynote} id="note" placeholder="ملاحظات عن الحضور مثال: حساب نصف يوم للكل" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                تسجيل حضور العمال - {format(selectedDate, "EEEE", { locale: ar })}-  {format(selectedDate, "dd/MM/yyyy")}
              </CardTitle>
              {existingAttendance && (
                <p className="text-sm text-muted-foreground">
                  يوجد سجل موجود. قم بتحديث الحضور أدناه.
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && <SpinnerLoader />}
              {!loading && workers.map((worker) => (
                <div key={worker._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox
                      id={worker._id}
                      checked={presentWorkers.includes(worker._id)}
                      onCheckedChange={() => toggleWorkerAttendance(worker._id, worker)}
                    />
                    <div>
                      <label htmlFor={worker._id} className="font-medium cursor-pointer">
                        {worker.name}
                      </label>
                      <Badge
                        variant={worker.type === "صنايعي" ? "default" : "secondary"}
                        className={cn("text-white mx-4", worker.type === "صنايعي" ? "bg-orange-700" : "bg-green-700")}
                      >
                        {worker.type}
                      </Badge>
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
