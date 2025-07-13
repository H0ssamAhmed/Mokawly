import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import SpinnerLoader from '../SpinnerLoader';
import { useAuth } from '../auth-provider';

const ExpensesTable = ({ workerExpenses, amountsReceived, totalEarned }) => {
  const deleteWorkerExp = useMutation(api.expenses.deleteWorkerExpense)
  const [isDeleteing, setIsDeleteing] = React.useState<boolean>(false)
  const { user } = useAuth()


  const handleDeleteExpense = (id: string) => {
    setIsDeleteing(true)
    deleteWorkerExp({ id })
      .then((res) => {
        if (res.ok) {

          toast.success(res.message, {
            icon: "✅",
            style: {
              border: "1px solid hsl(var(--secondary))",
            }
          })
        }
        if (!res.ok) {
          toast.error(res.message + " حاول مرة اخري", {
            icon: "❌",
            style: {
              border: "1px solid hsl(var(--secondary))",
            }
          })
        }

      })
      .catch((error) => {

      })
      .finally(() => {
        setIsDeleteing(false)
      });

  }
  if (isDeleteing) {
    return (
      <div>
        <SpinnerLoader parentClassName='h-fit' className='h-fit' />
        <p className='text-center'>جاري حذف اليوم</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className='bg-muted font-bold text-lg'>
          <TableHead className="w-fit text-start">م</TableHead>
          <TableHead className='text-start'>اليوم</TableHead>
          <TableHead className="w-fit text-start">التاريخ</TableHead>
          <TableHead className='text-start'>المبلغ</TableHead>
          <TableHead className="text-start">ملاحظة</TableHead>
          {user && <TableHead className="text-start">فعل</TableHead>}
        </TableRow>

      </TableHeader>
      <TableBody>
        {workerExpenses.map((expense, index) => (
          <TableRow key={expense._id}>
            <TableCell >{index + 1}</TableCell>
            <TableCell>{format(expense.date, "EEEE", { locale: ar })}</TableCell>
            <TableCell >{expense.date}</TableCell>
            <TableCell>{expense.amount.toLocaleString() + " " + " "} ريال</TableCell>
            <TableCell className="text-right">{expense.description || "لا يوجد"}</TableCell>
            {user && <TableCell onClick={() => handleDeleteExpense(expense._id)} className="text-center"><Button size='sm' variant='destructive'>حذف</Button></TableCell>}

          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={user ? 3 : 2} >الاجمالي </TableCell>
          <TableCell>{workerExpenses.length + " "}دفعات  </TableCell>
          <TableCell className="text-right text-destructive">
            {amountsReceived + " "}ر.س
          </TableCell>
          <TableCell className="text-right"> الباقي {totalEarned - amountsReceived} ر.س</TableCell>
        </TableRow>
      </TableFooter>
    </Table>

  )
}

export default ExpensesTable