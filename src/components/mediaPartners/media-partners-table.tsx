"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditPartnerDialog } from "./edit-partner-dialog"
import { DeletePartnerDialog } from "./delete-partner-dialog"
import { deleteDocumentWithImage, getDocuments, updateDocumentWithImage } from "@/lib/firebase/crud"

type MediaPartner = {
  id: string
  name: string
  imageUrl: string
}

// This would typically come from your database
const initialPartners: MediaPartner[] = [
]

export function MediaPartnersTable() {
  const fetchPartners = async () => {
    const partners = await getDocuments<MediaPartner>("mediaPartners")
    setPartners(partners)
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const [partners, setPartners] = useState<MediaPartner[]>(initialPartners)

  const handleDelete = async (id: string) => {
    try { 
      await deleteDocumentWithImage("mediaPartners", id, true)
      fetchPartners()
    } catch (error) {
      console.error("Error deleting partner:", error)
    }
  }

  const handleEdit = async (id: string, data: { name: string; file: File | null }) => {
    try {
      await updateDocumentWithImage("mediaPartners", id, { name: data.name }, data.file)
      window.location.reload()
    } catch (error) {
      console.error("Error updating partner:", error)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>name</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell>
                <div className="relative h-[60px] w-[120px]">
                  <Image
                    src={partner.imageUrl || "/placeholder.svg"}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </TableCell>
              <TableCell>{partner.name}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditPartnerDialog partner={partner} onEdit={(data) => handleEdit(partner.id, data)}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </EditPartnerDialog>
                    <DeletePartnerDialog onDelete={() => handleDelete(partner.id)}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DeletePartnerDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

