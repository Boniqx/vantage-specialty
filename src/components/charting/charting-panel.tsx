'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Save, 
  Send, 
  Clock, 
  User,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react'
import { SpecialtySelector } from './specialty-selector'
import { SOAPTabs } from './soap-tabs'
import type { Specialty, VitalSigns, Patient } from '@/lib/types/database'

interface ChartingPanelProps {
  patient?: Patient
  appointmentId?: string
  providerId?: string
  initialSpecialty?: Specialty
  initialData?: ChartingData
  onSave?: (data: ChartingData) => Promise<any>
  onSign?: (data: ChartingData) => Promise<any>
}

export interface ChartingData {
  specialty: Specialty
  subjective: {
    chief_complaint: string
    history_of_present_illness: string
    past_medical_history: string
    family_history: string
    social_history: string
    allergies: string[]
    review_of_systems: Record<string, unknown>
  }
  objective: {
    vital_signs: VitalSigns
    physical_exam: Record<string, unknown>
  }
  assessment: {
    clinical_impression: string
    diagnoses: Array<{ icd10_code: string; description: string; is_primary: boolean }>
    differential_diagnoses: string[]
  }
  plan: {
    treatment_plan: string
    follow_up_instructions: string
    patient_education: string
  }
}

const defaultData: ChartingData = {
  specialty: 'general',
  subjective: {
    chief_complaint: '',
    history_of_present_illness: '',
    past_medical_history: '',
    family_history: '',
    social_history: '',
    allergies: [],
    review_of_systems: {},
  },
  objective: {
    vital_signs: {},
    physical_exam: {},
  },
  assessment: {
    clinical_impression: '',
    diagnoses: [],
    differential_diagnoses: [],
  },
  plan: {
    treatment_plan: '',
    follow_up_instructions: '',
    patient_education: '',
  },
}

// Demo patient for display
const demoPatient: Patient = {
  id: 'demo-patient-id',
  mrn: 'MRN-20240101-0001',
  first_name: 'John',
  last_name: 'Doe',
  date_of_birth: '1985-03-15',
  gender: 'male',
  email: 'john.doe@email.com',
  phone: '555-0101',
  insurance_provider: 'Blue Cross Blue Shield',
  insurance_policy_number: 'BCBS-123456',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export function ChartingPanel({ 
  patient = demoPatient, 
  initialSpecialty = 'general',
  initialData,
  onSave,
  onSign 
}: ChartingPanelProps) {
  const [data, setData] = useState<ChartingData>(initialData || {
    ...defaultData,
    specialty: initialSpecialty,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleSpecialtyChange = (specialty: Specialty) => {
    setData(prev => ({
      ...prev,
      specialty,
      // Reset specialty-specific fields when changing specialty
      subjective: {
        ...prev.subjective,
        review_of_systems: {},
      },
      objective: {
        ...prev.objective,
        physical_exam: {},
      },
    }))
  }

  const handleSectionChange = (section: string, sectionData: unknown) => {
    setData(prev => ({
      ...prev,
      [section]: sectionData,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave(data)
      }
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSign = async () => {
    setIsSaving(true)
    try {
      if (onSign) {
        await onSign(data)
      }
    } catch (error) {
      console.error('Error signing note:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="flex flex-col h-full">
      {/* Patient Header */}
      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {patient.first_name[0]}{patient.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    {patient.first_name} {patient.last_name}
                  </h2>
                  <Badge variant="outline" className="font-mono text-xs">
                    {patient.mrn}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {calculateAge(patient.date_of_birth)} y/o {patient.gender}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Allergies: {patient.allergies.join(', ')}
                  </span>
                </div>
              )}
              
              <SpecialtySelector 
                value={data.specialty} 
                onChange={handleSpecialtyChange}
                className="w-48"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Charting Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-0 pt-4 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Clinical Note
              <Badge variant="secondary" className="ml-2">
                {data.specialty.charAt(0).toUpperCase() + data.specialty.slice(1)}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              
              <Button 
                size="sm"
                onClick={handleSign}
                disabled={isSaving}
              >
                <Send className="h-4 w-4 mr-2" />
                Sign & Close
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <Separator className="my-4" />
        
        <CardContent className="flex-1 overflow-hidden px-6 pb-6">
          <SOAPTabs
            specialty={data.specialty}
            data={data}
            onChange={handleSectionChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}
