-- Vantage Specialty EHR - Database Schema
-- PostgreSQL Schema for Supabase
-- Version: 1.0.0

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Table: profiles (Doctors/Staff)
-- =============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('physician', 'nurse', 'admin', 'receptionist', 'billing')),
    specialty TEXT CHECK (specialty IN ('cardiology', 'general', 'pediatrics', 'neurology', 'orthopedics', 'dermatology')),
    license_number TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_specialty ON profiles(specialty);

-- =============================================
-- Table: patients (Demographics, DOB, Insurance Info)
-- =============================================
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mrn TEXT UNIQUE NOT NULL, -- Medical Record Number
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    ssn_last_four TEXT, -- Last 4 digits only for HIPAA compliance
    
    -- Contact Information
    email TEXT,
    phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',
    
    -- Emergency Contact
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    
    -- Insurance Information (Primary)
    insurance_provider TEXT,
    insurance_policy_number TEXT,
    insurance_group_number TEXT,
    insurance_subscriber_name TEXT,
    insurance_subscriber_dob DATE,
    insurance_relationship TEXT CHECK (insurance_relationship IN ('self', 'spouse', 'child', 'other')),
    
    -- Insurance Information (Secondary)
    secondary_insurance_provider TEXT,
    secondary_insurance_policy_number TEXT,
    secondary_insurance_group_number TEXT,
    
    -- Medical Information
    blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown')),
    allergies TEXT[],
    current_medications TEXT[],
    
    -- Metadata
    preferred_language TEXT DEFAULT 'English',
    preferred_pharmacy TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_patients_dob ON patients(date_of_birth);

-- =============================================
-- Table: appointments (Status: Scheduled, Checked-in, Completed)
-- =============================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    provider_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Appointment Details
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    appointment_type TEXT NOT NULL CHECK (appointment_type IN ('new_patient', 'follow_up', 'annual_exam', 'urgent', 'telehealth', 'procedure')),
    specialty TEXT CHECK (specialty IN ('cardiology', 'general', 'pediatrics', 'neurology', 'orthopedics', 'dermatology')),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show')),
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    
    -- Notes
    chief_complaint TEXT,
    notes TEXT,
    cancellation_reason TEXT,
    
    -- Room Assignment
    room_number TEXT,
    
    -- Billing
    is_billable BOOLEAN DEFAULT true,
    copay_amount DECIMAL(10, 2),
    copay_collected BOOLEAN DEFAULT false,
    
    -- Metadata
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_provider ON appointments(provider_id);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

-- =============================================
-- Table: clinical_notes (SOAP format, Specialty-specific, ICD-10)
-- =============================================
CREATE TABLE clinical_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    provider_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    
    -- Specialty
    specialty TEXT NOT NULL CHECK (specialty IN ('cardiology', 'general', 'pediatrics', 'neurology', 'orthopedics', 'dermatology')),
    
    -- SOAP Note Structure
    -- Subjective
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    review_of_systems JSONB, -- Flexible structure for specialty-specific ROS
    past_medical_history TEXT,
    family_history TEXT,
    social_history TEXT,
    allergies TEXT[],
    current_medications JSONB,
    
    -- Objective
    vital_signs JSONB, -- { bp_systolic, bp_diastolic, heart_rate, respiratory_rate, temperature, spo2, height, weight, bmi }
    physical_exam JSONB, -- Specialty-specific physical exam findings
    lab_results JSONB,
    imaging_results TEXT,
    
    -- Assessment
    diagnoses JSONB, -- Array of { icd10_code, description, is_primary }
    differential_diagnoses TEXT[],
    clinical_impression TEXT,
    
    -- Plan
    treatment_plan TEXT,
    prescriptions JSONB, -- Array of { medication, dosage, frequency, duration, refills }
    procedures_performed JSONB,
    referrals JSONB, -- Array of { specialty, provider, reason, urgency }
    labs_ordered JSONB,
    imaging_ordered JSONB,
    follow_up_instructions TEXT,
    patient_education TEXT,
    
    -- Signature
    is_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMPTZ,
    is_locked BOOLEAN DEFAULT false,
    locked_at TIMESTAMPTZ,
    
    -- Addendums
    addendums JSONB, -- Array of { text, added_by, added_at }
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_clinical_notes_patient ON clinical_notes(patient_id);
CREATE INDEX idx_clinical_notes_provider ON clinical_notes(provider_id);
CREATE INDEX idx_clinical_notes_appointment ON clinical_notes(appointment_id);
CREATE INDEX idx_clinical_notes_specialty ON clinical_notes(specialty);
CREATE INDEX idx_clinical_notes_created ON clinical_notes(created_at DESC);

