import React from 'react'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

const CustomBadge = ({ type }: { type: string }) => {
  return (
    <Badge
      className={cn("text-white hover:",
        type === "عامل" ? "hover:bg-orange-500 bg-orange-500" : "hover:bg-green-700 bg-green-700")}
    >
      {type}
    </Badge>
  )
}

export default CustomBadge