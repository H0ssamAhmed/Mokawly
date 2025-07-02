import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { ar } from "date-fns/locale";
import { DayPicker } from "react-day-picker";


const CustomDayPicker = ({ OnSelectFn, selectedDate }) => {
  return (
    <div dir="rtl" className="w-fit rounded-lg border p-2 shadow-sm mx-auto">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={OnSelectFn}
        locale={ar}
        className="py-2 px-8 shadow-sm"

      />
    </div>
  );

}

export default CustomDayPicker