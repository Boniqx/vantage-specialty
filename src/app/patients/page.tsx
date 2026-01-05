'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { PatientsTable } from '@/components/patients/patients-table'
import { AddPatientDialog } from '@/components/patients/add-patient-dialog'
import { getPatients } from '@/services/patients'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import type { Patient } from '@/lib/types/database'

export default function PatientsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const loadPatients = async () => {
    setIsLoading(true)
    try {
      const data = await getPatients(searchQuery)
      if (data) setPatients(data as unknown as Patient[])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce search? Or just search on enter? For now, effect on query change.
  useEffect(() => {
    const timer = setTimeout(() => {
        loadPatients()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  if (authLoading || !user) return null

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64 transition-all duration-300">
        <TopBar onSpecialtyChange={() => {}} />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Patient Registry</h1>
            <AddPatientDialog onPatientCreated={loadPatients} />
          </div>

          <div className="flex items-center gap-4">
             <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or MRN..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
             </div>
          </div>

          <PatientsTable patients={patients} isLoading={isLoading} />
        </main>
      </div>
    </div>
  )
}