-- =============================================
-- Table: audit_logs (HIPAA Compliance)
-- =============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Action Details
    action TEXT NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'print', 'failed_login')),
    table_name TEXT NOT NULL,
    record_id UUID,
    
    -- Change Tracking
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    
    -- Patient Context (for PHI access tracking)
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for audit trail queries
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_patient ON audit_logs(patient_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (should be customized based on role)
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view patients" ON patients
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view appointments" ON appointments
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view clinical notes" ON clinical_notes
    FOR SELECT TO authenticated USING (true);

-- =============================================
-- Functions and Triggers
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinical_notes_updated_at
    BEFORE UPDATE ON clinical_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate MRN
CREATE OR REPLACE FUNCTION generate_mrn()
RETURNS TEXT AS $$
DECLARE
    new_mrn TEXT;
    counter INTEGER := 0;
BEGIN
    LOOP
        new_mrn := 'MRN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM patients WHERE mrn = new_mrn);
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Could not generate unique MRN after 100 attempts';
        END IF;
    END LOOP;
    RETURN new_mrn;
END;
$$ language 'plpgsql';

-- =============================================
-- Sample Data (for development/testing)
-- =============================================

-- Insert sample profiles
INSERT INTO profiles (id, email, full_name, role, specialty, license_number, is_active) VALUES
    ('11111111-1111-1111-1111-111111111111', 'dr.smith@vantageehr.com', 'Dr. Sarah Smith', 'physician', 'cardiology', 'MD-123456', true),
    ('22222222-2222-2222-2222-222222222222', 'dr.johnson@vantageehr.com', 'Dr. Michael Johnson', 'physician', 'general', 'MD-234567', true),
    ('33333333-3333-3333-3333-333333333333', 'dr.williams@vantageehr.com', 'Dr. Emily Williams', 'physician', 'pediatrics', 'MD-345678', true),
    ('44444444-4444-4444-4444-444444444444', 'nurse.davis@vantageehr.com', 'Nurse Rachel Davis', 'nurse', 'general', 'RN-456789', true);

-- Insert sample patients
INSERT INTO patients (id, mrn, first_name, last_name, date_of_birth, gender, email, phone, insurance_provider, insurance_policy_number) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MRN-20240101-0001', 'John', 'Doe', '1985-03-15', 'male', 'john.doe@email.com', '555-0101', 'Blue Cross Blue Shield', 'BCBS-123456'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'MRN-20240101-0002', 'Jane', 'Smith', '1990-07-22', 'female', 'jane.smith@email.com', '555-0102', 'Aetna', 'AET-234567'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'MRN-20240101-0003', 'Tommy', 'Wilson', '2018-11-30', 'male', 'parent.wilson@email.com', '555-0103', 'United Healthcare', 'UHC-345678'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'MRN-20240101-0004', 'Maria', 'Garcia', '1975-05-08', 'female', 'maria.garcia@email.com', '555-0104', 'Cigna', 'CIG-456789');

-- Insert sample appointments
INSERT INTO appointments (patient_id, provider_id, scheduled_at, duration_minutes, appointment_type, specialty, status, chief_complaint) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', NOW() + INTERVAL '2 hours', 30, 'follow_up', 'cardiology', 'scheduled', 'Chest pain follow-up'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', NOW() + INTERVAL '3 hours', 45, 'annual_exam', 'general', 'confirmed', 'Annual wellness exam'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', NOW() + INTERVAL '4 hours', 30, 'follow_up', 'pediatrics', 'scheduled', 'Growth check'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 hour', 30, 'follow_up', 'cardiology', 'in_progress', 'Hypertension management');
