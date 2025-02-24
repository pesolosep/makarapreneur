"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { ImageIcon, UploadCloud } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: File | null
  onChange?: (file: File | null) => void
}

export function FileUpload({ value, onChange, className }: FileUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null)

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onChange?.(file)
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
      }
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
  })

  React.useEffect(() => {
    // Cleanup preview URL when component unmounts
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-50/50",
        isDragActive && "border-primary bg-primary/10",
        className,
      )}
    >
      <input {...getInputProps()} />
      {preview || value ? (
        <div className="relative h-full w-full">
          <Image
            src={preview || (value instanceof File ? URL.createObjectURL(value) : value || "")}
            alt="Preview"
            fill
            className="object-contain p-4"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-white text-sm">Click or drag to replace</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
          {isDragActive ? (
            <>
              <UploadCloud className="h-10 w-10 text-primary" />
              <p className="text-sm text-primary">Drop the file here</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-500">Drag and drop or click to upload logo</p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

