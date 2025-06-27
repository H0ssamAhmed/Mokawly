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

const ExpensesTable = ({ workerExpenses, amountsReceived, totalEarned }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className='bg-muted font-bold text-lg'>
          <TableHead className="w-fit text-start">م</TableHead>
          <TableHead className='text-start'>اليوم</TableHead>
          <TableHead className="w-fit text-start">التاريخ</TableHead>
          <TableHead className='text-start'>المبلغ</TableHead>
          <TableHead className="text-start">ملاحظة</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} >الاجمالي </TableCell>
          <TableCell>{workerExpenses.length + " "}دفعات  </TableCell>
          <TableCell className="text-right text-destructive">
            {amountsReceived + " "}ر.س
          </TableCell>
          <TableCell className="text-right">الباقي {totalEarned - amountsReceived} ر.س</TableCell>
        </TableRow>
      </TableFooter>
    </Table>

  )
}

export default ExpensesTable