'use client'

import { useState } from 'react'
import { Search, Bell, User, ChevronDown, Stethoscope } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import type { Specialty } from '@/lib/types/database'

const specialties: { value: Specialty; label: string; color: string }[] = [
  { value: 'cardiology', label: 'Cardiology', color: 'bg-red-500' },
  { value: 'general', label: 'General Medicine', color: 'bg-blue-500' },
  { value: 'pediatrics', label: 'Pediatrics', color: 'bg-green-500' },
  { value: 'neurology', label: 'Neurology', color: 'bg-purple-500' },
  { value: 'orthopedics', label: 'Orthopedics', color: 'bg-orange-500' },
  { value: 'dermatology', label: 'Dermatology', color: 'bg-pink-500' },
]

interface TopBarProps {
  onSpecialtyChange?: (specialty: Specialty) => void
}

export function TopBar({ onSpecialtyChange }: TopBarProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>('general')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSpecialtyChange = (value: Specialty) => {
    setSelectedSpecialty(value)
    onSpecialtyChange?.(value)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Patient Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search patients by name or MRN..."
          className="pl-9 h-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Specialty Switcher */}
      <div className="flex items-center gap-2">
        <Stethoscope className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedSpecialty} onValueChange={handleSpecialtyChange}>
          <SelectTrigger className="w-[180px] h-10 bg-muted/50 border-0">
            <SelectValue placeholder="Select Specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty.value} value={specialty.value}>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${specialty.color}`} />
                  {specialty.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <Badge 
            variant="destructive" 
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
          >
            3
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/doctor.jpg" alt="Dr. User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  DS
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-medium">Dr. Sarah Smith</span>
                <span className="text-xs text-muted-foreground">Cardiology</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
