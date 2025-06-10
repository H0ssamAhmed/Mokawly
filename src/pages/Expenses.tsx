
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface JobExpense {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
}

interface WorkerExpense {
  id: string;
  workerId: string;
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
      description: "بنزين شاحنة العمل",
      amount: 120.00,
      date: "2024-12-15",
    },
    {
      id: "2",
      type: "الطعام",
      description: "غداء للفريق",
      amount: 180.00,
      date: "2024-12-15",
    },
  ]);

  const [workerExpenses, setWorkerExpenses] = useState<WorkerExpense[]>([
    {
      id: "1",
      workerId: "1",
      workerName: "أحمد محمد",
      amount: 500.00,
      date: "2024-12-14",
      description: "سلفة",
    },
    {
      id: "2",
      workerId: "2",
      workerName: "محمد علي",
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
    amount: "",
    date: new Date(),
  });

  const [workerFormData, setWorkerFormData] = useState({
    workerId: "",
    amount: "",
    description: "",
    date: new Date(),
  });

  // Mock workers data
  const workers = [
    { id: "1", name: "أحمد محمد" },
    { id: "2", name: "محمد علي" },
    { id: "3", name: "خالد سعد" },
  ];

  const expenseTypes = [
    "المواصلات",
    "الطعام",
    "المواد",
    "الأدوات",
    "المعدات",
    "أخرى",
  ];

  const resetJobForm = () => {
    setJobFormData({
      type: "",
      description: "",
      amount: "",
      date: new Date(),
    });
  };

  const resetWorkerForm = () => {
    setWorkerFormData({
      workerId: "",
      amount: "",
      description: "",
      date: new Date(),
    });
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobFormData.type || !jobFormData.description || !jobFormData.amount) {
      toast({
        title: "خطأ",
        description: "جميع الحقول مطلوبة ماعدا الوصف",
        variant: "destructive",
      });
      return;
    }

    const newExpense: JobExpense = {
      id: Date.now().toString(),
      type: jobFormData.type,
      description: jobFormData.description,
      amount: parseFloat(jobFormData.amount),
      date: format(jobFormData.date, "yyyy-MM-dd"),
    };

    setJobExpenses([...jobExpenses, newExpense]);
    setIsJobDialogOpen(false);
    resetJobForm();
    
    toast({
      title: "نجح",
      description: "تم إضافة مصروف العمل بنجاح",
    });
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workerFormData.workerId || !workerFormData.amount) {
      toast({
        title: "خطأ",
        description: "العامل والمبلغ مطلوبان",
        variant: "destructive",
      });
      return;
    }

    const worker = workers.find(w => w.id === workerFormData.workerId);
    const newExpense: WorkerExpense = {
      id: Date.now().toString(),
      workerId: workerFormData.workerId,
      workerName: worker?.name || "",
      amount: parseFloat(workerFormData.amount),
      date: format(workerFormData.date, "yyyy-MM-dd"),
      description: workerFormData.description || undefined,
    };

    setWorkerExpenses([...workerExpenses, newExpense]);
    setIsWorkerDialogOpen(false);
    resetWorkerForm();
    
    toast({
      title: "نجح",
      description: "تم إضافة مصروف العامل بنجاح",
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
                <DialogHeader>
                  <DialogTitle>إضافة مصروف عمل</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleJobSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-type">النوع *</Label>
                    <Select value={jobFormData.type} onValueChange={(value) => setJobFormData({ ...jobFormData, type: value })}>
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
                      step="0.01"
                      value={jobFormData.amount}
                      onChange={(e) => setJobFormData({ ...jobFormData, amount: e.target.value })}
                      placeholder="0.00"
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
                          initialFocus
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
                </form>
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
                <DialogHeader>
                  <DialogTitle>إضافة مصروف عامل</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleWorkerSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="worker-select">العامل *</Label>
                    <Select value={workerFormData.workerId} onValueChange={(value) => setWorkerFormData({ ...workerFormData, workerId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر العامل" />
                      </SelectTrigger>
                      <SelectContent>
                        {workers.map((worker) => (
                          <SelectItem key={worker.id} value={worker.id}>{worker.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="worker-amount">المبلغ *</Label>
                    <Input
                      id="worker-amount"
                      type="number"
                      step="0.01"
                      value={workerFormData.amount}
                      onChange={(e) => setWorkerFormData({ ...workerFormData, amount: e.target.value })}
                      placeholder="0.00"
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
