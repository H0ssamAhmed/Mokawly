import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React from 'react'
interface Props {
  parentClassName?: string
  className?: string
}
const SpinnerLoader = ({ className, parentClassName }: Props) => {
  return (
    <div className={cn('h-52', parentClassName)}>
      <Loader2 className={cn("animate-spin mx-auto my-5 block", className)} size={100} />
    </div>
  )
}

export default SpinnerLoader