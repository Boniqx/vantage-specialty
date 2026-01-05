'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { ChartingPanel } from '@/components/charting/charting-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Calendar,
  Clock,
  Users,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react'
import type { Specialty, Appointment, Patient } from '@/lib/types/database'
import { getDailyAppointments } from '@/services/appointments'
import { getDashboardStats } from '@/services/stats'
import { createClinicalNote, updateClinicalNote, getNoteByAppointmentId } from '@/services/clinical-notes'
import type { ChartingData } from '@/components/charting/charting-panel'
import type { ClinicalNote } from '@/lib/types/database'
import { NewAppointmentDialog } from '@/components/appointments/new-appointment-dialog'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const statusConfig = {
  scheduled: { label: 'Scheduled', variant: 'secondary' as const, icon: Clock },
  confirmed: { label: 'Confirmed', variant: 'outline' as const, icon: CheckCircle2 },
  checked_in: { label: 'Checked In', variant: 'default' as const, icon: CheckCircle2 },
  in_progress: { label: 'In Progress', variant: 'default' as const, icon: FileText },
  completed: { label: 'Completed', variant: 'secondary' as const, icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: AlertCircle },
  no_show: { label: 'No Show', variant: 'destructive' as const, icon: AlertCircle },
}

const specialtyColors: Record<string, string> = {
  cardiology: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  general: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pediatrics: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  neurology: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  orthopedics: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  dermatology: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
}

// Status config (kept)

