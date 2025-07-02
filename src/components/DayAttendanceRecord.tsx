import { WorkerType } from '@/types/SharedTypes'
import React from 'react'
import { Checkbox } from './ui/checkbox'
import CustomBadge from './CustomBadge'

interface Props {
  worker: WorkerType,
  presentWorkers: string[],
  toggleWorkerAttendance: (workerId: string, worker: WorkerType) => void
}
const DayAttendanceRecord = ({ worker, presentWorkers, toggleWorkerAttendance }: Props) => {
  return (
    <div
      onClick={() => toggleWorkerAttendance(worker._id, worker)}

      className="cursor-pointer flex items-center justify-between p-3 border rounded-lg">
      <div
        className="flex items-center space-x-3 space-x-reverse">
        <Checkbox
          id={worker._id}
          checked={presentWorkers.includes(worker._id)}
        />
        <div>
          <label htmlFor={worker._id} className="font-medium cursor-pointer">
            {worker.name}
          </label>
          <CustomBadge type={worker.type} />
        </div>
      </div>
      <div className="text-left">
        <p className="font-semibold">{worker.dailyWage.toLocaleString('ar-SA')} ر.س</p>
        <p className="text-xs text-muted-foreground">أجر يومي</p>
      </div>
    </div>
  )
}

export default DayAttendanceRecord