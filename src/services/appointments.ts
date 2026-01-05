import { supabase } from '@/lib/supabase'
import type { Appointment, AppointmentType, Specialty, AppointmentStatus } from '@/lib/types/database'

export async function getDailyAppointments(date: Date) {
    // Format date as YYYY-MM-DD for comparison
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
        .from('appointments')
        .select(`
      *,
      patient:patients(*)
    `)
        .gte('scheduled_at', startOfDay.toISOString())
        .lte('scheduled_at', endOfDay.toISOString())
        .order('scheduled_at', { ascending: true })

    if (error) {
        console.error('Error fetching appointments:', error)
        throw new Error('Failed to fetch appointments')
    }

    return data
}

export async function getAppointmentById(id: string) {
    const { data, error } = await supabase
        .from('appointments')
        .select(`
            *,
            patient:patients(*),
            provider:profiles(*)
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching appointment:', error)
        throw new Error('Failed to fetch appointment')
    }

    return data
}

export async function createAppointment(appointment: {
    patient_id: string
    provider_id: string
    scheduled_at: string
    duration_minutes: number
    appointment_type: AppointmentType
    specialty: Specialty
    chief_complaint: string
    status: AppointmentStatus
}) {
    const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single()

    if (error) {
        console.error('Error creating appointment:', error)
        throw error
    }

    return data
}
