
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  companyId: string;
  companyName: string;
  amount: number;
  date: string;
  note?: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      companyId: "1",
      companyName: "شركة البناء الحديث",
      amount: 5000.00,
      date: "2024-12-12",
      note: "دفعة عن أعمال ديسمبر",
    },
    {
      id: "2",
      companyId: "2",
      companyName: "مؤسسة الإنشاءات المتطورة",
      amount: 3200.00,
      date: "2024-12-08",
    },
    {
      id: "3",
      companyId: "3",
      companyName: "شركة العقارات الذهبية",
      amount: 2800.00,
      date: "2024-12-05",
      note: "دفعة جزئية عن نوفمبر",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyId: "",
    amount: "",
    date: new Date(),
    note: "",
  });

  // Mock companies data
  const companies = [
    { id: "1", name: "شركة البناء الحديث" },
    { id: "2", name: "مؤسسة الإنشاءات المتطورة" },
    { id: "3", name: "شركة العقارات الذهبية" },
  ];

  const resetForm = () => {
    setFormData({
      companyId: "",
      amount: "",
      date: new Date(),
      note: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyId || !formData.amount) {
      toast({
        title: "خطأ",
        description: "الشركة والمبلغ مطلوبان",
        variant: "destructive",
      });
      return;
    }

    const company = companies.find(c => c.id === formData.companyId);
    const newPayment: Payment = {
      id: Date.now().toString(),
      companyId: formData.companyId,
      companyName: company?.name || "",
      amount: parseFloat(formData.amount),
      date: format(formData.date, "yyyy-MM-dd"),
      note: formData.note || undefined,
    };

    setPayments([...payments, newPayment]);
    setIsDialogOpen(false);
    resetForm();
    
    toast({
      title: "نجح",
      description: "تم تسجيل الدفعة بنجاح",
    });
  };

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Group payments by company
  const paymentsByCompany = companies.map(company => ({
    ...company,
    payments: payments.filter(p => p.companyId === company.id),
    total: payments
      .filter(p => p.companyId === company.id)
      .reduce((sum, p) => sum + p.amount, 0),
  }));

  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">المدفوعات</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              تسجيل دفعة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تسجيل دفعة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">الشركة *</Label>
                <Select value={formData.companyId} onValueChange={(value) => setFormData({ ...formData, companyId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
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
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({ ...formData, date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
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
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المدفوعات المستلمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {totalPayments.toLocaleString('ar-SA')} ر.س
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>المدفوعات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((payment) => (
                <div key={payment.id} className="flex justify-between items-start p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">{payment.companyName}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {format(new Date(payment.date), "dd/MM/yyyy")}
                    </p>
                    {payment.note && (
                      <p className="text-sm text-muted-foreground">{payment.note}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">
                      +{payment.amount.toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Payments by Company */}
      <Card>
        <CardHeader>
          <CardTitle>المدفوعات حسب الشركة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentsByCompany.map((company) => (
              <div key={company.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">{company.name}</h3>
                </div>
                <div className="text-xl font-bold text-green-600 mb-2">
                  {company.total.toLocaleString('ar-SA')} ر.س
                </div>
                <p className="text-sm text-muted-foreground">
                  {company.payments.length} دفعة{company.payments.length !== 1 ? '' : ''}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
