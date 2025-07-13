import { Payment } from '@/types/Payment'
import { format } from 'date-fns'
import { Settings, Trash } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import toast from 'react-hot-toast'
import { CompanyType } from '@/types/CompanyTypes'
interface Props {
  payment: Payment
  companies: CompanyType[]
}
const PaymentItem = ({ payment, companies }: Props) => {
  const deleteAPayment = useMutation(api.payment.deletePayment)
  const deletePayment = (id: string) => {
    deleteAPayment({ id })
      .then(() => {
        toast.success("تم حذف الدفعة بنجاح")
      })
  }
  const name = companies.find((company) => company._id === payment.companyId)?.name

  return (
    <div key={payment._id} className="flex justify-between items-start p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">{name}</h3>
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
  )
}

export default PaymentItem