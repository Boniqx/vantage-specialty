'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stethoscope } from 'lucide-react'
import type { Specialty } from '@/lib/types/database'

const specialties: { value: Specialty; label: string; description: string; color: string }[] = [
  { 
    value: 'cardiology', 
    label: 'Cardiology', 
    description: 'Heart & Cardiovascular',
    color: 'bg-red-500'
  },
  { 
    value: 'general', 
    label: 'General Medicine', 
    description: 'Primary Care',
    color: 'bg-blue-500'
  },
  { 
    value: 'pediatrics', 
    label: 'Pediatrics', 
    description: 'Children & Adolescents',
    color: 'bg-green-500'
  },
  { 
    value: 'neurology', 
    label: 'Neurology', 
    description: 'Brain & Nervous System',
    color: 'bg-purple-500'
  },
  { 
    value: 'orthopedics', 
    label: 'Orthopedics', 
    description: 'Bones & Joints',
    color: 'bg-orange-500'
  },
  { 
    value: 'dermatology', 
    label: 'Dermatology', 
    description: 'Skin Conditions',
    color: 'bg-pink-500'
  },
]

interface SpecialtySelectorProps {
  value: Specialty
  onChange: (value: Specialty) => void
  className?: string
}

export function SpecialtySelector({ value, onChange, className }: SpecialtySelectorProps) {
  const selectedSpecialty = specialties.find(s => s.value === value)

  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-11 bg-muted/30">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select Specialty">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${selectedSpecialty?.color}`} />
                <span>{selectedSpecialty?.label}</span>
              </div>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {specialties.map((specialty) => (
            <SelectItem key={specialty.value} value={specialty.value}>
              <div className="flex items-center gap-3 py-1">
                <div className={`h-2.5 w-2.5 rounded-full ${specialty.color}`} />
                <div>
                  <div className="font-medium">{specialty.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {specialty.description}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
