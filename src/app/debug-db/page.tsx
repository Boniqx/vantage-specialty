'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  
  const addLog = (msg: string) => setLogs(p => [...p, msg])

  useEffect(() => {
    runDebug()
  }, [])

  const runDebug = async () => {
    addLog('Starting Debug Sequence...')
    
    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    addLog(`User: ${user?.id || 'No User'}`)
    
    if (!user) return

    // 2. Check Profile
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
    addLog(`Profile Search Error: ${JSON.stringify(profileError)}`)
    addLog(`Profile: ${profile ? 'Found ID: ' + profile.id : 'Not Found'}`)

    if (!profile) return

    // 3. Fetch a Patient (needed for FK)
    const { data: patients, error: patientError } = await supabase.from('patients').select('id, first_name').limit(1)
    addLog(`Patient Search Error: ${JSON.stringify(patientError)}`)
    
    if (!patients || patients.length === 0) {
        addLog('No patients found. Cannot test appointment creation.')
        return
    }
    
    const patientId = patients[0].id
    addLog(`Using Patient: ${patients[0].first_name} (${patientId})`)

    // 4. Try Insert Appointment
    const testAppt = {
        patient_id: patientId,
        provider_id: profile.id, // Using correct profile ID
        scheduled_at: new Date().toISOString(),
        duration_minutes: 30,
        appointment_type: 'follow_up',
        specialty: 'general',
        status: 'scheduled',
        chief_complaint: 'Debug test ' + Date.now()
    }

    addLog('Attempting Insert...')
    const { data: insertData, error: insertError } = await supabase
        .from('appointments')
        .insert(testAppt)
        .select()
    
    if (insertError) {
         addLog(`Insert Error: ${JSON.stringify(insertError)}`)
         addLog(`Error Code: ${insertError.code}`)
         addLog(`Error Msg: ${insertError.message}`)
    } else {
         addLog(`Insert Success: ${JSON.stringify(insertData)}`)
    }

    // 5. Try Select All Appointments
    addLog('Attemping Select All...')
    const { data: selectData, error: selectError } = await supabase.from('appointments').select('*')
    
    if (selectError) {
        addLog(`Select Error: ${JSON.stringify(selectError)}`)
    } else {
        addLog(`Select Success. Count: ${selectData?.length}`)
        addLog(`Rows: ${JSON.stringify(selectData, null, 2)}`)
    }
  }

  return (
    <div className="p-8 bg-gray-900 text-green-400 font-mono text-sm min-h-screen overflow-auto">
      <h1 className="text-xl mb-4 text-white">Database Debugger</h1>
      <pre className="whitespace-pre-wrap">{logs.join('\n\n')}</pre>
    </div>
  )
}
