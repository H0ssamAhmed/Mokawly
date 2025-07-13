import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Settings, Trash2Icon } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { format } from 'date-fns';

const JobExpensesCard = ({ expense }) => {
  const deleteJobExp = useMutation(api.expenses.deleteJobExpense)

  const handleDelteJobExpense = (id: string) => {
    // const isOk = confirm("هل تريد حذف هذا المصروف؟")
    // if (isOk) {
    deleteJobExp({ id })
    //   return
    // }
  }

  return (
    <Card key={expense._id} className='w-72'>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">{expense.type}</CardTitle>
          </div>
          <span className="text-lg font-bold text-red-600">
            {expense.amount.toLocaleString('ar-SA')} ر.س
          </span>
        </div>
      </CardHeader>
      <CardContent dir='rtl'>
        <p className="text-sm text-muted-foreground line-clamp-2  my-2">
          {expense.description}
        </p>
        <div className="flex justify-between items-center mt-5"
          onClick={() => handleDelteJobExpense(expense._id)}>
          <p className="text-sm flex gap-2 text-white cursor-pointer bg-red-500 hover:bg-red-700 transition px-4 py-2 rounded-md items-center text-muted-foreground">
            <Trash2Icon className="h-4 w-4" />
            حذف
          </p>
          <p className="text-md text-muted-foreground">
            {format(new Date(expense.date), "dd/MM/yyyy")}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default JobExpensesCard