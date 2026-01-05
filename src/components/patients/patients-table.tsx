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
import { Edit2, FileText } from 'lucide-react'
import type { Patient } from '@/lib/types/database'

interface PatientsTableProps {
  patients: Patient[]
  isLoading: boolean
}

export function PatientsTable({ patients, isLoading }: PatientsTableProps) {
  if (isLoading) {
    return <div className="text-center py-10 text-muted-foreground">Loading patients...</div>
  }

  if (patients.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No patients found.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MRN</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-mono text-xs">{patient.mrn}</TableCell>
              <TableCell className="font-medium">
                {patient.last_name}, {patient.first_name}
              </TableCell>
              <TableCell>{new Date(patient.date_of_birth).toLocaleDateString()}</TableCell>
              <TableCell className="capitalize">{patient.gender.replace('_', ' ')}</TableCell>
              <TableCell>
                 <Badge variant="outline">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
