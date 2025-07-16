import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton.js";

const DashboardSkeleton = () => {
  return (
    <div className="p-4 lg:p-6 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">لوحة التحكم</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>المدفوعات و المصروفات</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </CardContent>

      </Card>
      <Card>
        <CardHeader>
          <CardTitle>الدفعات والارباح</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <Skeleton className="h-28 " />
          <Skeleton className="h-28 " />
          <Skeleton className="md:col-span-3 h-28 " />
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardSkeleton