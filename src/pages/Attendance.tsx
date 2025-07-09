import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from "convex/react";
import { DilayAttendance, WorkerType } from "@/types/SharedTypes";
import { ar } from "date-fns/locale";
import CustomDayPicker from "@/components/CustomDayPicker";
import SpinnerLoader from "@/components/SpinnerLoader";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import DayAttendanceRecord from "@/components/DayAttendanceRecord";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import SearchedDayRecord from "@/components/SearchedDayRecord";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [presentWorkers, setPresentWorkers] = useState<string[]>([]);
  const getAllWorkers = useQuery(api.worker.getWorkers);
  // const getAllattendances = useQuery(api.attendance.getAttendanceRecords);
  const saveDailyAttendances = useMutation(api.attendance.saveAttendances);
  const SearchAttendanceByDate = useMutation(api.attendance.getAttendanceByDate);

  const [loading, setLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [workers, setWorkers] = useState<WorkerType[]>([])
  const [dialynote, setDialynote] = useState<string>("")
  // const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isPopOverOpen, setIsPopOverOpen] = useState<boolean>(false)
  const isMobile = useIsMobile()
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [isSearchDone, setIsSearchDone] = useState<boolean>(false);
  const [searchedAttendance, setSearchedAttendance] = useState<DilayAttendance[]>([]);
  const [searchedDayName, setSearchedDayName] = useState<string>("");

  // Mock workers data
  useEffect(() => {
    if (getAllWorkers) {
      setWorkers(getAllWorkers.workers);
    }
    // if (getAllattendances) {
    //   setAttendanceRecords(getAllattendances.records);
    // }
    if (getAllWorkers) {
      setLoading(false);
    }
  }, [getAllWorkers])
  // Mock attendance records

  const toggleWorkerAttendance = (workerId: string, worker: WorkerType) => {

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


  const handelDateChange = (date: Date) => {
    if (date) {
      setSelectedDate(date);
      setIsPopOverOpen(false)
    }
  }

  const handleSearchDateChange = (date: Date | null) => {
    if (date) {
      setSearchDate(date);
      getAttendanceByDate(date)
    }
  };
  const getAttendanceByDate = (date: Date) => {
    setIsSearchLoading(true);

    const promise = SearchAttendanceByDate({ date: format(date, "yyyy-MM-dd") })
      .then((res) => {
        if (!res.ok) throw new Error("Backend returned error");
        setSearchedAttendance(res.records);
        setIsSearchDone(true);
        return res.records;
      });
    toast.promise(promise, {
      loading: "جاري التحميل...",
      success: "تم التحميل بنجاح",
      error: "حدث خطأ ما يرجى المحاولة مرة أخرى",
    });
    promise.finally(() => {
      setIsSearchLoading(false);
      setSearchedDayName(`${format(date, "EEEE", { locale: ar })} - ${format(date, "dd/MM/yyyy")}`);
    });
  }

  const SearchNextDay = () => {
    setSearchDialogOpen(false)
    setSearchDialogOpen(true)
    setIsSearchDone(false)
    setSearchedDayName("")
    setSearchedAttendance([])
    setSearchDate(null)
  }
  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center justify-between gap-2 w-full py-4">
          <h1 className="text-2xl lg:text-3xl font-bold">الحضور</h1>

          <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="text-xs">بحث عن يوم</Button>
            </DialogTrigger>
            <DialogContent className="w-md max-w-md mx-auto">
              <DialogHeader className="mt-6">

                {!searchedDayName && <DialogTitle className="text-start">بحث عن حضور يوم</DialogTitle>}
                {!searchedDayName && <DialogDescription className="text-start">اختر التاريخ لعرض الحضور</DialogDescription>}

                {searchedDayName && <DialogTitle className="text-start">{searchedDayName}</DialogTitle>}
                {searchedDayName && <DialogDescription className="text-start">العمال الحاضرون لهذا اليوم</DialogDescription>}

              </DialogHeader>
              <div className="flex flex-col gap-4 mt-4">
                {isSearchLoading && <SpinnerLoader />
                }
                {!isSearchLoading && !isSearchDone && <CustomDayPicker
                  OnSelectFn={handleSearchDateChange}
                  selectedDate={searchDate}
                />
                }


                {isSearchDone && !isSearchLoading && (
                  <div className="flex flex-col gap-2 overflow-y-scroll h-fit max-h-[calc(100vh-260px)]">
                    {searchedAttendance.length === 0 &&
                      <p className="text-center text-muted-foreground my-4">لا يوجد حضور لهذا اليوم</p>}
                    {searchedAttendance.map((attendance) => (
                      <SearchedDayRecord recorder={attendance} />
                    ))}
                    <p className="text-center text-muted-foreground my-4">{searchedAttendance.length} عمال</p>
                  </div>
                )
                }
              </div>
              <div className="flex  gap-2">
                {isSearchDone &&
                  <Button
                    onClick={SearchNextDay}
                    variant="outline" className=" w-full">بحث عن يوم اخر</Button>}
                <DialogClose
                  onClick={() => setIsSearchDone(false)}
                  asChild>
                  <Button variant="destructive" className="mغ-4 w-full">إغلاق</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Date Selection & Workers */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اختيار التاريخ</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
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
                    OnSelectFn={(date) => handelDateChange(date)}
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
            <CardContent className="space-y-4 h-fit max-h-[1500px] overflow-y-scroll">
              {loading && <SpinnerLoader />}
              {!loading && workers.map((worker) => (
                <DayAttendanceRecord
                  key={worker._id}
                  worker={worker}
                  presentWorkers={presentWorkers}
                  toggleWorkerAttendance={toggleWorkerAttendance}
                />
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
                disabled={presentWorkers.length === 0 || isAdding}
              >
                {isAdding ?
                  <>  <Loader className="animate-spin" /> جاري الحفظ
                  </>
                  : "حفظ الحضور"
                }
              </Button>
            </CardContent>
          </Card>


        </div>
      </div>
    </div >
  );
}
