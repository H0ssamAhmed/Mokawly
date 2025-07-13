import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Grid3X3, Plus, Rows3, User } from "lucide-react";
import { toast } from "sonner";
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from "convex/react";
import { WorkerType } from "@/types/SharedTypes";
import ReqiureInputSgin from "@/components/ReqiureInputSgin";
import WorkerCard from "@/components/worker/WorkerCard";
import SpinnerLoader from "@/components/SpinnerLoader";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import WorkerList from "@/components/worker/WorkerList";



export default function Workers() {
  const addWorker = useMutation(api.worker.addWorker);
  const getAllWorkers = useQuery(api.worker.getWorkers);
  const [workers, setWorkers] = useState<WorkerType[]>([])
  const [isloading, setIsloading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [itemsView, setItemsView] = useState<string>("grid")
  const [editingWorker, setEditingWorker] = useState<WorkerType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    dailyWage: 0,
    type: "عامل" as "عامل" | "صنايعي",
    phone: "",
    note: "",
    isPublished: false,
  });
  useEffect(() => {
    if (getAllWorkers) {
      setWorkers(getAllWorkers.workers)
      setIsloading(false)
    }
  }, [getAllWorkers])

  const resetForm = () => {
    setFormData({
      name: "",
      dailyWage: 0,
      type: "عامل",
      phone: "",
      note: "",
      isPublished: false,
    });
    setEditingWorker(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dailyWage) {
      return;
    }
    const workerData: WorkerType = {
      name: formData.name,
      dailyWage: +(formData.dailyWage),
      type: formData.type,
      note: formData.note,
      phone: formData.phone || "لم يتم ادخال رقم الهاتف",
      isPublished: formData.isPublished,
    };
    setIsloading(true);

    addWorker(workerData)
      .then((res) => {
        toast.error(`تم اضافة ${res.worker.name} بنحاح`, {
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
      }).finally(() => {
        setIsloading(false);
        setIsDialogOpen(false);
      })

  };


  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">العاملين</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة عامل
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-screen overflow-y-scroll" dir="rtl">
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
                  step="5"
                  value={formData.dailyWage}
                  onChange={(e) => setFormData({ ...formData, dailyWage: Number(e.target.value) })}
                  placeholder="الأجر اليومي مثل 150"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">النوع  <ReqiureInputSgin /></Label>
                <Select dir='rtl' value={formData.type} onValueChange={(value: "عامل" | "صنايعي") => setFormData({ ...formData, type: value })}>
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
              <div className="space-y-2">
                <Label htmlFor="note">ملاحظه عن هذا العامل (اختياري)</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="ملاحظه عن حساب قدم مثلا او شئ اخر"
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
      <div className="flex items-center justify-start gap-4 my-4">
        <p>اختر طريقة عرض البيانات: </p>
        <Grid3X3
          onClick={() => setItemsView("grid")}
          className={cn("w-8 h-8 p-1 cursor-pointer rounded-sm", itemsView == "grid" && "bg-primary dark:text-black text-white")} />
        <Rows3
          onClick={() => setItemsView("list")}
          className={cn("w-8 h-8 p-1 cursor-pointer rounded-sm", itemsView == "list" && "bg-primary dark:text-black text-white")} />
      </div>
      {isloading && <SpinnerLoader />}

      {!isloading && workers.length !== 0 &&

        itemsView == "grid" ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <WorkerCard
              key={worker._id}
              worker={worker}
              formData={formData}
              setFormData={setFormData}
            />
          ))}
        </div>
        :
        <div className="flex flex-col gap-4">
          {workers.map((worker) => (
            <WorkerList
              key={worker._id}
              worker={worker}
              formData={formData}
              setFormData={setFormData}
            />
          ))}
        </div>
      }

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
