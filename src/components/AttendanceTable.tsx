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

const AttendanceTable = ({ worker, workerAttendance, totalEarned }) => {
  return (
    <Table>

      <TableHeader>
        <TableRow className='bg-muted font-bold text-lg'>
          <TableHead className="w-fit text-start">م</TableHead>
          <TableHead className='text-start'>اليوم</TableHead>
          <TableHead className="w-fit text-start">التاريخ</TableHead>
          <TableHead className='text-start'>الاجر</TableHead>
          <TableHead className="text-start">ملاحظة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workerAttendance.map((record, index) => (
          <TableRow key={record._id}>
            <TableCell >{index + 1}</TableCell>
            <TableCell>{format(record.date, "EEEE", { locale: ar })}</TableCell>
            <TableCell >{record.date}</TableCell>
            <TableCell>{record.dailyWage.toLocaleString() + " " + " "} ر.س/يوم</TableCell>
            <TableCell className="text-right">{record.note || "لا يوجد"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>الاجمالي </TableCell>
          <TableCell >  {workerAttendance.length + " "}ايام </TableCell>
          <TableCell colSpan={2} className="text-right text-green-600">
            <span>
              {workerAttendance.length + " "}ايام
            </span>
            <span>{` * `}</span>
            <span>{worker.dailyWage}</span>
            <span>{`  =  `}</span>
            {totalEarned.toLocaleString() + " "}ر.س
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default AttendanceTable