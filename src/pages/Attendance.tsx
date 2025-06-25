
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from "convex/react";
import { AttendanceRecord, DilayAttendance, WorkerType } from "@/types/SharedTypes";
import { Badge } from "@/components/ui/badge";
import { DayPicker } from "react-day-picker";
import { ar } from "date-fns/locale";
import CustomDayPicker from "@/components/CustomDayPicker";
import CardSkeleton from "@/components/CardSkeleton";
import SpinnerLoader from "@/components/SpinnerLoader";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useIsMobile } from "@/hooks/use-mobile";
export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [presentWorkers, setPresentWorkers] = useState<string[]>([]);
  const getAllWorkers = useQuery(api.worker.getWorkers);
  const getAllattendances = useQuery(api.attendance.getAttendanceRecords);
  const saveDailyAttendances = useMutation(api.attendance.saveAttendances);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [workers, setWorkers] = useState<WorkerType[]>([])
  const [dialynote, setDialynote] = useState<string>("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const isMobile = useIsMobile()

  // Mock workers data
  useEffect(() => {
    if (getAllWorkers) {
      setWorkers(getAllWorkers.workers);
    }
    if (getAllattendances) {
      setAttendanceRecords(getAllattendances.records);
    }
    if (getAllWorkers && getAllattendances) {
      console.log(getAllattendances.records)
      setLoading(false);
    }
  }, [getAllWorkers, getAllattendances])
  // Mock attendance records

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
    setIsAdding(true)
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
      .then((res: { ok: boolean; message: string; records: string[] }) => {
        if (res.ok) {
          const completedMessage = <p className="px">{res.message} <br />{format(selectedDate, "EEEE", { locale: ar })} -  {format(selectedDate, "dd/MM/yyyy")}</p>
          toast.success(completedMessage, {
            icon: "✅",
            duration: 9000,
            style: {
              width: "100%"
            }
          })
          resetForm()

        }
      }).catch((err) => {
        toast.error("حدث خطأ ما يرجى المحاولة مرة اخرى", { icon: "❌", duration: 5000 })
      }).finally(() => {
        setIsAdding(false)
      })
  };
  const resetForm = () => {
    setDialynote("")
    setPresentWorkers([])
    setSelectedDate(new Date())
  }



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
            <CardContent className="px-0">
              <div className={cn("space-y-3 px-4", !isMobile && "overflow-y-scroll h-fit max-h-60")}>
                {loading && !isAdding && <SpinnerLoader />}
                {isAdding && <>
                  <SpinnerLoader parentClassName="h-fit" />
                  <p className="text-sm text-center text-muted-foreground">جاري الحفظ...</p>
                </>}
                {!loading && !isAdding && !attendanceRecords.length && <p className="text-sm text-center  text-muted-foreground">لا يوجد سجلات حديثة</p>}
                {!loading && !isAdding && attendanceRecords?.map((record) => (
                  <div key={record._id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">
                        <span className="font-bold block">
                          {record.name}
                        </span>
                        <span className="text-muted-foreground">
                          {format(new Date(record.date), "dd/MM/yyyy")}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">

                      </p>
                    </div>
                    <span className="font-semibold">{record.dailyWage.toLocaleString('ar-SA')} ر.س</span>
                  </div>
                )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
