import { ar } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomDayPicker = ({ OnSelectFn, selectedDate }) => {
  return (
    <div dir="rtl" className="w-fit rounded-lg bg-background  border p-2 shadow-sm mx-auto">
      <DayPicker
        components={{
          Chevron: ({ orientation, ...props }) => (
            <div className="text-2xl cursor-pointer mx-2  props.className">
              {orientation === "right" ?
                <ChevronLeft className="w-8 h-8 p-1 flex  items-center justify-center bg-accent rounded-full" />
                :
                <ChevronRight className="w-8 h-8 p-1 flex  items-center justify-center bg-accent rounded-full" />
              }
            </div>
          ),
        }}
        autoFocus={true}
        mode="single"
        selected={selectedDate}
        onSelect={OnSelectFn}
        locale={ar}
        lang="ar"
        className="py-2 px-8 shadow-sm"

      />
    </div>
  );

}

export default CustomDayPicker