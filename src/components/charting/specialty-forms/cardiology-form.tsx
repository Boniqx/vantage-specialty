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
import { Heart, Activity, Stethoscope } from 'lucide-react'

interface CardiologyFormProps {
  data: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
  section: 'objective' | 'ros'
}

export function CardiologyForm({ data, onChange, section }: CardiologyFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value })
  }

  if (section === 'ros') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Cardiovascular Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chest_pain">Chest Pain</Label>
                <Select
                  value={data.chest_pain as string || ''}
                  onValueChange={(v) => updateField('chest_pain', v)}
                >
                  <SelectTrigger id="chest_pain">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="exertional">Exertional</SelectItem>
                    <SelectItem value="at_rest">At Rest</SelectItem>
                    <SelectItem value="pleuritic">Pleuritic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="palpitations">Palpitations</Label>
                <Select
                  value={data.palpitations as string || ''}
                  onValueChange={(v) => updateField('palpitations', v)}
                >
                  <SelectTrigger id="palpitations">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="frequent">Frequent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dyspnea">Dyspnea</Label>
                <Select
                  value={data.dyspnea as string || ''}
                  onValueChange={(v) => updateField('dyspnea', v)}
                >
                  <SelectTrigger id="dyspnea">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="on_exertion">On Exertion</SelectItem>
                    <SelectItem value="at_rest">At Rest</SelectItem>
                    <SelectItem value="orthopnea">Orthopnea</SelectItem>
                    <SelectItem value="pnd">PND</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edema">Peripheral Edema</Label>
                <Select
                  value={data.edema as string || ''}
                  onValueChange={(v) => updateField('edema', v)}
                >
                  <SelectTrigger id="edema">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="trace">Trace</SelectItem>
                    <SelectItem value="1_plus">1+</SelectItem>
                    <SelectItem value="2_plus">2+</SelectItem>
                    <SelectItem value="3_plus">3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="syncope">Syncope/Pre-syncope</Label>
              <Textarea
                id="syncope"
                placeholder="Describe any episodes of fainting or near-fainting..."
                value={data.syncope as string || ''}
                onChange={(e) => updateField('syncope', e.target.value)}
                className="min-h-[80px]"
              />
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
            <Stethoscope className="h-4 w-4 text-primary" />
            Cardiac Examination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
              <Input
                id="heart_rate"
                type="number"
                placeholder="72"
                value={data.heart_rate as string || ''}
                onChange={(e) => updateField('heart_rate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rhythm">Rhythm</Label>
              <Select
                value={data.rhythm as string || ''}
                onValueChange={(v) => updateField('rhythm', v)}
              >
                <SelectTrigger id="rhythm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="irregular">Irregular</SelectItem>
                  <SelectItem value="afib">Atrial Fibrillation</SelectItem>
                  <SelectItem value="aflutter">Atrial Flutter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="heart_sounds">Heart Sounds</Label>
            <Select
              value={data.heart_sounds as string || ''}
              onValueChange={(v) => updateField('heart_sounds', v)}
            >
              <SelectTrigger id="heart_sounds">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="s1_s2_normal">S1, S2 Normal</SelectItem>
                <SelectItem value="s3_gallop">S3 Gallop</SelectItem>
                <SelectItem value="s4_gallop">S4 Gallop</SelectItem>
                <SelectItem value="s3_s4_gallop">S3 & S4 Gallop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="murmur">Heart Murmur</Label>
              <Select
                value={data.murmur as string || ''}
                onValueChange={(v) => updateField('murmur', v)}
              >
                <SelectTrigger id="murmur">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="systolic">Systolic</SelectItem>
                  <SelectItem value="diastolic">Diastolic</SelectItem>
                  <SelectItem value="continuous">Continuous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="murmur_grade">Murmur Grade</Label>
              <Select
                value={data.murmur_grade as string || ''}
                onValueChange={(v) => updateField('murmur_grade', v)}
              >
                <SelectTrigger id="murmur_grade">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Grade I</SelectItem>
                  <SelectItem value="2">Grade II</SelectItem>
                  <SelectItem value="3">Grade III</SelectItem>
                  <SelectItem value="4">Grade IV</SelectItem>
                  <SelectItem value="5">Grade V</SelectItem>
                  <SelectItem value="6">Grade VI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jvp">JVP (cm H2O)</Label>
              <Input
                id="jvp"
                type="number"
                placeholder="8"
                value={data.jvp as string || ''}
                onChange={(e) => updateField('jvp', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carotid_bruits">Carotid Bruits</Label>
              <Select
                value={data.carotid_bruits as string || ''}
                onValueChange={(v) => updateField('carotid_bruits', v)}
              >
                <SelectTrigger id="carotid_bruits">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="bilateral">Bilateral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="peripheral_pulses">Peripheral Pulses</Label>
            <Textarea
              id="peripheral_pulses"
              placeholder="Describe pulse quality (radial, femoral, dorsalis pedis, posterior tibial)..."
              value={data.peripheral_pulses as string || ''}
              onChange={(e) => updateField('peripheral_pulses', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            Blood Pressure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bp_systolic">Systolic (mmHg)</Label>
              <Input
                id="bp_systolic"
                type="number"
                placeholder="120"
                value={data.bp_systolic as string || ''}
                onChange={(e) => updateField('bp_systolic', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bp_diastolic">Diastolic (mmHg)</Label>
              <Input
                id="bp_diastolic"
                type="number"
                placeholder="80"
                value={data.bp_diastolic as string || ''}
                onChange={(e) => updateField('bp_diastolic', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bp_position">Position</Label>
              <Select
                value={data.bp_position as string || ''}
                onValueChange={(v) => updateField('bp_position', v)}
              >
                <SelectTrigger id="bp_position">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sitting">Sitting</SelectItem>
                  <SelectItem value="standing">Standing</SelectItem>
                  <SelectItem value="supine">Supine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
