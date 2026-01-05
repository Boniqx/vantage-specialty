'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export function SecurityForm() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
        alert("Passwords do not match")
        return
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters")
        return
    }

    setLoading(true)
    try {
        const { error } = await supabase.auth.updateUser({ password: password })
        if (error) throw error
        alert("Password updated successfully")
        setPassword('')
        setConfirmPassword('')
    } catch (error: any) {
        console.error('Error updating password:', error)
        alert(error.message || "Failed to update password")
    } finally {
        setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-xl">
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                    id="new-password" 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
        </div>

        <Button type="submit" disabled={loading} variant="destructive">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
        </Button>
    </form>
  )
}
