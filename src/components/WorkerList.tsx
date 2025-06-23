import { WorkerType } from '@/types/SharedTypes'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Copy, Edit, Flame, Trash, User } from 'lucide-react'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Button } from './ui/button'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api';
import { cn } from '@/lib/utils'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel } from './ui/alert-dialog'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import ReqiureInputSgin from './ReqiureInputSgin'
import { Textarea } from './ui/textarea'
interface Props {
  worker: WorkerType,
  formData: WorkerType,
  setFormData: React.Dispatch<React.SetStateAction<WorkerType | null>>,
}
const WorkerList = ({ worker, setFormData, formData }: Props) => {
  const publishWorkerState = useMutation(api.worker.publishWorker);
  const deleteWorker = useMutation(api.worker.deleteWorker);
  const updateWorkerInfo = useMutation(api.worker.updateWorker);
  const [isUrlCopied, setIsUrlCopied] = React.useState(false);
  const [isEditingWorker, setIsEditingWorker] = React.useState(false);
  const handleEdit = (worker: WorkerType) => {
    setIsEditingWorker(true);
    setFormData({
      name: worker.name,
      dailyWage: Number(worker.dailyWage),
      type: worker.type,
      phone: worker.phone || null,
      note: worker.note || null,
      isPublished: worker.isPublished,
    });
  };

  const handleDelete = (id: string) => {
    deleteWorker({ id }).then(() => {

    })
  }
  const togglePublished = (id: string) => {
    publishWorkerState({ id })
  };

  const handleCopy = async (id: string) => {
    const url = `${location.origin}/worker-summary/${worker._id}?name=${worker.name}&type=${worker.type}`
    setIsUrlCopied(false);
    try {
      await navigator.clipboard.writeText(url);
      setIsUrlCopied(true);
      setTimeout(() => setIsUrlCopied(false), 4000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    };
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkerInfo({ id: worker._id, ...formData })
      .then((res) => {
        toast.success(<p className=''>تم تحديث <span className='text-green-500'>{res.worker.name}</span> بنجاح</p>, {
          duration: 3000,
          icon: "✅",
          style: {
            border: "1px solid hsl(var(--secondary))",
          }
        })
      }).catch((err) => {

        toast.error("حدث خطأ اثناء تعديل البيانات. حاول مرة اخري", {
          duration: 5000,
          icon: "❌",
          style: {
            color: "red"
          }
        })
      })
      .finally(() => {
        setIsEditingWorker(false);
      })

  };

  return (

    <Card key={worker._id}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">{worker.name}</CardTitle>
          </div>
          <Dialog open={isEditingWorker} onOpenChange={setIsEditingWorker} >
            <DialogContent className="max-w-md max-h-screen overflow-y-scroll" dir="rtl">
              <DialogHeader>
                <div className="flex items-start justify-center flex-col gap-2 p-4">
                  <DialogTitle className="text-2xl">
                    تعديل العامل
                  </DialogTitle>
                  <DialogDescription className="text-md">
                    العلامة  <ReqiureInputSgin />  هي مطلوبة

                  </DialogDescription>
                </div>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم <ReqiureInputSgin /></Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="اسم العامل"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyWage">الأجر اليومي ( ريال ) <ReqiureInputSgin /></Label>
                  <Input
                    id="dailyWage"
                    type="number"
                    step="1"
                    value={formData.dailyWage}
                    onChange={(e) => setFormData({ ...formData, dailyWage: Number(e.target.value) })}
                    placeholder="الأجر اليومي مثل 150"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">النوع  <ReqiureInputSgin /></Label>
                  <Select value={formData.type} onValueChange={(value: "عامل" | "صنايعي") => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="عامل">عامل</SelectItem>
                      <SelectItem value="صنايعي">صنايعي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966501234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">ملاحظه عن هذا العامل (اختياري)</Label>
                  <Textarea
                    id="note"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="ملاحظه عن حساب قدم مثلا او شئ اخر"
                  />
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    dir="ltr"
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                  />
                  <Label htmlFor="isPublished">السماح بالوصول لصفحة الملخص</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingWorker(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" className="flex-1">
                    تحديث العامل
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Badge
            variant={worker.type === "صنايعي" ? "default" : "secondary"}
            className={cn("text-white", worker.type === "صنايعي" ? "bg-orange-700" : "bg-green-700")}
          >
            {worker.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-lg font-semibold">
          {worker.dailyWage.toLocaleString('ar-SA')} ر.س/يوم
        </div>

        {worker.phone && (
          <div className="text-sm text-muted-foreground">
            📞 {worker.phone}
          </div>
        )}
        <p className='bg-red-800 w-full p-4 rounded-xl'>{worker.note}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch

              dir='ltr'
              checked={worker.isPublished}
              onCheckedChange={() => togglePublished(worker._id)}
            />
            <span className="text-xs text-muted-foreground">
              ملخص {worker.isPublished ? "عام" : "خاص"}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(worker)}
            className="flex-1"
          >
            <Edit className="mr-1 h-3 w-3" />
            تعديل
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                // 
                className="text-red-600 hover:text-red-700"
              >
                <Trash className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='text-start'>
              <AlertDialogHeader>
                <AlertDialogTitle className='text-start'>هل انت متأكد من حذف <span className=' font-bold'>{worker.name}</span> نهائياً</AlertDialogTitle>
                <AlertDialogDescription className='text-start'>
                  لن تتمكن من استعادة هذا بنياناته مجدداُ
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className='flex items-center justify-end gap-5'>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <Button
                  variant='destructive'
                  onClick={() => handleDelete(worker._id)}
                >حذف</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>

        {worker.isPublished && (
          <div className="text-xs text-muted-foreground pt-1">
            <p>🔗 ملخص الحساب:</p>
            <div className='m-4 p-2 rounded-xl grid grid-cols-12 items-center justify-between border-secondary border-2'>
              <p className='col-span-2 cursor-pointer'>
                <Tooltip delayDuration={0}  >
                  <TooltipTrigger>
                    <Copy onClick={() => handleCopy(worker._id)} />

                  </TooltipTrigger>
                  <TooltipContent className='col-span-2 cursor-pointer'>نسخ الرابط</TooltipContent>

                </Tooltip>
                {/* {`name = ${worker.name}`} */}
              </p>
              <span className='col-span-10 truncate text-end'>
                {`${location.origin}/worker-summary/${worker._id}`}
              </span>
            </div>
            <p className={cn('text-green-600 opacity-0', isUrlCopied && 'opacity-100 animate-scale-in')}>✅ تم نسخ رابط ملخص الحساب بنجاح يمكن ارساله لما تريد </p>

          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WorkerList