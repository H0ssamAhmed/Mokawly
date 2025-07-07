
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash, Settings } from "lucide-react";
import { CompanyType } from "@/types/CompanyTypes";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import SpinnerLoader from "@/components/SpinnerLoader";
import CompnayCard from "@/components/CompnayCard";


export default function Companies() {
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const addNewCompany = useMutation(api.company.addCompany);
  const getCompnaies = useQuery(api.company.getCompanies)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyType | null>(null);

  const [formData, setFormData] = useState<CompanyType>({
    name: "",
    person_one: "",
    person_one_phone: "",
    person_two: "",
    person_two_phone: "",
    note: "",
  });

  React.useEffect(() => {
    if (getCompnaies) {
      setCompanies(getCompnaies.companies);
      setIsLoading(false)
    }
  }, [getCompnaies])

  const resetForm = () => {
    setFormData({
      name: "",
      person_one: "",
      person_one_phone: "",
      person_two: "",
      person_two_phone: "",
      note: "",
    });
    setIsDialogOpen(false)
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("اسم الشركة مطلوب", {
        duration: 4000
      })
      return
    }
    if (!formData.person_one && !formData.person_two) {
      toast.error("يجب اضافة مسؤول واحد علي الاقل")
      return
    }

    if (formData.person_one && !formData.person_one_phone) {
      toast.error("يجب اضافة رقم المسؤول الاول")
      return

    }
    if (formData.person_two && !formData.person_two_phone) {
      toast.error("يجب اضافة رقم المسؤول الثاني")
      return
    }
    setIsAdding(true)

    const companyData: CompanyType = {
      name: formData.name,
      person_one: formData.person_one,
      person_one_phone: formData.person_one_phone,
      person_two: formData.person_two,
      person_two_phone: formData.person_two_phone,
      note: formData.note,
    };

    addNewCompany(companyData)
      .then((res) => {
        if (res.ok) {
          toast.success(res.message, {
            icon: "✅",
          })
          resetForm();

        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsAdding(false)
      })


  };


  if (isLoading) {
    return (
      <div className=" h-screen flex flex-col items-center justify-center">
        <SpinnerLoader className="my-4" parentClassName="h-fit" />
        <p> جاري التحميل . . .</p>
      </div>
    )
  }
  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">الشركات</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة شركة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-screen overflow-y-scroll" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-start py-4">
                إضافة شركة جديدة
              </DialogTitle>
            </DialogHeader>
            {isAdding
              ? <SpinnerLoader className="my-4" parentClassName="h-fit" />
              : <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="placeholder:text-start"
                    value={formData.person_one_phone}
                    onChange={(e) => setFormData({ ...formData, person_one_phone: e.target.value })}
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
                    className="placeholder:text-start"
                    id="persone_two_phone"
                    type="number"
                    value={formData.person_two_phone}
                    onChange={(e) => setFormData({ ...formData, person_two_phone: e.target.value })}
                    placeholder="رقم الشخص المسؤول الثاني"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">ملاحظات | معلومات اضافية (اختياري)</Label>
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
                    إضافة  شركة
                  </Button>
                </div>
              </form>}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <CompnayCard
            formData={formData}
            key={company._id}
            setFormData={setFormData}
            company={company}
            resetForm={resetForm}
          // setEditingCompany={setEditingCompany}
          />
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
