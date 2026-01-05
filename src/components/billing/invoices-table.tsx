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
import { MoreHorizontal, Download, CreditCard } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Invoice } from '@/lib/types/database'

interface InvoicesTableProps {
  invoices: Invoice[]
  isLoading?: boolean
}

export function InvoicesTable({ invoices, isLoading }: InvoicesTableProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
        case 'paid': return 'default' // primary
        case 'draft': return 'secondary'
        case 'sent': return 'outline'
        case 'overdue': return 'destructive'
        case 'cancelled': return 'secondary'
        default: return 'outline'
    }
  }

  if (isLoading) {
      return <div>Loading invoices...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Issued Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
              <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      No invoices found.
                  </TableCell>
              </TableRow>
          ) : (
             invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-xs">
                      {invoice.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                      {invoice.patient ? (
                          <div className="flex flex-col">
                              <span className="font-medium">{invoice.patient.last_name}, {invoice.patient.first_name}</span>
                              <span className="text-xs text-muted-foreground">{invoice.patient.mrn}</span>
                          </div>
                      ) : 'Unknown'}
                  </TableCell>
                  <TableCell>
                      <Badge variant={getStatusColor(invoice.status) as any}>
                          {invoice.status.toUpperCase()}
                      </Badge>
                  </TableCell>
                  <TableCell>
                      ${invoice.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                      {new Date(invoice.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Record Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
             ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
