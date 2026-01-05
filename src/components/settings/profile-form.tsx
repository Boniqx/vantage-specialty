'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import { Loader2 } from 'lucide-react'

export function ProfileForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  
  // Form Fields
  const [fullName, setFullName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [license, setLicense] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (user) {
        setLoading(true)
        supabase.from('profiles').select('*').eq('user_id', user.id).single()
        .then(({ data }) => {
            if (data) {
                setProfile(data)
                setFullName(data.full_name || '')
                setSpecialty(data.specialty || 'general')
                setLicense(data.license_number || '')
                setPhone(data.phone || '')
            }
            setLoading(false)
        })
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!user) return

      setLoading(true)
      try {
          const { error } = await supabase.from('profiles').update({
              full_name: fullName,
              specialty,
              license_number: license,
              phone
          }).eq('user_id', user.id)

          if (error) throw error
          alert('Profile updated successfully.')
      } catch (error) {
          console.error('Error updating profile:', error)
          alert('Failed to update profile.')
      } finally {
          setLoading(false)
      }
  }

  if (!profile && loading) return <Loader2 className="h-6 w-6 animate-spin" />

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ''} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                    id="full_name" 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    required 
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="general">General Medicine</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="license">Medical License Number</Label>
                <Input 
                    id="license" 
                    value={license} 
                    onChange={e => setLicense(e.target.value)} 
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                    id="phone" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                />
            </div>
        </div>

        <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
    </form>
  )
}
