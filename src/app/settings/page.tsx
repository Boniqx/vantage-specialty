'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm } from '@/components/settings/profile-form'
import { SecurityForm } from '@/components/settings/security-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64 transition-all duration-300">
        <TopBar />
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
               <Card>
                   <CardHeader>
                       <CardTitle>Personal Information</CardTitle>
                       <CardDescription>Update your provider profile details.</CardDescription>
                   </CardHeader>
                   <CardContent>
                       <ProfileForm />
                   </CardContent>
               </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
                <Card>
                   <CardHeader>
                       <CardTitle>Security Settings</CardTitle>
                       <CardDescription>Manage your password and account security.</CardDescription>
                   </CardHeader>
                   <CardContent>
                       <SecurityForm />
                   </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
                <Card>
                   <CardHeader>
                       <CardTitle>Appearance</CardTitle>
                       <CardDescription>Customize the interface theme.</CardDescription>
                   </CardHeader>
                   <CardContent>
                       <div className="flex items-center justify-between">
                           <div className="space-y-1">
                               <Label>Interface Theme</Label>
                               <p className="text-sm text-muted-foreground">
                                   Select your preferred color theme (Light, Dark, or System).
                               </p>
                           </div>
                           <ThemeToggle />
                       </div>
                   </CardContent>
               </Card>
            </TabsContent>
          </Tabs>

        </main>
      </div>
    </div>
  )
}
