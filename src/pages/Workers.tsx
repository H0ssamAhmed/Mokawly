
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Worker {
  id: string;
  name: string;
  dailyWage: number;
  type: "عامل" | "حرفي";
  phone?: string;
  isPublished: boolean;
}

export default function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: "1",
      name: "أحمد محمد",
      dailyWage: 300,
      type: "حرفي",
      phone: "+966501234567",
      isPublished: true,
    },
    {
      id: "2",
      name: "محمد علي",
      dailyWage: 250,
      type: "عامل",
      phone: "+966507654321",
      isPublished: false,
    },
    {
      id: "3",
      name: "خالد سعد",
      dailyWage: 280,
      type: "حرفي",
      isPublished: true,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    dailyWage: "",
    type: "عامل" as "عامل" | "حرفي",
    phone: "",
    isPublished: false,
  });

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
      toast({
        title: "خطأ",
        description: "الاسم والأجر اليومي مطلوبان",
        variant: "destructive",
      });
      return;
    }

    const workerData: Worker = {
      id: editingWorker?.id || Date.now().toString(),
      name: formData.name,
      dailyWage: parseFloat(formData.dailyWage),
      type: formData.type,
      phone: formData.phone || undefined,
      isPublished: formData.isPublished,
    };

    if (editingWorker) {
      setWorkers(workers.map(w => w.id === editingWorker.id ? workerData : w));
      toast({
        title: "نجح",
        description: "تم تحديث العامل بنجاح",
      });
    } else {
      setWorkers([...workers, workerData]);
      toast({
        title: "نجح",
        description: "تم إضافة العامل بنجاح",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      dailyWage: worker.dailyWage.toString(),
      type: worker.type,
      phone: worker.phone || "",
      isPublished: worker.isPublished,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setWorkers(workers.filter(w => w.id !== id));
    toast({
      title: "نجح",
      description: "تم حذف العامل بنجاح",
    });
  };

  const togglePublished = (id: string) => {
    setWorkers(workers.map(w => 
      w.id === id ? { ...w, isPublished: !w.isPublished } : w
    ));
  };

  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">العمال</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة عامل
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingWorker ? "تعديل العامل" : "إضافة عامل جديد"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="اسم العامل"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dailyWage">الأجر اليومي *</Label>
                <Input
                  id="dailyWage"
                  type="number"
                  step="0.01"
                  value={formData.dailyWage}
                  onChange={(e) => setFormData({ ...formData, dailyWage: e.target.value })}
                  placeholder="300.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">النوع</Label>
                <Select value={formData.type} onValueChange={(value: "عامل" | "حرفي") => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="عامل">عامل</SelectItem>
                    <SelectItem value="حرفي">حرفي</SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((worker) => (
          <Card key={worker.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">{worker.name}</CardTitle>
                </div>
                <Badge variant={worker.type === "حرفي" ? "default" : "secondary"}>
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
                    onCheckedChange={() => togglePublished(worker.id)}
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
                  onClick={() => handleDelete(worker.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
              
              {worker.isPublished && (
                <div className="text-xs text-muted-foreground pt-1">
                  🔗 الملخص: /worker-summary/{worker.id}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {workers.length === 0 && (
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
