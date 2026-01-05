import { supabase } from '@/lib/supabase'

export const getReportStats = async () => {
    // Parallel fetch for efficiency
    const [
        { data: patients },
        { data: appointments },
        { data: payments }
    ] = await Promise.all([
        supabase.from('patients').select('date_of_birth, gender'),
        supabase.from('appointments').select('scheduled_at, status'),
        supabase.from('payments').select('amount, transaction_date')
    ])

    // 1. Demographics Processing
    const genderDistribution = processGenderStats(patients || [])
    const ageDistribution = processAgeStats(patients || [])

    // 2. Appointment Trends
    const dailyVolume = processDailyVolume(appointments || [])

    // 3. Financials
    const revenueTrend = processRevenueTrend(payments || [])

    // 4. KPI Cards
    const totalPatients = patients?.length || 0
    const activeAppointments = appointments?.filter(a => a.status !== 'cancelled').length || 0
    const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0
    const noShowCount = appointments?.filter(a => a.status === 'no_show').length || 0
    const noShowRate = activeAppointments ? (noShowCount / appointments!.length) * 100 : 0

    return {
        overview: {
            totalPatients,
            activeAppointments,
            totalRevenue,
            noShowRate
        },
        demographics: {
            gender: genderDistribution,
            age: ageDistribution
        },
        operations: {
            dailyVolume
        },
        financials: {
            revenueTrend
        }
    }
}

// Helpers
function processGenderStats(patients: any[]) {
    const counts: Record<string, number> = {}
    patients.forEach(p => {
        const g = p.gender || 'Unknown'
        counts[g] = (counts[g] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

function processAgeStats(patients: any[]) {
    const buckets = { '0-18': 0, '19-35': 0, '36-50': 0, '51-65': 0, '65+': 0 }
    const now = new Date()

    patients.forEach(p => {
        if (!p.date_of_birth) return
        const age = now.getFullYear() - new Date(p.date_of_birth).getFullYear()

        if (age <= 18) buckets['0-18']++
        else if (age <= 35) buckets['19-35']++
        else if (age <= 50) buckets['36-50']++
        else if (age <= 65) buckets['51-65']++
        else buckets['65+']++
    })

    return Object.entries(buckets).map(([name, value]) => ({ name, value }))
}

function processDailyVolume(appointments: any[]) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const counts = new Array(7).fill(0)

    appointments.forEach(a => {
        const d = new Date(a.scheduled_at)
        counts[d.getDay()]++
    })

    return days.map((day, i) => ({ name: day, value: counts[i] }))
}

function processRevenueTrend(payments: any[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const trends = new Array(12).fill(0)

    payments.forEach(p => {
        const d = new Date(p.transaction_date)
        trends[d.getMonth()] += p.amount
    })

    // For simplicity, just return all months. In production, filter to relevant range.
    return months.map((month, i) => ({ name: month, value: trends[i] }))
}
