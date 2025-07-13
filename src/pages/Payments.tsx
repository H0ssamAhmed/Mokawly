
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Payment } from "@/types/Payment";
import AddPayment from "@/components/payment/AddPayment";
import { CompanyType } from "@/types/CompanyTypes";
import PaymentItem from "@/components/payment/PaymentItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



interface CompanyPayment extends CompanyType {
  payments: Payment[];
  total: number
}


export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [companies, setCompanies] = useState([]);
  const [showPayments, setShowPayemnts] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categorisedpaymentsByCompany, setCategorisedpaymentsByCompany] = useState<CompanyPayment[]>([]);
  const getCompnaies = useQuery(api.company.getCompanies)
  const getPayments = useQuery(api.payment.getAllPayments)

  useEffect(() => {
    if (getCompnaies) {
      setCompanies(getCompnaies.companies);

    }
    if (getPayments) {
      setPayments(getPayments.payments)
    }
    if (getPayments && getCompnaies) {
      setIsLoading(false);
    }
  }, [getCompnaies, getPayments])



  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)




  // Group payments by company 
  useEffect(() => {
    const paymentsByCompany = companies.map(company => ({
      ...company,
      payments: payments.filter(p => p.companyId === company._id),
      total: payments
        .filter(p => p.companyId === company._id)
        .reduce((sum, p) => sum + p.amount, 0),
    }));
    setCategorisedpaymentsByCompany(paymentsByCompany);
  }, [companies, payments])

  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">المدفوعات</h1>
        <AddPayment companies={companies} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Summary Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المدفوعات المستلمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {isLoading
                ? <Skeleton className="w-1/3 mt-4 h-8 bg-muted-foreground" />
                :
                totalPayments.toLocaleString('ar-SA') + " ر.س"
              }

            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي عدد المدفوعات المستلمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {isLoading
                ? <Skeleton className="w-1/3 mt-4 h-8 bg-muted-foreground" />
                :
                payments.length + " دفعة"
              }
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
            {isLoading
              ? Array.from({ length: 6 }).map((_, indx) => (<Skeleton key={indx} className="w-full mt-4 h-20 bg-muted-foreground " />))
              : categorisedpaymentsByCompany.map((company) => (
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
            {!payments.length &&
              <div className="flex flex-col items-center justify-center gap-4">
                <p>لا يوجد دفعات</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  تسجيل دفعة
                </Button>
              </div>
            }
            {payments && payments
              .sort((a, b) => b._creationTime - a._creationTime)
              .map((payment) => (
                <PaymentItem key={payment._id} payment={payment} companies={companies} />
              ))}
          </div>
        </CardContent>}
      </Card>
    </div>
  );
}
