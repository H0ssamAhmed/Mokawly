import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CalendarIcon, Plus, Settings } from "lucide-react";
import { Payment } from '@/types/Payment';
import toast from 'react-hot-toast';
import { CompanyType } from '@/types/CompanyTypes';
import SpinnerLoader from './SpinnerLoader';
import CustomDayPicker from './CustomDayPicker';
import { cn } from '@/lib/utils';
const AddPayment = ({ companies }: { companies: CompanyType[] }) => {

  const addNewPayment = useMutation(api.payment.addPayment)

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Payment>({
    companyName: "",
    companyId: "",
    amount: 0,
    date: String(new Date()),
    note: "",
  });

  const resetForm = () => {
    setFormData({
      companyName: "",
      companyId: "",
      amount: 0,
      date: String(new Date()),
      note: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyId || !formData.amount) {
      toast.error("يجب ادخال الشركة والمبلغ");
      return;
    }
    setLoading(true)

    const company = companies.find(c => c._id === formData.companyId);
    const newPayment: Payment = {
      companyId: formData.companyId,
      companyName: company?.name || "",
      amount: Number(formData.amount),
      date: format(formData.date, "yyyy-MM-dd"),
      note: formData.note || '',
    };

    addNewPayment(newPayment)
      .then((res) => {
        if (res.ok) {
          toast.success("تم اضافة الدفعة بنجاح");
          resetForm();
          setIsDialogOpen(false);
        }
      })
      .catch((err) => {
        toast.error("حاول مرة اخري");
        console.error(err);
      })
      .finally(() => {
        setLoading(false)

      })

  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={resetForm}>
          <Plus className="mr-2 h-4 w-4" />
          تسجيل دفعة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-start my-2">تسجيل دفعة</DialogTitle>
          <DialogDescription className="text-start my-2">تسجيل دفعة جديدة</DialogDescription>
        </DialogHeader>
        {loading ? <SpinnerLoader /> : <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">الشركة *</Label>
            <Select dir="rtl" value={formData.companyId} onValueChange={(value) => setFormData({ ...formData, companyId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الشركة" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company._id} value={company._id}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
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
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "dd/MM/yyyy") : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CustomDayPicker
                  OnSelectFn={(date) => date && setFormData({ ...formData, date: String(date) })}
                  selectedDate={new Date(formData.date)}
                />

                {/* <Calendar
                      mode="single"
                      selected={new Date(formData.date)}
                      onSelect={(date) => date && setFormData({ ...formData, date: String(date) })}
                      initialFocus
                      className="pointer-events-auto"
                    /> */}
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">ملاحظة (اختيارية)</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="تفاصيل الدفعة أو ملاحظات"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
              إلغاء
            </Button>
            <Button type="submit" className="flex-1">
              تسجيل الدفعة
            </Button>
          </div>
        </form>}
      </DialogContent>
    </Dialog>
  )
}

export default AddPayment