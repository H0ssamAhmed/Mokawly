
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { CustomSuccessToast } from "@/components/CustomSuccessToast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface JobExpense {
  id?: string;
  type: string;
  paidBy: string,
  description: string;
  amount: number;
  date: string;
}

interface WorkerExpense {
  id?: string;
  workerId: string;
  paidBy: string,
  workerName: string;
  amount: number;
  date: string;
  description?: string;
}

export default function Expenses() {
  const [jobExpenses, setJobExpenses] = useState<JobExpense[]>([
    {
      id: "1",
      type: "المواصلات",
      paidBy: "حسام احمد",
      description: "بنزين شاحنة العمل",
      amount: 120.00,
      date: "2024-12-15",
    },
    {
      id: "2",
      type: "الطعام",
      paidBy: "عصام عطيه",
      description: "غداء للفريق",
      amount: 180.00,
      date: "2024-12-15",
    },
  ]);
  const addNewWorkerExpense = useMutation(api.expenses.AddworkerExpense);
  const addNewJobExpense = useMutation(api.expenses.addJobExpense);
  const existWorkers = useQuery(api.worker.getWorkers);;
  const [workers, setWorkers] = useState([]);
  const [loadingAddExpenses, setLoadingAddExpenses] = useState<boolean>(false);

  const [workerExpenses, setWorkerExpenses] = useState<WorkerExpense[]>([
    {
      id: "1",
      workerId: "1",
      workerName: "أحمد محمد",
      paidBy: "عصام عطيه",
      amount: 500.00,
      date: "2024-12-14",
      description: "سلفة",
    },
    {
      id: "2",
      workerId: "2",
      workerName: "محمد علي",
      paidBy: "عصام عطيه",
      amount: 100.00,
      date: "2024-12-13",
      description: "مكافأة",
    },
  ]);

  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);

  const [jobFormData, setJobFormData] = useState({
    type: "",
    description: "",
    paidBy: "",
    amount: "",
    date: new Date(),
  });

  const [workerFormData, setWorkerFormData] = useState({
    workerId: "",
    workerName: "",
    amount: "",
    paidBy: "",
    description: "",
    date: new Date(),
  });

  // Mock workers data

  const expenseTypes = [
    "المواصلات",
    "الطعام",
    "المواد",
    "الأدوات",
    "المعدات",
    "أخرى",
  ];
  const paidBy = [
    "عصام عطيه",
    "حسام احمد",
    "السيد عاطف",
  ];
  useEffect(() => {
    if (existWorkers) {
      setWorkers(existWorkers.workers);
      console.log(existWorkers.workers);
    }
  }, [existWorkers])
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
        console.log(res);

        const type = res.expense.type
        toast.success(<h1>تم اضافة حساب   <b>{" " + type + " "} </b>  بنجاح</h1>, {
          icon: "✅",
          duration: 3000,
        });
      }).catch((error) => {
        console.log(error);

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
        const name = res.workerExpense.workerName
        toast.success(<h1>تم اضافة المصروف  بإسم  <b>{" " + name + " "} </b>  بنجاح</h1>, {
          icon: "✅",
          duration: 3000,
        });
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


  const totalJobExpenses = jobExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalWorkerExpenses = workerExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">المصروفات</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي مصروفات العمل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalJobExpenses.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي مصروفات العمال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalWorkerExpenses.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="job" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="job">متعلقة بالعمل</TabsTrigger>
          <TabsTrigger value="worker">خاصة بالعمال</TabsTrigger>
        </TabsList>

        <TabsContent value="job" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">المصروفات المتعلقة بالعمل</h2>

            <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetJobForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة مصروف عمل
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
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
                        required
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
                      <Popover>
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
                          <Calendar
                            mode="single"
                            selected={jobFormData.date}
                            onSelect={(date) => date && setJobFormData({ ...jobFormData, date })}
                            // initialFocus={true}
                            className="pointer-events-auto"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobExpenses.map((expense) => (
              <Card key={expense.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm">{expense.type}</CardTitle>
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      -{expense.amount.toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {expense.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(expense.date), "dd/MM/yyyy")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="worker" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">المصروفات الخاصة بالعمال</h2>

            <Dialog open={isWorkerDialogOpen} onOpenChange={setIsWorkerDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetWorkerForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة مصروف عامل
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
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
                      <Popover>
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
                          <Calendar
                            mode="single"
                            selected={workerFormData.date}
                            onSelect={(date) => date && setWorkerFormData({ ...workerFormData, date })}
                            initialFocus
                            className="pointer-events-auto"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workerExpenses.map((expense) => (
              <Card key={expense.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm">{expense.workerName}</CardTitle>
                      {expense.description && (
                        <p className="text-xs text-muted-foreground">{expense.description}</p>
                      )}
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      -{expense.amount.toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(expense.date), "dd/MM/yyyy")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
