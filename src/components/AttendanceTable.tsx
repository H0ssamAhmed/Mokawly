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
import { Button } from './ui/button';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import SpinnerLoader from './SpinnerLoader';
import { AttendanceRecord } from '@/types/SharedTypes';
import toast from 'react-hot-toast';
import { useAuth } from './auth-provider';

const AttendanceTable = ({ worker, workerAttendance, totalEarned }) => {
  const deleteAttendanceAction = useMutation(api.attendance.deleteAttendance);
  const [isDeleteing, setIsDeleteing] = React.useState<boolean>(false)
  const { user } = useAuth()
  const handleDeleteDay = (id: string) => {
    setIsDeleteing(true)
    deleteAttendanceAction({ id })
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
          <TableHead className='text-start'>الاجر</TableHead>
          <TableHead className="text-start">ملاحظة</TableHead>
          {user && <TableHead className="text-center">فعل</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {workerAttendance.map((record: AttendanceRecord, index: number) => (
          <TableRow key={record._id}>
            <TableCell >{index + 1}</TableCell>
            <TableCell>{format(record.date, "EEEE", { locale: ar })}</TableCell>
            <TableCell >{record.date}</TableCell>
            <TableCell>{record.dailyWage.toLocaleString() + " " + " "} ر.س/يوم</TableCell>
            <TableCell className="text-right">{record.note || "لا يوجد"}</TableCell>
            {user && <TableCell onClick={() => handleDeleteDay(record._id)} className="text-center"><Button size='sm' variant='destructive'>حذف</Button></TableCell>}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={user ? 3 : 2}>الاجمالي </TableCell>
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