
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "شركة البناء الحديث",
      contact: "أحمد محمد",
      phone: "+966501234567",
      email: "ahmed@modernbuild.com",
    },
    {
      id: "2",
      name: "مؤسسة المقاولات الذهبية",
      contact: "سارة علي",
      phone: "+966507654321",
    },
    {
      id: "3",
      name: "شركة التطوير العقاري",
      email: "info@realestate.com",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      contact: "",
      phone: "",
      email: "",
    });
    setEditingCompany(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "خطأ",
        description: "اسم الشركة مطلوب",
        variant: "destructive",
      });
      return;
    }

    const companyData: Company = {
      id: editingCompany?.id || Date.now().toString(),
      name: formData.name,
      contact: formData.contact || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
    };

    if (editingCompany) {
      setCompanies(companies.map(c => c.id === editingCompany.id ? companyData : c));
      toast({
        title: "نجح",
        description: "تم تحديث الشركة بنجاح",
      });
    } else {
      setCompanies([...companies, companyData]);
      toast({
        title: "نجح",
        description: "تم إضافة الشركة بنجاح",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      contact: company.contact || "",
      phone: company.phone || "",
      email: company.email || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCompanies(companies.filter(c => c.id !== id));
    toast({
      title: "نجح",
      description: "تم حذف الشركة بنجاح",
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">الشركات</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة شركة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCompany ? "تعديل الشركة" : "إضافة شركة جديدة"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الشركة *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="اسم الشركة"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">الشخص المسؤول</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="اسم الشخص المسؤول"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966501234567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@company.com"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1">
                  {editingCompany ? "تحديث" : "إضافة"} الشركة
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <Card key={company.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">{company.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.contact && (
                <div className="text-sm">
                  <span className="text-muted-foreground">الشخص المسؤول: </span>
                  {company.contact}
                </div>
              )}
              
              {company.phone && (
                <div className="text-sm text-muted-foreground">
                  📞 {company.phone}
                </div>
              )}
              
              {company.email && (
                <div className="text-sm text-muted-foreground">
                  ✉️ {company.email}
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(company)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  تعديل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(company.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">لا توجد شركات بعد</h3>
            <p className="text-muted-foreground mb-4">
              أضف الشركات التي تتعامل معها لتتبع المدفوعات وإدارة العلاقات.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              أضف أول شركة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
