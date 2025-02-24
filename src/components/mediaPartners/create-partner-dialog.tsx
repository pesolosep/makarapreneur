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
import { FileUpload } from "@/components/mediaPartners/file-upload"
import { createDocumentWithImage } from "@/lib/firebase/crud"
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  file: z
    .custom<File>()
    .refine((file) => file instanceof File, "Logo is required.")
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 10MB.")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Only .jpg, .jpeg, .png and .gif formats are supported.",
    ),
})

export function CreatePartnerDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createDocumentWithImage("mediaPartners", {
        name: values.title,
      }, values.file)
      console.log("Partner created successfully")
    } catch (error) {
      console.error("Error creating partner:", error)
    }
    window.location.reload()

    console.log("Submitting:", values)
    setOpen(false)
    form.reset()
    
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Media Partner</DialogTitle>
          <DialogDescription>Add a new media partner logo to your dashboard.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter partner name" {...field} />
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
              <Button type="submit">Add Partner</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

