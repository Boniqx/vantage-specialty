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
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Loader2 } from 'lucide-react'
import { getPatients } from '@/services/patients'
import { createAppointment } from '@/services/appointments'
import { useAuth } from '@/components/auth-provider'
import type { Patient, AppointmentType, Specialty } from '@/lib/types/database'

interface NewAppointmentDialogProps {
  onAppointmentCreated: () => void
  providerId: string
}

export function NewAppointmentDialog({ onAppointmentCreated, providerId }: NewAppointmentDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [patients, setPatients] = useState<Pick<Patient, 'id' | 'first_name' | 'last_name' | 'mrn'>[]>([])
  
  // Form State
  const [patientId, setPatientId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState<AppointmentType>('follow_up')
  const [specialty, setSpecialty] = useState<Specialty>('general')
  const [complaint, setComplaint] = useState('')

  useEffect(() => {
    if (open) {
      // Load patients when dialog opens
      getPatients().then(data => setPatients(data || []))
      // Set default date to today
      const today = new Date().toISOString().split('T')[0]
      setDate(today)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!providerId || !patientId || !date || !time) return

    setIsLoading(true)
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString()
      
      await createAppointment({
        patient_id: patientId,
        provider_id: providerId, // Use the prop ID (Profile ID)
        scheduled_at: scheduledAt,
        duration_minutes: 30, // Default
        appointment_type: type,
        specialty: specialty,
        chief_complaint: complaint,
        status: 'scheduled'
      })

      setOpen(false)
      onAppointmentCreated()
      
      // Reset form
      setPatientId('')
      setComplaint('')
    } catch (error) {
      console.error('Failed to create appointment', error)
      alert('Failed to create appointment')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogDescription>
            Create a new appointment for a patient.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label htmlFor="patient">Patient</Label>
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

          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-3">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required 
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                type="time" 
                value={time} 
                onChange={e => setTime(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="grid gap-3">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as AppointmentType)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="new_patient">New Patient</SelectItem>
                        <SelectItem value="follow_up">Follow Up</SelectItem>
                        <SelectItem value="annual_exam">Annual Exam</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="grid gap-3">
                <Label htmlFor="specialty">Specialty</Label>
                 <Select value={specialty} onValueChange={(v) => setSpecialty(v as Specialty)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="general">Select Specialty</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="complaint">Chief Complaint</Label>
            <Textarea 
              id="complaint" 
              placeholder="Reason for visit..." 
              value={complaint}
              onChange={e => setComplaint(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