export default function DashboardPage() {
  const { user, isLoading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [providerProfile, setProviderProfile] = useState<any>(null)

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState({
    todaysPatients: 0,
    unsignedNotes: 0,
    messages: 0,
    weeklyTrend: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | undefined>(undefined)
  const [currentSpecialty, setCurrentSpecialty] = useState<Specialty>('general')
  const [activeNoteId, setActiveNoteId] = useState<string | undefined>(undefined)
  const [chartingInitialData, setChartingInitialData] = useState<ChartingData | undefined>(undefined)

  const loadDashboardData = useCallback(async () => {
      try {
        setIsLoading(true)
        const today = new Date()
        
        // Fetch appointments and stats in parallel
        const [appointmentsData, statsData] = await Promise.all([
          getDailyAppointments(today),
          getDashboardStats()
        ])

        if (appointmentsData) {
          setAppointments(appointmentsData as unknown as Appointment[])
        }
        
        setStats(statsData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // Auth Protection & Profile Fetch
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
    
    if (user) {
        // Query by user_id FK, not PK
        supabase.from('profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
            if (data) setProviderProfile(data)
        })
    }
  }, [user, authLoading, router])

  if (authLoading || !user || !providerProfile) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
  }

  const handleSpecialtyChange = (specialty: Specialty) => {
    setCurrentSpecialty(specialty)
  }

  const handleStartCharting = async (patient: Patient, appointmentId: string, specialty: Specialty) => {
    // Check for existing note
    const existingNote = await getNoteByAppointmentId(appointmentId) as ClinicalNote | null
    
    if (existingNote) {
        setActiveNoteId(existingNote.id)
        // Map DB note to ChartingData
        setChartingInitialData({
            specialty: existingNote.specialty,
            subjective: {
                chief_complaint: existingNote.chief_complaint || '',
                history_of_present_illness: existingNote.history_of_present_illness || '',
                past_medical_history: existingNote.past_medical_history || '',
                family_history: existingNote.family_history || '',
                social_history: existingNote.social_history || '',
                allergies: existingNote.allergies || [],
                review_of_systems: existingNote.review_of_systems as Record<string, unknown> || {},
            },
            objective: {
                vital_signs: existingNote.vital_signs as any || {},
                physical_exam: existingNote.physical_exam as Record<string, unknown> || {},
            },
            assessment: {
                clinical_impression: existingNote.clinical_impression || '',
                diagnoses: existingNote.diagnoses as any || [],
                differential_diagnoses: existingNote.differential_diagnoses || [],
            },
            plan: {
                treatment_plan: existingNote.treatment_plan || '',
                follow_up_instructions: existingNote.follow_up_instructions || '',
                patient_education: existingNote.patient_education || '',
            }
        })
    } else {
        setActiveNoteId(undefined)
        setChartingInitialData(undefined)
    }

    setSelectedPatient(patient)
    setSelectedAppointmentId(appointmentId)
    setCurrentSpecialty(specialty)
  }

  const handleSaveNote = async (data: ChartingData) => {
    if (!selectedPatient || !providerProfile?.id) {
         console.error("Missing patient or provider profile")
         return undefined
    }

    try {
      let noteId = activeNoteId

      if (noteId) {
        // Update existing note
        await updateClinicalNote(noteId, {
            specialty: data.specialty,
            chief_complaint: data.subjective.chief_complaint,
            history_of_present_illness: data.subjective.history_of_present_illness,
            review_of_systems: data.subjective.review_of_systems,
            past_medical_history: data.subjective.past_medical_history,
            family_history: data.subjective.family_history,
            social_history: data.subjective.social_history,
            allergies: data.subjective.allergies,
            vital_signs: data.objective.vital_signs,
            physical_exam: data.objective.physical_exam,
            clinical_impression: data.assessment.clinical_impression,
            diagnoses: data.assessment.diagnoses,
            differential_diagnoses: data.assessment.differential_diagnoses,
            treatment_plan: data.plan.treatment_plan,
            follow_up_instructions: data.plan.follow_up_instructions,
            patient_education: data.plan.patient_education,
        })
      } else {
        // Create new note
        const newNote = await createClinicalNote({
            patient_id: selectedPatient.id,
            provider_id: providerProfile.id, // Use the profile ID, not Auth User ID
            appointment_id: selectedAppointmentId,
            specialty: data.specialty,
            chief_complaint: data.subjective.chief_complaint,
            history_of_present_illness: data.subjective.history_of_present_illness,
            review_of_systems: data.subjective.review_of_systems,
            past_medical_history: data.subjective.past_medical_history,
            family_history: data.subjective.family_history,
            social_history: data.subjective.social_history,
            allergies: data.subjective.allergies,
            vital_signs: data.objective.vital_signs,
            physical_exam: data.objective.physical_exam,
            clinical_impression: data.assessment.clinical_impression,
            diagnoses: data.assessment.diagnoses,
            differential_diagnoses: data.assessment.differential_diagnoses,
            treatment_plan: data.plan.treatment_plan,
            follow_up_instructions: data.plan.follow_up_instructions,
            patient_education: data.plan.patient_education,
        })
        if (newNote) {
            noteId = newNote.id
            setActiveNoteId(newNote.id)
        }
      }
      return noteId
    } catch (error) {
      console.error('Failed to save note:', error)
      alert("Failed to save note. Please check console for details.")
      throw error
    }
  }

  const handleSignNote = async (data: ChartingData) => {
    try {
        const noteId = await handleSaveNote(data)
        if (noteId) {
            await updateClinicalNote(noteId, { is_signed: true })
            alert("Clinical note signed and locked successfully.")
            // Ideally navigate back or lock form
        }
    } catch (error) {
        console.error('Failed to sign note:', error)
        alert("Failed to sign note.")
    }
  }

  // Format time helper
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="pl-64 transition-all duration-300">
          <TopBar onSpecialtyChange={handleSpecialtyChange} />
          <main className="p-6">
            <div className="mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                   setSelectedPatient(null)
                   setSelectedAppointmentId(undefined)
                   setActiveNoteId(undefined)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Dashboard
              </Button>
            </div>
            <ChartingPanel 
                patient={selectedPatient}
                appointmentId={selectedAppointmentId}
                initialSpecialty={currentSpecialty}
                initialData={chartingInitialData}
                onSave={handleSaveNote}
                onSign={handleSignNote}
             />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64 transition-all duration-300">
        <TopBar onSpecialtyChange={handleSpecialtyChange} />
        
        <main className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Good Morning, Dr. {providerProfile?.last_name || 'User'}
                  </h1>
                  <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
                    Sign Out
                  </Button>
              </div>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <NewAppointmentDialog 
              onAppointmentCreated={loadDashboardData} 
              providerId={providerProfile.id}
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todaysPatients}</div>
                <p className="text-xs text-muted-foreground">
                    Scheduled for today
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unsigned Notes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.unsignedNotes > 0 ? 'text-amber-600' : ''}`}>
                    {stats.unsignedNotes}
                </div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.messages}</div>
                <p className="text-xs text-muted-foreground">New messages</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.weeklyTrend}</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today&apos;s Schedule
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View Full Schedule
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
              ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                      No appointments scheduled for today.
                  </div>
              ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Time</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Specialty</TableHead>
                        <TableHead>Chief Complaint</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {appointments.map((appointment) => {
                        const patient = appointment.patient as unknown as Patient
                        const status = statusConfig[appointment.status as keyof typeof statusConfig]
                        const StatusIcon = status?.icon || Clock
                        const specialty = (appointment.specialty as Specialty) || 'general'
                        
                        return (
                        <TableRow key={appointment.id}>
                            <TableCell className="font-medium">
                            {formatTime(appointment.scheduled_at)}
                            </TableCell>
                            <TableCell className="font-medium">
                            {patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown'}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                            {patient?.mrn || '-'}
                            </TableCell>
                            <TableCell>{appointment.appointment_type}</TableCell>
                            <TableCell>
                            <Badge className={specialtyColors[specialty] || specialtyColors.general} variant="secondary">
                                {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-[200px] truncate">
                            {appointment.chief_complaint}
                            </TableCell>
                            <TableCell>
                            <Badge variant={status?.variant || 'secondary'} className="flex items-center gap-1 w-fit">
                                <StatusIcon className="h-3 w-3" />
                                {status?.label || appointment.status}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                            <Button 
                                size="sm" 
                                variant={appointment.status === 'in_progress' ? 'default' : 'outline'}
                                onClick={() => handleStartCharting(patient, appointment.id, specialty)}
                            >
                                {appointment.status === 'in_progress' ? 'Continue' : 'Start Chart'}
                            </Button>
                            </TableCell>
                        </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => router.push('/patients')}
            >
              <CardContent className="flex items-center gap-4 py-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Patient Registry</h3>
                  <p className="text-sm text-muted-foreground">Search and manage patients</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Pending Notes</h3>
                  <p className="text-sm text-muted-foreground">{stats.unsignedNotes} unsigned clinical notes</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Reports</h3>
                  <p className="text-sm text-muted-foreground">View analytics & insights</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
