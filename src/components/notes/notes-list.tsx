'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Lock, Edit3 } from 'lucide-react'
import type { ClinicalNote } from '@/lib/types/database'
import { cn } from '@/lib/utils'

interface NotesListProps {
  notes: ClinicalNote[]
  isLoading: boolean
}

export function NotesList({ notes, isLoading }: NotesListProps) {
  if (isLoading) {
    return <div className="text-center py-10 text-muted-foreground">Loading notes...</div>
  }

  if (notes.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No clinical notes found.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map((note) => {
             const patient = (note as any).patient
             const isSigned = note.is_signed
             const date = new Date(note.created_at).toLocaleDateString()

             return (
                <TableRow key={note.id}>
                <TableCell className="font-medium">{date}</TableCell>
                <TableCell>
                    {patient ? `${patient.last_name}, ${patient.first_name}` : 'Unknown'}
                    <div className="text-xs text-muted-foreground">{patient?.mrn}</div>
                </TableCell>
                <TableCell className="capitalize">{note.specialty}</TableCell>
                <TableCell>
                    <Badge variant={isSigned ? 'secondary' : 'outline'} className={cn(
                        "flex w-fit items-center gap-1",
                        isSigned ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "text-amber-600 border-amber-600/50"
                    )}>
                        {isSigned ? <Lock className="h-3 w-3" /> : <Edit3 className="h-3 w-3" />}
                        {isSigned ? 'Signed' : 'Draft'}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                        {isSigned ? 'View' : 'Resume'}
                    </Button>
                </TableCell>
                </TableRow>
             )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
