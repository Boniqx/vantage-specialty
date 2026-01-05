'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { getClinicalNotes } from '@/services/clinical-notes'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import type { ClinicalNote } from '@/lib/types/database'
import { NotesList } from '@/components/notes/notes-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function NotesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [notes, setNotes] = useState<ClinicalNote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function loadNotes() {
        setIsLoading(true)
        const data = await getClinicalNotes()
        if (data) setNotes(data as unknown as ClinicalNote[])
        setIsLoading(false)
    }
    loadNotes()
  }, [])

  if (authLoading || !user) return null

  const signedNotes = notes.filter(n => n.is_signed)
  const draftNotes = notes.filter(n => !n.is_signed)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64 transition-all duration-300">
        <TopBar onSpecialtyChange={() => {}} />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Clinical Documentation</h1>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
                <TabsTrigger value="all">All Notes</TabsTrigger>
                <TabsTrigger value="drafts">Drafts ({draftNotes.length})</TabsTrigger>
                <TabsTrigger value="signed">Signed ({signedNotes.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
                <NotesList notes={notes} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="drafts" className="mt-4">
                <NotesList notes={draftNotes} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="signed" className="mt-4">
                <NotesList notes={signedNotes} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
