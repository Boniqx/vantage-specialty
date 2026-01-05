
import { supabase } from '@/lib/supabase'

export async function getDashboardStats() {
    // We'll run these in parallel for performance
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
        todaysPatientsResponse,
        unsignedNotesResponse,
        messagesResponse // Placeholder for now as we don't have messages table yet
    ] = await Promise.all([
        supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .gte('scheduled_at', today.toISOString()),

        supabase
            .from('clinical_notes')
            .select('*', { count: 'exact', head: true })
            .eq('is_signed', false),

        // Placeholder promise for messages
        Promise.resolve({ count: 5, error: null })
    ])

    return {
        todaysPatients: todaysPatientsResponse.count || 0,
        unsignedNotes: unsignedNotesResponse.count || 0,
        messages: messagesResponse.count || 0,
        // Mock weekly trend for now
        weeklyTrend: 12
    }
}
