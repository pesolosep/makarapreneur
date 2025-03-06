"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FileUpload } from "./file-upload"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  file: z
    .custom<File | null>()
    .refine(
      (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
      "File size must be less than 10MB.",
    )
    .refine(
      (file) => !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Only .jpg, .jpeg, .png and .gif formats are supported.",
    )
    .nullable(),
})

type Sponsor = {
  id: string
  name: string
  imageUrl: string
}

interface EditSponsorDialogProps {
  children: React.ReactNode
  sponsor: Sponsor
  onEdit: (data: { name: string; file: File | null }) => void
}

export function EditSponsorDialog({ children, sponsor, onEdit }: EditSponsorDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: sponsor.name,
      file: null,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onEdit(values)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Sponsor</DialogTitle>
          <DialogDescription>Make changes to the sponsor details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sponsor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <FileUpload value={value} onChange={onChange} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
