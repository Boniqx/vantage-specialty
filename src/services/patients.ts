import { supabase } from '@/lib/supabase'

export async function getPatients(search?: string) {
    let query = supabase
        .from('patients')
        .select('*')
        .order('last_name', { ascending: true })

    if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,mrn.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching patients:', error)
        return []
    }

    return data
}

export async function createPatient(patient: {
    first_name: string
    last_name: string
    date_of_birth: string
    gender: string
    mrn: string
    phone?: string
    email?: string
    address_line1?: string
    city?: string
    state?: string
    zip_code?: string
}) {
    const { data, error } = await supabase
        .from('patients')
        .insert(patient)
        .select()
        .single()

    if (error) {
        console.error('Error creating patient:', error)
        throw error
    }

    return data
}
