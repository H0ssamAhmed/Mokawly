import React from 'react'
import { WorkerType } from '@/types/SharedTypes'
interface Props {
  worker: WorkerType
  presentWorkers: string[]
}
const WorkerAttendanceCard = ({ worker, presentWorkers }: Props) => {
  return (
    <div key={worker._id} className="flex items-center justify-between p-3 border rounded-lg">
      {/* <div className="flex items-center space-x-3 space-x-reverse">
        <Checkbox
          id={worker._id}
          checked={presentWorkers.includes(worker._id)}
          onCheckedChange={() => toggleWorkerAttendance(worker._id, worker)}
        />
        <div>
          <label htmlFor={worker._id} className="font-medium cursor-pointer">
            {worker.name}
          </label>
          <Badge
            variant={worker.type === "صنايعي" ? "default" : "secondary"}
            className={cn("text-white mx-4", worker.type === "صنايعي" ? "bg-orange-700" : "bg-green-700")}
          >
            {worker.type}
          </Badge>
        </div>
      </div>
      <div className="text-left">
        <p className="font-semibold">{worker.dailyWage.toLocaleString('ar-SA')} ر.س</p>
        <p className="text-xs text-muted-foreground">أجر يومي</p>
      </div> */}
    </div>
  )
}

export default WorkerAttendanceCard