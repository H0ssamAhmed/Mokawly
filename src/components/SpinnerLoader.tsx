import { Loader2 } from 'lucide-react'
import React from 'react'

const SpinnerLoader = () => {
  return (
    <div className='h-52'>
      <Loader2 className="animate-spin mx-auto my-5 block" size={100} />
    </div>
  )
}

export default SpinnerLoader