// Clinical Notes CRUD Service
// Provides database operations for clinical note management

import { supabase } from '@/lib/supabase'
import type { ClinicalNote, Specialty } from '@/lib/types/database'

export interface CreateNoteInput {
    patient_id: string
    provider_id: string
    appointment_id?: string
    specialty: Specialty
    chief_complaint?: string
    history_of_present_illness?: string
    review_of_systems?: Record<string, unknown>
    past_medical_history?: string
    family_history?: string
    social_history?: string
    allergies?: string[]
    current_medications?: ClinicalNote['current_medications']
    vital_signs?: ClinicalNote['vital_signs']
    physical_exam?: Record<string, unknown>
    lab_results?: Record<string, unknown>
    imaging_results?: string
    diagnoses?: ClinicalNote['diagnoses']
    differential_diagnoses?: string[]
    clinical_impression?: string
    treatment_plan?: string
    prescriptions?: ClinicalNote['prescriptions']
    procedures_performed?: Record<string, unknown>
    referrals?: ClinicalNote['referrals']
    labs_ordered?: Record<string, unknown>
    imaging_ordered?: Record<string, unknown>
    follow_up_instructions?: string
    patient_education?: string
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
    is_signed?: boolean
    addendums?: ClinicalNote['addendums']
}

/**
 * Create a new clinical note
 */
export async function createClinicalNote(input: CreateNoteInput) {
    const { data, error } = await supabase
        .from('clinical_notes')
        .insert({
            ...input,
            is_signed: false,
            is_locked: false,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating clinical note:', error)
        throw new Error(`Failed to create clinical note: ${error.message}`)
    }

    // Log audit trail
    await logAuditEvent('create', 'clinical_notes', data.id, null, input, input.patient_id)

    return data
}

/**
 * Get all clinical notes with optional filtering
 */
export async function getClinicalNotes(options?: {
    patient_id?: string
    provider_id?: string
    specialty?: Specialty
    limit?: number
    offset?: number
}) {
    let query = supabase
        .from('clinical_notes')
        .select(`
      *,
      patient:patients(id, mrn, first_name, last_name, date_of_birth),
      provider:profiles(id, full_name, specialty)
    `)
        .order('created_at', { ascending: false })

    if (options?.patient_id) {
        query = query.eq('patient_id', options.patient_id)
    }

    if (options?.provider_id) {
        query = query.eq('provider_id', options.provider_id)
    }

    if (options?.specialty) {
        query = query.eq('specialty', options.specialty)
    }

    if (options?.limit) {
        query = query.limit(options.limit)
    }

    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching clinical notes:', error)
        throw new Error(`Failed to fetch clinical notes: ${error.message}`)
    }

    return data
}

/**
 * Get a single clinical note by ID
 */
export async function getClinicalNoteById(id: string) {
    const { data, error } = await supabase
        .from('clinical_notes')
        .select(`
      *,
      patient:patients(*),
      provider:profiles(*),
      appointment:appointments(*)
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching clinical note:', error)
        throw new Error(`Failed to fetch clinical note: ${error.message}`)
    }

    // Log read access for PHI audit
    await logAuditEvent('read', 'clinical_notes', id, null, null, data.patient_id)

    return data
}

/**
 * Update a clinical note
 * Note: Locked notes cannot be updated
 */
export async function updateClinicalNote(id: string, input: UpdateNoteInput) {
    // First check if the note is locked
    const { data: existingNote } = await supabase
        .from('clinical_notes')
        .select('is_locked, patient_id')
        .eq('id', id)
        .single()

    if (existingNote?.is_locked) {
        throw new Error('Cannot update a locked clinical note. Please add an addendum instead.')
    }

    const updateData: Record<string, unknown> = { ...input }

    // If signing the note, add timestamp and lock it
    if (input.is_signed) {
        updateData.signed_at = new Date().toISOString()
        updateData.is_locked = true
        updateData.locked_at = new Date().toISOString()
    }

    const { data, error } = await supabase
        .from('clinical_notes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating clinical note:', error)
        throw new Error(`Failed to update clinical note: ${error.message}`)
    }

    // Log audit trail
    await logAuditEvent('update', 'clinical_notes', id, existingNote, updateData, existingNote?.patient_id)

    return data
}

/**
 * Add an addendum to a signed/locked note
 */
export async function addAddendum(noteId: string, providerId: string, text: string) {
    const { data: existingNote } = await supabase
        .from('clinical_notes')
        .select('addendums, patient_id')
        .eq('id', noteId)
        .single()

    const newAddendum = {
        text,
        added_by: providerId,
        added_at: new Date().toISOString(),
    }

    const addendums = [...(existingNote?.addendums || []), newAddendum]

    const { data, error } = await supabase
        .from('clinical_notes')
        .update({ addendums })
        .eq('id', noteId)
        .select()
        .single()

    if (error) {
        console.error('Error adding addendum:', error)
        throw new Error(`Failed to add addendum: ${error.message}`)
    }

    // Log audit trail
    await logAuditEvent('update', 'clinical_notes', noteId, { addendums: existingNote?.addendums }, { addendums }, existingNote?.patient_id)

    return data
}

/**
 * Delete a clinical note (soft delete by marking inactive)
 * Note: In production, you may want to prevent deletion of signed notes entirely
 */
export async function deleteClinicalNote(id: string) {
    // First check if the note is signed/locked
    const { data: existingNote } = await supabase
        .from('clinical_notes')
        .select('is_signed, is_locked, patient_id')
        .eq('id', id)
        .single()

    if (existingNote?.is_signed || existingNote?.is_locked) {
        throw new Error('Cannot delete a signed or locked clinical note.')
    }

    const { error } = await supabase
        .from('clinical_notes')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting clinical note:', error)
        throw new Error(`Failed to delete clinical note: ${error.message}`)
    }

    // Log audit trail
    await logAuditEvent('delete', 'clinical_notes', id, existingNote, null, existingNote?.patient_id)

    return { success: true }
}

/**
 * Get a clinical note by Appointment ID
 */
export async function getNoteByAppointmentId(appointmentId: string) {
    const { data, error } = await supabase
        .from('clinical_notes')
        .select('*')
        .eq('appointment_id', appointmentId)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching note by appointment:', error)
    }

    return data
}

/**
 * Log an audit event for HIPAA compliance
 */
async function logAuditEvent(
    action: 'create' | 'read' | 'update' | 'delete',
    tableName: string,
    recordId: string,
    oldValues: unknown,
    newValues: unknown,
    patientId?: string
) {
    try {
        await supabase.from('audit_logs').insert({
            action,
            table_name: tableName,
            record_id: recordId,
            old_values: oldValues as Record<string, unknown>,
            new_values: newValues as Record<string, unknown>,
            patient_id: patientId,
            // Note: In production, capture these from the request context
            // user_id: getCurrentUserId(),
            // ip_address: getClientIp(),
            // user_agent: getUserAgent(),
            // session_id: getSessionId(),
        })
    } catch (error) {
        // Log but don't throw - audit logging should not break the main operation
        console.error('Failed to log audit event:', error)
    }
}
