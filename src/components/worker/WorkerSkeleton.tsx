import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'

const WorkerSkeleton = () => {
  const isMobile = useIsMobile()
  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">العاملين</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: isMobile ? 4 : 9 }).map(() => (
          <Skeleton className='h-40 ' />
        ))}
      </div>
    </div>
  )
}

export default WorkerSkeleton