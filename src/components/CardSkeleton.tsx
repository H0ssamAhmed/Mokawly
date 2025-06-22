import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from './ui/skeleton';

const CardSkeleton = () => {
  return (
    <Card >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          <Skeleton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton />
      </CardContent>
    </Card>
  )
}

export default CardSkeleton