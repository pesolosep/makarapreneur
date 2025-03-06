'use client'

import { Plus } from "lucide-react"
import { MediaPartnersTable } from "@/components/sponsors/media-partners-table"
import { Button } from "@/components/ui/button"
import { CreateSponsorDialog } from "@/components/sponsors/create-sponsor-dialog"
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
          <h1 className="text-3xl font-bold tracking-tight">Sponsors</h1>
          <p className="text-muted-foreground">Manage your sponsors here.</p>
        </div>
        <CreateSponsorDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Sponsor
          </Button>
        </CreateSponsorDialog>
      </div>
      <MediaPartnersTable />
    </div>
  )
}

