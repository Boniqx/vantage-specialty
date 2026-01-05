'use client'

import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { createPatient } from '@/services/patients'

interface AddPatientDialogProps {
  onPatientCreated: () => void
}

export function AddPatientDialog({ onPatientCreated }: AddPatientDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form State
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('prefer_not_to_say')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  // Auto-generate MRN placeholder
  const [mrn, setMrn] = useState(`MRN-${Date.now().toString().slice(-6)}`)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createPatient({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dob,
        gender,
        mrn,
        phone,
        email
      })
      
      setOpen(false)
      onPatientCreated()
      
      // Reset form
      setFirstName('')
      setLastName('')
      setDob('')
      setPhone('')
      setEmail('')
      setMrn(`MRN-${Date.now().toString().slice(-6)}`)
    } catch (error) {
       console.error(error)
       alert('Failed to create patient')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>
            Enter patient demographics to create a new record.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
               <Label htmlFor="dob">Date of Birth</Label>
               <Input id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} required />
             </div>
             <div className="grid gap-2">
               <Label htmlFor="gender">Gender</Label>
               <Select value={gender} onValueChange={setGender}>
                 <SelectTrigger>
                   <SelectValue placeholder="Select gender" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="male">Male</SelectItem>
                   <SelectItem value="female">Female</SelectItem>
                   <SelectItem value="other">Other</SelectItem>
                   <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mrn">MRN (Medical Record Number)</Label>
            <Input id="mrn" value={mrn} onChange={e => setMrn(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
               <Label htmlFor="phone">Phone</Label>
               <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-2">
               <Label htmlFor="email">Email</Label>
               <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
