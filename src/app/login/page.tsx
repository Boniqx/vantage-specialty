'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { AlertCircle, Loader2, Stethoscope, Lock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid login credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding & Info */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold mb-2">
            <div className="h-8 w-8 bg-white/20 rounded flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            Vantage Specialty EHR
          </div>
          <p className="text-primary-foreground/80">Next-Generation Clinical Documentation</p>
        </div>

        <div className="space-y-6">
          <blockquote className="text-xl italic font-light">
            "Streamlining specialty workflows so physicians can focus on what matters most—patient care."
          </blockquote>
          <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
             <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> HIPAA Compliant
             </div>
             <div>•</div>
             <div>Secure & Encrypted</div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Sign in using an email</CardTitle>
            <CardDescription>
              Enter your provider credentials to access the secure portal
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="dr.name@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                    </>
                ) : (
                    'Sign In'
                )}
              </Button>
            </CardFooter>
          </form>
          
          <div className="px-8 text-center text-sm text-muted-foreground pb-6">
            <p>Don't have an account? Contact your administrator.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
