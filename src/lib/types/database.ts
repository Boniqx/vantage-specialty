// Database Types for Vantage Specialty EHR
// These types mirror the Supabase schema

export type Specialty = 'cardiology' | 'general' | 'pediatrics' | 'neurology' | 'orthopedics' | 'dermatology'

export type UserRole = 'physician' | 'nurse' | 'admin' | 'receptionist' | 'billing'

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export type AppointmentType = 'new_patient' | 'follow_up' | 'annual_exam' | 'urgent' | 'telehealth' | 'procedure'

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown'

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
export type PaymentMethod = 'cash' | 'credit_card' | 'insurance' | 'check' | 'bank_transfer'

export interface Profile {
    id: string
    user_id?: string
    email: string
    full_name: string
    role: UserRole
    specialty?: Specialty
    license_number?: string
    phone?: string
    avatar_url?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Patient {
    id: string
    mrn: string
    first_name: string
    last_name: string
    date_of_birth: string
    gender?: Gender
    ssn_last_four?: string

    // Contact Information
    email?: string
    phone?: string
    address_line1?: string
    address_line2?: string
    city?: string
    state?: string
    zip_code?: string
    country?: string

    // Emergency Contact
    emergency_contact_name?: string
    emergency_contact_phone?: string
    emergency_contact_relationship?: string

    // Insurance (Primary)
    insurance_provider?: string
    insurance_policy_number?: string
    insurance_group_number?: string
    insurance_subscriber_name?: string
    insurance_subscriber_dob?: string
    insurance_relationship?: 'self' | 'spouse' | 'child' | 'other'

    // Insurance (Secondary)
    secondary_insurance_provider?: string
    secondary_insurance_policy_number?: string
    secondary_insurance_group_number?: string

    // Medical Information
    blood_type?: BloodType
    allergies?: string[]
    current_medications?: string[]

    // Metadata
    preferred_language?: string
    preferred_pharmacy?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Appointment {
    id: string
    patient_id: string
    provider_id?: string
    scheduled_at: string
    duration_minutes: number
    appointment_type: AppointmentType
    specialty?: Specialty
    status: AppointmentStatus
    check_in_time?: string
    check_out_time?: string
    chief_complaint?: string
    notes?: string
    cancellation_reason?: string
    room_number?: string
    is_billable: boolean
    copay_amount?: number
    copay_collected: boolean
    created_by?: string
    created_at: string
    updated_at: string

    // Joined data
    patient?: Patient
    provider?: Profile
}

export interface VitalSigns {
    bp_systolic?: number
    bp_diastolic?: number
    heart_rate?: number
    respiratory_rate?: number
    temperature?: number
    spo2?: number
    height?: number
    weight?: number
    bmi?: number
}

export interface Diagnosis {
    icd10_code: string
    description: string
    is_primary: boolean
}

export interface Prescription {
    medication: string
    dosage: string
    frequency: string
    duration: string
    refills: number
    instructions?: string
}

export interface Referral {
    specialty: Specialty
    provider?: string
    reason: string
    urgency: 'routine' | 'urgent' | 'emergent'
}

export interface Addendum {
    text: string
    added_by: string
    added_at: string
}

export interface ClinicalNote {
    id: string
    patient_id: string
    provider_id: string
    appointment_id?: string
    specialty: Specialty

    // Subjective
    chief_complaint?: string
    history_of_present_illness?: string
    review_of_systems?: Record<string, unknown>
    past_medical_history?: string
    family_history?: string
    social_history?: string
    allergies?: string[]
    current_medications?: Prescription[]

    // Objective
    vital_signs?: VitalSigns
    physical_exam?: Record<string, unknown>
    lab_results?: Record<string, unknown>
    imaging_results?: string

    // Assessment
    diagnoses?: Diagnosis[]
    differential_diagnoses?: string[]
    clinical_impression?: string

    // Plan
    treatment_plan?: string
    prescriptions?: Prescription[]
    procedures_performed?: Record<string, unknown>
    referrals?: Referral[]
    labs_ordered?: Record<string, unknown>
    imaging_ordered?: Record<string, unknown>
    follow_up_instructions?: string
    patient_education?: string

    // Signature
    is_signed: boolean
    signed_at?: string
    is_locked: boolean
    locked_at?: string

    // Addendums
    addendums?: Addendum[]

    // Metadata
    created_at: string
    updated_at: string

    // Joined data
    patient?: Patient
    provider?: Profile
    appointment?: Appointment
}

export interface AuditLog {
    id: string
    user_id?: string
    action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'print' | 'failed_login'
    table_name: string
    record_id?: string
    old_values?: Record<string, unknown>
    new_values?: Record<string, unknown>
    changed_fields?: string[]
    ip_address?: string
    user_agent?: string
    session_id?: string
    patient_id?: string
    created_at: string
}

export interface InvoiceItem {
    id: string
    invoice_id: string
    description: string
    quantity: number
    unit_price: number
    total: number // Generated
    created_at: string
}

export interface Payment {
    id: string
    invoice_id: string
    amount: number
    method: PaymentMethod
    transaction_date: string
    transaction_id?: string
    notes?: string
    created_by?: string
}

export interface Invoice {
    id: string
    patient_id: string
    appointment_id?: string
    status: InvoiceStatus
    total_amount: number
    due_date?: string
    created_at: string
    updated_at: string

    // Joined Data
    patient?: Patient
    items?: InvoiceItem[]
    payments?: Payment[]
}

// Database type for Supabase client
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile
                Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
            }
            patients: {
                Row: Patient
                Insert: Omit<Patient, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Patient, 'id' | 'created_at' | 'updated_at'>>
            }
            appointments: {
                Row: Appointment
                Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>
            }
            clinical_notes: {
                Row: ClinicalNote
                Insert: Omit<ClinicalNote, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<ClinicalNote, 'id' | 'created_at' | 'updated_at'>>
            }
            audit_logs: {
                Row: AuditLog
                Insert: Omit<AuditLog, 'id' | 'created_at'>
                Update: never
            }
            invoices: {
                Row: Invoice
                Insert: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'items' | 'payments' | 'patient'>
                Update: Partial<Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'items' | 'payments' | 'patient'>>
            }
            invoice_items: {
                Row: InvoiceItem
                Insert: Omit<InvoiceItem, 'id' | 'created_at' | 'total'>
                Update: Partial<Omit<InvoiceItem, 'id' | 'created_at' | 'total'>>
            }
            payments: {
                Row: Payment
                Insert: Omit<Payment, 'id' | 'transaction_date'>
                Update: Partial<Omit<Payment, 'id' | 'transaction_date'>>
            }
        }
    }
}
