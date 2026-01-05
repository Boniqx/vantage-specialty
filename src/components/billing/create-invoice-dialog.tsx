'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash, Loader2, Calculator } from 'lucide-react'
import { getPatients } from '@/services/patients'
import { createInvoice } from '@/services/billing'
import type { Patient } from '@/lib/types/database'

interface CreateInvoiceDialogProps {
  onInvoiceCreated: () => void
}

type LineItem = {
  id: string
  description: string
  quantity: number
  unit_price: number
}

export function CreateInvoiceDialog({ onInvoiceCreated }: CreateInvoiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [patients, setPatients] = useState<Pick<Patient, 'id' | 'first_name' | 'last_name' | 'mrn'>[]>([])
  
  // Form State
  const [patientId, setPatientId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<LineItem[]>([
      { id: '1', description: 'Consultation Fee', quantity: 1, unit_price: 150.00 }
  ])

  useEffect(() => {
    if (open) {
      getPatients().then(data => setPatients(data || []))
      // Default due date: Net 30
      const d = new Date()
      d.setDate(d.getDate() + 30)
      setDueDate(d.toISOString().split('T')[0])
    }
  }, [open])

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, unit_price: 0 }])
  }

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return // Keep at least one
    setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(i => {
        if (i.id === id) {
            return { ...i, [field]: value }
        }
        return i
    }))
  }

  const calculateTotal = () => {
     return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId || items.some(i => !i.description)) return

    setIsLoading(true)
    try {
      await createInvoice({
          patient_id: patientId,
          due_date: dueDate,
          items: items.map(i => ({
              description: i.description,
              quantity: Number(i.quantity),
              unit_price: Number(i.unit_price)
          }))
      })

      setOpen(false)
      onInvoiceCreated()
      
      // Reset
      setPatientId('')
      setItems([{ id: '1', description: 'Consultation Fee', quantity: 1, unit_price: 150.00 }])

    } catch (error) {
      console.error('Failed to create invoice', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Generate an invoice for a patient.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-3">
                <Label>Patient</Label>
                <Select value={patientId} onValueChange={setPatientId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.last_name}, {p.first_name} ({p.mrn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="grid gap-3">
                <Label>Due Date</Label>
                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
             </div>
          </div>

          <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <Label>Line Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                      Add Item
                  </Button>
              </div>
              
              <div className="space-y-2 max-h-[200px] overflow-auto pr-2">
                 {items.map((item) => (
                     <div key={item.id} className="flex gap-2 items-start">
                         <div className="flex-1">
                             <Input 
                                placeholder="Description" 
                                value={item.description} 
                                onChange={e => updateItem(item.id, 'description', e.target.value)}
                                required
                             />
                         </div>
                         <div className="w-20">
                             <Input 
                                type="number" 
                                placeholder="Qty" 
                                min="1"
                                value={item.quantity} 
                                onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                                required
                             />
                         </div>
                         <div className="w-28 relative">
                             <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                             <Input 
                                type="number" 
                                placeholder="Price" 
                                className="pl-7"
                                min="0"
                                step="0.01"
                                value={item.unit_price} 
                                onChange={e => updateItem(item.id, 'unit_price', Number(e.target.value))}
                                required
                             />
                         </div>
                         <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={items.length === 1}
                         >
                             <Trash className="h-4 w-4" />
                         </Button>
                     </div>
                 ))}
              </div>

              <div className="flex justify-end gap-2 items-center text-lg font-bold border-t pt-4">
                   <span>Total:</span>
                   <span>${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
