import { Database } from 'lucide-react'
import React from 'react'

const EmptyData = () => {
  return (
    <div className='flex items-center justify-center flex-col gap-5 p-4'>
      <Database size={80} />
      <h1 className='text-text'>لا يوجد بيانات</h1>

    </div>
  )
}

export default EmptyData