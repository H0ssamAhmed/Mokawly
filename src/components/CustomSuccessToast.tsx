import { cn } from '@/lib/utils'

export const CustomSuccessToast = ({ t, name, amount }) => {
  return (
    <div
      className={cn("bg-background border-border border-2 shadow-lg px-4 py-2 shadow-gray-8 w-72 rounded-lg",
        t.visible ? 'animate-enter' : 'animate-leave'
      )}
    >

      <div className="flex items-start flex-col">
        <p className='mb-4'>تم اضافة المبلغ بنجاح ✅</p>
        <p className="text-sm font-medium">
          بأسم <b>{name}</b>
        </p>
        <p className="mt-2">
          مبلغ وقدرة <b>{amount}</b> ريال سعودي
        </p>
      </div>
    </div>
  )
}
