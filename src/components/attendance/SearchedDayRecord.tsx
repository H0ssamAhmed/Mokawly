import { DilayAttendance } from '@/types/SharedTypes'
import React from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card'

const SearchedDayRecord = ({ recorder }: { recorder: DilayAttendance }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{recorder.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default SearchedDayRecord