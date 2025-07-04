
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash, Settings } from "lucide-react";
import { CompanyType } from "@/types/CompanyTypes";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import ThemeToggler from "@/components/ThemeToggler";


export default function Companies() {
  const [companies, setCompanies] = useState<CompanyType[]>([
    {
      name: 'Bedore we Shorok',
      person_one: 'eng:fawzy',
      person_one_phone: 1155544,
      person_two: "hany",
      person_two_phone: 1456,
      note: "note about compy",
    },]
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyType | null>(null);
  const [formData, setFormData] = useState<CompanyType>({
    name: "",
    person_one: "",
    person_one_phone: null,
    person_two: "",
    person_two_phone: null,
    note: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      person_one: "",
      person_one_phone: null,
      person_two: "",
      person_two_phone: null,
      note: "",
    });
    setEditingCompany(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)
    if (!formData.name) {
      toast.error("اسم الشؤكة مطلوب", {
        duration: 4000
      })
      return
    }
    if (!formData.person_one && !formData.person_two) {
      toast.error("يجب اضافة مسؤول واحد علي الاقل")
      return
    }
    console.log(formData)


    const companyData: CompanyType = {
      name: formData.name,
      person_one: formData.person_one,
      person_one_phone: formData.person_one_phone,
      person_two: formData.person_two,
      person_two_phone: formData.person_two_phone,
      note: formData.note,
    };

    // if (editingCompany) {
    //   setCompanies(companies.map(c => c._id === editingCompany._id ? companyData : c));
    // toast({
    //   title: "نجح",
    //   description: "تم تحديث الشركة بنجاح",
    // });
    // } else {
    //   setCompanies([...companies, companyData]);
    // toast({
    //   title: "نجح",
    //   description: "تم إضافة الشركة بنجاح",
    // });
    // }

    // setIsDialogOpen(false);
    // resetForm();
  };

  const handleEdit = (company: CompanyType) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      person_one: company.person_one || "",
      person_one_phone: company.person_one_phone || null,
      person_two: company.person_two || "",
      person_two_phone: company.person_two_phone || null,
      note: company.note
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCompanies(companies.filter(c => c._id !== id));
    // toast({
    //   title: "نجح",
    //   description: "تم حذف الشركة بنجاح",
    // });
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

                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="persone_one">الشخص المسؤول الاول </Label>
                <Input
                  id="persone_one"
                  value={formData.person_one}
                  onChange={(e) => setFormData({ ...formData, person_one: e.target.value })}
                  placeholder="اسم الشخص المسؤول الاول"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="persone_one_phone">رقم هاتف  المسؤول الاول</Label>
                <Input
                  id="persone_one_phone"
                  type="number"
                  className="placeholder:text-end"
                  value={formData.person_one_phone}
                  onChange={(e) => setFormData({ ...formData, person_one_phone: Number(e.target.value) })}
                  placeholder="رقم الشخص المسؤول الاول"

                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="persone_two">الشخص المسؤول الثاني</Label>
                <Input
                  id="persone_two"
                  value={formData.person_two}
                  onChange={(e) => setFormData({ ...formData, person_two: e.target.value })}
                  placeholder="اسم الشخص المسؤول الثاني"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="persone_two_phone">رقم هاتف  المسؤول الثاني</Label>
                <Input
                  className="placeholder:text-end"
                  id="persone_two_phone"
                  type="number"
                  value={formData.person_two_phone}
                  onChange={(e) => setFormData({ ...formData, person_two_phone: Number(e.target.value) })}
                  placeholder="رقم الشخص المسؤول الثاني"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">ملاحظات | معلومات اضافية (اختياري)</Label>
                <ThemeToggler />
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="ملاحظة عن الشركة او مثل حجم الشركة ومشاريعها... الخ"
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
          <Card key={company._id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">{company.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.person_one && (
                <div className="text-sm">
                  <span className="text-muted-foreground">الشخص المسؤول: </span>
                  {company.person_one}
                </div>
              )}

              {company.person_one_phone && (
                <div className="text-sm text-muted-foreground">
                  📞 {company.person_one_phone}
                </div>
              )}
              {company.person_two && (
                <div className="text-sm">
                  <span className="text-muted-foreground">الشخص المسؤول: </span>
                  {company.person_two_phone}
                </div>
              )}

              {company.person_one_phone && (
                <div className="text-sm text-muted-foreground">
                  📞 {company.person_one_phone}
                </div>
              )}

              {company.note && (
                <div className="text-sm text-muted-foreground">
                  ✉️ {company.note}
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
                  onClick={() => handleDelete(company._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> *

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
