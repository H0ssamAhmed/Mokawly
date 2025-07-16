import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Edit, Settings, Trash } from 'lucide-react';
import { CompanyType } from '@/types/CompanyTypes';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import toast from 'react-hot-toast';
import { Textarea } from '../ui/textarea';
import SpinnerLoader from '../SpinnerLoader';

interface Props {
  company: CompanyType,
  resetForm: () => void
  setFormData: React.Dispatch<React.SetStateAction<CompanyType | null>>
  formData: CompanyType,
}
const CompnayCard = ({ company, resetForm, setFormData, formData, }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateExitingCompany = useMutation(api.company.updateCompany);
  const deleteExitingCompany = useMutation(api.company.deleteCompany);



  const handleEdit = (company: CompanyType) => {
    // setEditingCompany(company);
    setFormData({
      _id: company._id,
      name: company.name,
      person_one: company.person_one || "",
      person_one_phone: company.person_one_phone || '',
      person_two: company.person_two || "",
      person_two_phone: company.person_two_phone || '',
      note: company.note
    });
    setIsDialogOpen(true);
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

    const companyData: CompanyType = {
      name: formData.name,
      person_one: formData.person_one,
      person_one_phone: formData.person_one_phone,
      person_two: formData.person_two,
      person_two_phone: formData.person_two_phone,
      note: formData.note,
    };

    updateExitingCompany({ ...companyData, id: company._id })
      .then((res) => {
        if (res.ok) {
          toast.success(res.message, {
            icon: "✅",
          })
          resetForm();
        }
      })
      .catch((err) => console.log(err))
      .finally(() => { })
    resetForm();
    setIsDialogOpen(false)
  };

  const handleDelete = (id: string) => {
    setIsLoading(true);
    deleteExitingCompany({ id })
      .then((res) => {
        if (res.ok) {
          toast.success(res.message, {
            icon: "✅",
          })
        }
      })
      .catch((err) => {
        toast.error(err.message, {
          icon: "❌",
        })
      })
      .finally(() => {
        setIsLoading(false);
      })
  };
  if (isLoading) {
    return (
      <div className=" flex flex-col items-center justify-center">
        <SpinnerLoader className="my-4" parentClassName="h-fit" />
        <p> جاري التحميل . . .</p>
      </div>)
  }
  return (
    <div>
      <Card key={company._id} >
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
              <span className="text-muted-foreground">  المسؤول الاول  : </span>
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
              <span className="text-muted-foreground">  المسؤول الثاني  : </span>
              {company.person_two}
            </div>
          )}

          {company.person_two_phone && (
            <div className="text-sm text-muted-foreground">
              📞 {company.person_two_phone}
            </div>
          )}

          {company.note && (
            <div className="text-sm ">
              <p className='truncate leading-3 bg-green-300 text-black w-full px-2 py-4'>

                ✉️ {company.note}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">


            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(company)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  تعديل
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-screen overflow-y-scroll" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-start py-4">

                    تعديل الشركة
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم الشركة*</Label>
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
                      className="placeholder:text-end"
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
                      تحديث الشركة
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

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
    </div>

  )
}

export default CompnayCard