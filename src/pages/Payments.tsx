
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { CalendarIcon, Plus, Settings, Trash, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { parse } from "path";
import CustomDayPicker from "@/components/CustomDayPicker";
import SpinnerLoader from "@/components/SpinnerLoader";
import { Payment } from "@/types/Payment";
import AddPayment from "@/components/AddPayment";



export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [companies, setCompanies] = useState([]);
  const [showPayments, setShowPayemnts] = useState<boolean>(true);
  const getCompnaies = useQuery(api.company.getCompanies)
  const getPayments = useQuery(api.payment.getAllPayments)
  const deleteAPayment = useMutation(api.payment.deletePayment)

  useEffect(() => {
    if (getCompnaies) {
      setCompanies(getCompnaies.companies);
    }
    if (getPayments) {
      setPayments(getPayments.payments)
    }
  }, [getCompnaies])

  const deletePayment = (id: string) => {
    deleteAPayment({ id })
      .then(() => {
        toast.success("تم حذف الدفعة بنجاح")

      })
  }

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);



  // Group payments by company
  const paymentsByCompany = companies.map(company => ({
    ...company,
    payments: payments.filter(p => p.companyId === company._id),
    total: payments
      .filter(p => p.companyId === company._id)
      .reduce((sum, p) => sum + p.amount, 0),
  }));
  console.log(paymentsByCompany);


  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">المدفوعات</h1>
        <AddPayment companies={companies} />

      </div>
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي عدد المدفوعات المستلمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {payments.length} دفعة
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments by Company */}
      <Card>
        <CardHeader>
          <CardTitle>المدفوعات حسب الشركة</CardTitle>

        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentsByCompany.map((company) => (
              <div key={company._id} className="p-4 border rounded-lg">
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
      {/* Recent Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>المدفوعات الأخيرة</CardTitle>

          <Button
            onClick={() => setShowPayemnts(!showPayments)}
            variant="ghost" className="text-muted-foreground">
            {showPayments ? "اظهار" : "اخفاء"} المدفوعات
          </Button>
        </CardHeader>
        {<CardContent
          className={cn("animate-fade-in max-h-96 h-fit overflow-y-scroll",
            showPayments && "hidden"
          )}
        >
          <div className="space-y-4">
            {payments
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((payment) => (
                <div key={payment._id} className="flex justify-between items-start p-4 border rounded-lg">
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
                  <div className="flex flex-col items-end gap-y-5">
                    <span className="text-lg font-bold text-green-600">
                      +{payment.amount.toLocaleString('ar-SA')} ر.س
                    </span>
                    <Button
                      onClick={() => deletePayment(payment._id)}
                      variant="destructive" size="icon">
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>}
      </Card>

    </div>
  );
}
