import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  nominal: z.coerce
    .number()
    .min(500000, "Minimal setoran Rp500.000"),

  tanggal: z
    .date({
      required_error: "Tanggal wajib diisi",
    })
    .refine((date) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date <= today
    }, {
      message: "Tanggal tidak boleh lebih dari hari ini",
    }),

  bukti: z
    .any()
    .refine((file) => file instanceof File, "Bukti pembayaran wajib diupload"),

  catatan: z.string().optional(),
})


// ================= COMPONENT =================
export const ModalSetorTabungan = ({ open, setOpen }) => {
  const [preview, setPreview] = useState(null)

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nominal: "",
      tanggal: new Date(),
      bukti: null,
      catatan: "",
    },
  })

  const onSubmit = (values) => {
    const data = new FormData()
    data.append("nominal", values.nominal)
    data.append("tanggal", values.tanggal.toISOString())
    data.append("bukti", values.bukti)
    data.append("catatan", values.catatan || "")

    console.log("SUBMIT", Object.fromEntries(data))
    setOpen(false)
  }

  const removeImage = () => {
    setPreview(null)
    form.setValue("bukti", null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md h-[90vh] flex flex-col">
        <DialogHeader className="sticky top-0 z-10 border-b pb-3">
          <DialogTitle>Setor Tabungan Umroh</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Pastikan data yang Anda kirimkan benar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 p-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >

              <FormField
                control={form.control}
                name="nominal"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-muted-foreground">Nominal Setoran</Label>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Minimal 500000"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground italic">
                      Nominal harus sama dengan bukti transfer
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tanggal"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-muted-foreground">Tanggal Pembayaran</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(field.value, "dd MMM yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date > today
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bukti"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-muted-foreground">Upload Bukti Pembayaran</Label>
                    {!preview && (
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          field.onChange(file)
                          setPreview(URL.createObjectURL(file))
                        }}
                      />
                    )}

                    {preview && (
                      <div className="relative border rounded-md overflow-hidden">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full object-contain max-h-64"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="catatan"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-muted-foreground">Catatan (Opsional)</Label>
                    <FormControl>
                      <Input placeholder="Contoh: setoran bulan Januari" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

            </form>
          </Form>
        </div>

        <DialogFooter className="border-t pt-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            Kirim Setoran
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
