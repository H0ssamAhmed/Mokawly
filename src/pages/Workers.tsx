
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from '../../convex/_generated/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { WorkerType } from "@/types/SharedTypes";
import ReqiureInputSgin from "@/components/ReqiureInputSgin";



export default function Workers() {
  const addWorker = useMutation(api.worker.addWorker);
  const getAllWorkers = useQuery(api.worker.getWorkers);
  const [workers, setWorkers] = useState<WorkerType[]>([])
  const [isloading, setIsloading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingWorker, setEditingWorker] = useState<WorkerType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    dailyWage: "",
    type: "عامل" as "عامل" | "صنايعي",
    phone: null,
    isPublished: false,
  });
  useEffect(() => {
    if (getAllWorkers) {
      setWorkers(getAllWorkers.workers)
    }
  }, [getAllWorkers])

  const resetForm = () => {
    setFormData({
      name: "",
      dailyWage: "",
      type: "عامل",
      phone: "",
      isPublished: false,
    });
    setEditingWorker(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();



    if (!formData.name || !formData.dailyWage) {
      console.log("error");
      return;
    }

    const workerData: WorkerType = {
      name: formData.name,
      dailyWage: +(formData.dailyWage),
      type: formData.type,
      phone: formData.phone || null,
      isPublished: formData.isPublished,
    };
    setIsloading(true);
    addWorker(workerData)
      .then((res) => {
        console.log(res);

        toast.error("تم اضافة العامل بنحاح", {
          duration: 3000,
          icon: "✅",
          style: {
            color: "green"
          }
        });
      }).catch((err) => {
        toast.error("حدث خطأ", {
          duration: 5000,
          icon: "❌",
          style: {
            color: "red"
          }
        });
        console.log(err);
      }).finally(() => {

        setIsloading(false);
        setIsDialogOpen(false);
      })

    // if (editingWorker) {
    //   setWorkers(workers.map(w => w._id === editingWorker._id ? workerData : w));
    //   toast({
    //     title: "نجح",
    //     description: "تم تحديث العامل بنجاح",
    //   });
    // } else {
    //   setWorkers([...workers, workerData]);
    //   toast({
    //     title: "نجح",
    //     description: "تم إضافة العامل بنجاح",
    //   });
    // }

    // setIsDialogOpen(false);
    // resetForm();
  };

  const handleEdit = (worker: WorkerType) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      dailyWage: worker.dailyWage.toString(),
      type: worker.type,
      phone: worker.phone || null,
      isPublished: worker.isPublished,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setWorkers(workers.filter(w => w._id !== id));
    toast.success("تم حذف العامل بنجاح", {
      position: "top-center"
    });
  };

  const togglePublished = (id: string) => {
    setWorkers(workers.map(w =>
      w._id === id ? { ...w, isPublished: !w.isPublished } : w
    ));
  };

  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">العمال</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة عامل
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <div className="flex items-start justify-center flex-col gap-2 p-4">
                <DialogTitle className="text-2xl">
                  {editingWorker ? "تعديل العامل" : "إضافة عامل جديد"}
                </DialogTitle>
                <DialogDescription className="text-md">
                  العلامة  <ReqiureInputSgin />  هي مطلوبة

                </DialogDescription>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم <ReqiureInputSgin /></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="اسم العامل"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyWage">الأجر اليومي ( ريال ) <ReqiureInputSgin /></Label>
                <Input
                  id="dailyWage"
                  type="number"
                  step="1"
                  value={formData.dailyWage}
                  onChange={(e) => setFormData({ ...formData, dailyWage: e.target.value })}
                  placeholder="الأجر اليومي مثل 150"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">النوع  <ReqiureInputSgin /></Label>
                <Select value={formData.type} onValueChange={(value: "عامل" | "صنايعي") => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="عامل">عامل</SelectItem>
                    <SelectItem value="صنايعي">صنايعي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966501234567"
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  dir="ltr"
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                />
                <Label htmlFor="isPublished">السماح بالوصول لصفحة الملخص</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1">
                  {editingWorker ? "تحديث" : "إضافة"} العامل
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!isloading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((worker) => (
          <Card key={worker._id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">{worker.name}</CardTitle>
                </div>
                <Badge variant={worker.type === "صنايعي" ? "default" : "secondary"}>
                  {worker.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-lg font-semibold">
                {worker.dailyWage.toLocaleString('ar-SA')} ر.س/يوم
              </div>

              {worker.phone && (
                <div className="text-sm text-muted-foreground">
                  📞 {worker.phone}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={worker.isPublished}
                    onCheckedChange={() => togglePublished(worker._id)}
                  />
                  <span className="text-xs text-muted-foreground">
                    الملخص {worker.isPublished ? "عام" : "خاص"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(worker)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  تعديل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(worker._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>

              {worker.isPublished && (
                <div className="text-xs text-muted-foreground pt-1">
                  🔗 الملخص: /worker-summary/{worker._id}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>}
      {isloading && <Loader2 className="animate-spin mx-auto my-5 block" size={100} />}
      {!isloading && workers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">لا يوجد عمال بعد</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بإضافة أول عامل في النظام.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              أضف أول عامل
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
