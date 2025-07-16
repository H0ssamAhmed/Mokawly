import { cn } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmptyData from "@/components/EmptyData";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "convex/react";
import SpinnerLoader from "@/components/SpinnerLoader";
import JobExpensesCard from "@/components/expense/JobExpensesCard.js";
import CustomDayPicker from "@/components/CustomDayPicker";
import { JobExpense, WorkerExpense } from "@/types/SharedTypes";
import WorkerExpensesCard from "@/components/expense/WorkerExpensesCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowDown, CalendarIcon, Loader2, MousePointerClick, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useJobExpenses, useWorkerExpenses } from "../api/expenseApi.js";
import { useQueryClient } from "@tanstack/react-query";


const expenseTypes = [
  "المواصلات",
  "الطعام",
  "المواد",
  "الأدوات",
  "المعدات",
  "حسابات سابقة للناس",
  "أخرى",
];
const paidBy = [
  "عصام عطيه",
  "حسام احمد",
  "السيد عاطف",
];
export default function Expenses() {
  const queryClient = useQueryClient();
  const { isLoading: isLoadingWorkerExpenses, data: getAllWorkerExpenses } = useWorkerExpenses()
  const { isLoading: isLoadingJobExpenses, data: getAllJobExpenses } = useJobExpenses()
  const addNewWorkerExpense = useMutation(api.expenses.AddworkerExpense);
  const addNewJobExpense = useMutation(api.expenses.addJobExpense);
  const existWorkers = useQuery(api.worker.getWorkers);
  const [jobExpenses, setJobExpenses] = useState<JobExpense[]>(getAllJobExpenses?.expenses || []);
  const [workerExpenses, setWorkerExpenses] = useState<WorkerExpense[]>(getAllWorkerExpenses?.expenses || []);
  const [totalWorkerExpenses, setTotalWorkerExpenses] = useState<number>(0)
  const [totalJobExpenses, setTotalJobExpenses] = useState<number>(0)
  const [loadingAddExpenses, setLoadingAddExpenses] = useState<boolean>(false);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>(searchParams.get("tab") || "job");
  const [workers, setWorkers] = useState([]);
  const [jobFormData, setJobFormData] = useState({ type: "", description: "", paidBy: "", amount: "", date: new Date(), });
  const [workerFormData, setWorkerFormData] = useState({ workerId: "", workerName: "", amount: "", paidBy: "", description: "", date: new Date() });


  useEffect(() => {
    if (existWorkers) {
      setWorkers(existWorkers.workers);
    }
    if (getAllJobExpenses) {
      setJobExpenses(getAllJobExpenses.expenses);
      const total = getAllJobExpenses.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalJobExpenses(total)
    }
    if (getAllWorkerExpenses) {
      setWorkerExpenses(getAllWorkerExpenses.expenses);
      const total = getAllWorkerExpenses.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalWorkerExpenses(total)
    }

  }, [existWorkers, getAllJobExpenses, getAllWorkerExpenses])
  const resetJobForm = () => {
    setJobFormData({
      type: "",
      description: "",
      amount: "",
      paidBy: "",
      date: new Date(),
    });
  };

  const resetWorkerForm = () => {
    setWorkerFormData({
      workerId: "",
      workerName: "",
      amount: "",
      paidBy: "",
      description: "",
      date: new Date(),
    });
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobFormData.type) {
      toast.error("يرجى اختيار نوع المصروف");
      return;
    }


    if (!jobFormData.paidBy) {
      toast.error("يرجى ادخال من دفع المبلغ");
      return;
    }

    const newExpense: JobExpense = {
      type: jobFormData.type,
      description: jobFormData.description,
      paidBy: jobFormData.paidBy,
      amount: parseFloat(jobFormData.amount),
      date: format(jobFormData.date, "yyyy-MM-dd"),
    };
    setLoadingAddExpenses(true);
    addNewJobExpense(newExpense)
      .then((res) => {
        toast.success(<h1>تم اضافة حساب   <b>{" " + jobFormData.type + " "} </b>  بنجاح</h1>, {
          icon: "✅",
          duration: 3000,
        });
        queryClient.invalidateQueries({ queryKey: ['jobExpenses'] });
      }).catch((error) => {
        toast.error(<h1>حدث خطأ, {error.message}</h1>, {
          icon: "❌",
          duration: 3000,
        });
      }).finally(() => {
        setIsJobDialogOpen(false);
        resetWorkerForm();
        setLoadingAddExpenses(false);
      });
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerFormData.workerId) {
      toast.error("يرجى اختيار  العامل");
      return;
    }

    if (!workerFormData.paidBy) {
      toast.error("يرجى ادخال من دفع المبلغ");
      return;
    }
    const newExpense: WorkerExpense = {
      workerId: workerFormData.workerId,
      workerName: workerFormData.workerName,
      paidBy: workerFormData.paidBy,
      amount: parseFloat(workerFormData.amount),
      date: format(workerFormData.date, "yyyy-MM-dd"),
      description: workerFormData.description || undefined,
    };
    setLoadingAddExpenses(true);
    addNewWorkerExpense(newExpense)
      .then((res) => {
        ;
        toast.success(<h1>تم اضافة المصروف  بإسم  <b>{" " + workerFormData.workerName + " "} </b>  بنجاح</h1>, {
          icon: "✅",
          duration: 3000,
        })
        queryClient.invalidateQueries({ queryKey: ['workerExpenses'] });


      }).catch((error) => {
        toast.error(<h1>حدث خطأ, {error.message}</h1>, {
          icon: "❌",
          duration: 3000,
        });
      }).finally(() => {
        setIsWorkerDialogOpen(false);
        resetWorkerForm();
        setLoadingAddExpenses(false);
      });
  };

  const handelChangeTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ "tab": tab });
  }
  const handleFilterByType = (type: string) => {
    if (type == "all") {
      setJobExpenses(getAllJobExpenses.expenses);
      return
    }
    const filteredExpenses = getAllJobExpenses.expenses.filter((expense) => expense.type === type);
    setJobExpenses(filteredExpenses);

  }

  const handleChangeWorkerDateExpense = (date: Date) => {
    if (date) {
      setWorkerFormData({ ...workerFormData, date })
      setIsDateDialogOpen(false)
    }
  }
  const handleChangeJobDateExpense = (date: Date) => {
    if (date) {
      setJobFormData({ ...jobFormData, date })
      setIsDateDialogOpen(false)

    }
  }
  return (
    <div className="container p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">المصروفات</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          onClick={() => handelChangeTab('worker')}
          className={cn("relative cursor-pointer",
            activeTab == "worker" && "bg-primary"
          )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي مصروفات العمال</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingWorkerExpenses
              ?
              <Skeleton className="w-1/3 mt-4 h-8 bg-muted-foreground" />
              :
              <div className="text-2xl mt-4 font-bold text-red-600">
                {totalWorkerExpenses.toLocaleString('ar-SA')} ر.س
              </div>
            }
          </CardContent>
          <MousePointerClick
            className="absolute rotate-90 left-0 top-4 text-destructive"
            size={80}
          />
        </Card>

        <Card
          dir="rtl"
          onClick={() => handelChangeTab('job')}
          className={cn("relative cursor-pointer",
            activeTab == "job" && "bg-primary text-white"
          )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي مصروفات العمل</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingJobExpenses
              ?
              <Skeleton className="w-1/3 mt-4 h-8 bg-muted-foreground" />
              :
              <div className="text-2xl font-bold text-red-600">
                {totalJobExpenses.toLocaleString('ar-SA')} ر.س
              </div>
            }
          </CardContent>
          <MousePointerClick
            className="absolute rotate-90 left-0 top-4 text-destructive"
            size={80}
          />
        </Card>
      </div>

      <Tabs value={activeTab} defaultValue={activeTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger onClick={() => handelChangeTab('job')} value="job">متعلقة بالعمل</TabsTrigger>
          <TabsTrigger onClick={() => handelChangeTab('worker')} value="worker">خاصة بالعمال</TabsTrigger>
        </TabsList>

        <TabsContent value="job" className="space-y-6">
          <div className="flex gap-y-5 flex-col-reverse md:flex-row justify-between items-center">
            <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetJobForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة مصروف عمل
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-screen overflow-y-scroll" dir="rtl">

                <DialogHeader className="items-start p-4">
                  <DialogTitle>إضافة مصروف عمل</DialogTitle>
                  <DialogDescription> المصاريف التعلقة بالشغل مثلا : الاكل - المواصلات - الخ</DialogDescription>
                </DialogHeader>
                {loadingAddExpenses ?
                  <div className="">
                    <Loader2 className="animate-spin mx-auto my-5 block" size={100} />
                    <p className="text-xl text-center">جاري الاضافة...</p>
                  </div>
                  : <form onSubmit={handleJobSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="job-type">النوع *</Label>
                      <Select dir="rtl" value={jobFormData.type} onValueChange={(value) => setJobFormData({ ...jobFormData, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع المصروف" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-type">تم الدفع بواسطة*</Label>
                      <Select dir="rtl" value={jobFormData.paidBy} onValueChange={(value) => setJobFormData({ ...jobFormData, paidBy: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر من قام بدفع هذا المبلغ " />
                        </SelectTrigger>
                        <SelectContent>
                          {paidBy.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="job-description">الوصف *</Label>
                      <Textarea
                        id="job-description"
                        value={jobFormData.description}
                        onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                        placeholder="وصف المصروف"

                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="job-amount">المبلغ *</Label>
                      <Input
                        id="job-amount"
                        type="number"
                        step="1"
                        value={jobFormData.amount}
                        onChange={(e) => setJobFormData({ ...jobFormData, amount: e.target.value })}
                        placeholder="10 ر.س"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>التاريخ *</Label>
                      <Popover open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-right font-normal",
                              !jobFormData.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {jobFormData.date ? format(jobFormData.date, "dd/MM/yyyy") : "اختر التاريخ"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CustomDayPicker
                            OnSelectFn={(date) => handleChangeJobDateExpense(date)}
                            selectedDate={jobFormData.date}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsJobDialogOpen(false)} className="flex-1">
                        إلغاء
                      </Button>
                      <Button type="submit" className="flex-1">
                        إضافة المصروف
                      </Button>
                    </div>
                  </form>}
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-4">
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger>

                  <Button variant="outline">
                    <ArrowDown />
                    تصنيف
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel className="font-semibold text-muted-foreground">تصنيف حسب نوع المصروف</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleFilterByType("all")}>
                    الكل
                  </DropdownMenuItem>
                  {expenseTypes.map((type) => (
                    <DropdownMenuItem key={type} onClick={() => handleFilterByType(type)}>
                      {type}
                    </DropdownMenuItem>
                  ))
                  }

                </DropdownMenuContent>
              </DropdownMenu>
              <h2 className="text-xl font-semibold">المصروفات المتعلقة بالعمل</h2>

            </div>
          </div>
          <hr className='w-full' />
          {isLoadingJobExpenses && <SpinnerLoader />}
          {!jobExpenses.length && !isLoadingJobExpenses && <EmptyData />}

          <div className="flex flex-wrap justify-center items-center  flex-row-reverse gap-4">
            {jobExpenses.reverse().map(expense => <JobExpensesCard expense={expense} key={expense._id} />)}
          </div>
        </TabsContent>
        <TabsContent value="worker" className="space-y-6">
          <div className="flex gap-y-5 flex-col-reverse md:flex-row justify-between items-center">
            <Dialog open={isWorkerDialogOpen} onOpenChange={setIsWorkerDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetWorkerForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة مصروف عامل
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-screen overflow-y-scroll" dir="rtl">
                <DialogHeader className="items-start p-4">

                  <DialogTitle>إضافة مصروف عامل</DialogTitle>
                  <DialogDescription>الدفعات والمصاريف المتعلقة بالعامل</DialogDescription>
                </DialogHeader>
                {loadingAddExpenses ?
                  <div className="">
                    <Loader2 className="animate-spin mx-auto my-5 block" size={100} />
                    <p className="text-xl text-center">جاري الاضافة...</p>
                  </div>
                  :
                  <form onSubmit={handleWorkerSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="worker-select">العامل *</Label>
                      <Select dir="rtl" value={workerFormData.workerId}
                        onValueChange={(value) => {
                          const selectedWorkerId = workers.find(w => w._id === value)._id;
                          const selectedWorkerName = workers.find(w => w._id === value).name;
                          setWorkerFormData({
                            ...workerFormData,
                            workerId: selectedWorkerId,
                            workerName: selectedWorkerName,
                          });
                        }}

                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العامل" />
                        </SelectTrigger>
                        <SelectContent>
                          {workers.map((worker) => (
                            <SelectItem key={worker._id} value={worker._id}>{worker.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-type">تم الدفع بواسطة*</Label>
                      <Select dir="rtl" value={workerFormData.paidBy} onValueChange={(value) => setWorkerFormData({ ...workerFormData, paidBy: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر من قام بدفع هذا المبلغ " />
                        </SelectTrigger>
                        <SelectContent>
                          {paidBy.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="worker-amount">المبلغ *</Label>
                      <Input
                        id="worker-amount"
                        type="number"
                        step="1"
                        value={workerFormData.amount}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, amount: e.target.value })}
                        placeholder="10 ر.س"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="worker-description">الوصف</Label>
                      <Textarea
                        id="worker-description"
                        value={workerFormData.description}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, description: e.target.value })}
                        placeholder="مثل: سلفة، مكافأة، استرداد"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>التاريخ *</Label>
                      <Popover open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-right font-normal",
                              !workerFormData.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {workerFormData.date ? format(workerFormData.date, "dd/MM/yyyy") : "اختر التاريخ"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CustomDayPicker
                            OnSelectFn={(date) => handleChangeWorkerDateExpense(date)}
                            selectedDate={workerFormData.date}
                          />

                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsWorkerDialogOpen(false)} className="flex-1">
                        إلغاء
                      </Button>
                      <Button type="submit" className="flex-1">
                        إضافة المصروف
                      </Button>
                    </div>
                  </form>
                }

              </DialogContent>
            </Dialog>
            <div>
              <h2 className="text-xl font-semibold">المصروفات الخاصة بالعمال</h2>
            </div>
          </div>
          <hr className='w-full' />
          {isLoadingWorkerExpenses && <SpinnerLoader />}
          {!workerExpenses.length && !isLoadingWorkerExpenses && <EmptyData />}
          <div className="flex flex-wrap justify-center items-center  flex-row-reverse gap-4">
            {workerExpenses.reverse().map(expense => <WorkerExpensesCard expense={expense} key={expense._id} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
