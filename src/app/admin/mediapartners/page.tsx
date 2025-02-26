'use client'

import { Plus } from "lucide-react"
import { MediaPartnersTable } from "@/components/mediaPartners/media-partners-table"
import { Button } from "@/components/ui/button"
import { CreatePartnerDialog } from "@/components/mediaPartners/create-partner-dialog"
import { useAuth } from '@/contexts/AuthContext';
import AdminNavbar from "@/components/admin/NavbarAdmin"

export default function MediaPartnersPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return <div>Access denied</div>;

  return (
    <div className="container mx-auto py-10 px-10 font-poppins min-h-screen">
      <AdminNavbar></AdminNavbar>
      <div className='py-12'></div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Partners</h1>
          <p className="text-muted-foreground">Manage your media partner logos here.</p>
        </div>
        <CreatePartnerDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </CreatePartnerDialog>
      </div>
      <MediaPartnersTable />
    </div>
  )
}

