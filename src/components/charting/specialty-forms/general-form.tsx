'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stethoscope, Eye, Ear, User } from 'lucide-react'

interface GeneralFormProps {
  data: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
  section: 'objective' | 'ros'
}

export function GeneralForm({ data, onChange, section }: GeneralFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value })
  }

  if (section === 'ros') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              Constitutional
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fever">Fever/Chills</Label>
              <Select
                value={data.fever as string || ''}
                onValueChange={(v) => updateField('fever', v)}
              >
                <SelectTrigger id="fever">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight_change">Weight Change</Label>
              <Select
                value={data.weight_change as string || ''}
                onValueChange={(v) => updateField('weight_change', v)}
              >
                <SelectTrigger id="weight_change">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="gain">Weight Gain</SelectItem>
                  <SelectItem value="loss">Weight Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatigue">Fatigue</Label>
              <Select
                value={data.fatigue as string || ''}
                onValueChange={(v) => updateField('fatigue', v)}
              >
                <SelectTrigger id="fatigue">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="night_sweats">Night Sweats</Label>
              <Select
                value={data.night_sweats as string || ''}
                onValueChange={(v) => updateField('night_sweats', v)}
              >
                <SelectTrigger id="night_sweats">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-amber-500" />
              HEENT
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vision_changes">Vision Changes</Label>
              <Select
                value={data.vision_changes as string || ''}
                onValueChange={(v) => updateField('vision_changes', v)}
              >
                <SelectTrigger id="vision_changes">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="blurry">Blurry Vision</SelectItem>
                  <SelectItem value="double">Double Vision</SelectItem>
                  <SelectItem value="loss">Vision Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hearing_changes">Hearing Changes</Label>
              <Select
                value={data.hearing_changes as string || ''}
                onValueChange={(v) => updateField('hearing_changes', v)}
              >
                <SelectTrigger id="hearing_changes">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="decreased">Decreased</SelectItem>
                  <SelectItem value="tinnitus">Tinnitus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sore_throat">Sore Throat</Label>
              <Select
                value={data.sore_throat as string || ''}
                onValueChange={(v) => updateField('sore_throat', v)}
              >
                <SelectTrigger id="sore_throat">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nasal_congestion">Nasal Congestion</Label>
              <Select
                value={data.nasal_congestion as string || ''}
                onValueChange={(v) => updateField('nasal_congestion', v)}
              >
                <SelectTrigger id="nasal_congestion">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Ear className="h-4 w-4 text-purple-500" />
              Respiratory
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cough">Cough</Label>
              <Select
                value={data.cough as string || ''}
                onValueChange={(v) => updateField('cough', v)}
              >
                <SelectTrigger id="cough">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="productive">Productive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortness_of_breath">Shortness of Breath</Label>
              <Select
                value={data.shortness_of_breath as string || ''}
                onValueChange={(v) => updateField('shortness_of_breath', v)}
              >
                <SelectTrigger id="shortness_of_breath">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wheezing">Wheezing</Label>
              <Select
                value={data.wheezing as string || ''}
                onValueChange={(v) => updateField('wheezing', v)}
              >
                <SelectTrigger id="wheezing">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Physical Exam - Objective section
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            General Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appearance">Appearance</Label>
              <Select
                value={data.appearance as string || ''}
                onValueChange={(v) => updateField('appearance', v)}
              >
                <SelectTrigger id="appearance">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="well">Well-appearing</SelectItem>
                  <SelectItem value="ill">Ill-appearing</SelectItem>
                  <SelectItem value="distress">In distress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertness">Alertness</Label>
              <Select
                value={data.alertness as string || ''}
                onValueChange={(v) => updateField('alertness', v)}
              >
                <SelectTrigger id="alertness">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alert">Alert & Oriented</SelectItem>
                  <SelectItem value="drowsy">Drowsy</SelectItem>
                  <SelectItem value="confused">Confused</SelectItem>
                  <SelectItem value="unresponsive">Unresponsive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Eye className="h-4 w-4 text-amber-500" />
            HEENT Examination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eyes">Eyes</Label>
              <Input
                id="eyes"
                placeholder="PERRLA, EOM intact"
                value={data.eyes as string || ''}
                onChange={(e) => updateField('eyes', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ears">Ears</Label>
              <Input
                id="ears"
                placeholder="TMs clear bilaterally"
                value={data.ears as string || ''}
                onChange={(e) => updateField('ears', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nose">Nose</Label>
              <Input
                id="nose"
                placeholder="No discharge, septum midline"
                value={data.nose as string || ''}
                onChange={(e) => updateField('nose', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="throat">Throat</Label>
              <Input
                id="throat"
                placeholder="Oropharynx clear, no erythema"
                value={data.throat as string || ''}
                onChange={(e) => updateField('throat', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            Cardiopulmonary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heart">Heart</Label>
            <Textarea
              id="heart"
              placeholder="Regular rate and rhythm, no murmurs, rubs, or gallops"
              value={data.heart as string || ''}
              onChange={(e) => updateField('heart', e.target.value)}
              className="min-h-[60px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lungs">Lungs</Label>
            <Textarea
              id="lungs"
              placeholder="Clear to auscultation bilaterally, no wheezes, rales, or rhonchi"
              value={data.lungs as string || ''}
              onChange={(e) => updateField('lungs', e.target.value)}
              className="min-h-[60px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Abdomen</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="abdomen"
            placeholder="Soft, non-tender, non-distended, normoactive bowel sounds"
            value={data.abdomen as string || ''}
            onChange={(e) => updateField('abdomen', e.target.value)}
            className="min-h-[60px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Extremities</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="extremities"
            placeholder="No edema, cyanosis, or clubbing. Good peripheral pulses."
            value={data.extremities as string || ''}
            onChange={(e) => updateField('extremities', e.target.value)}
            className="min-h-[60px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}
