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
import { Baby, Ruler, Activity, Syringe } from 'lucide-react'

interface PediatricsFormProps {
  data: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
  section: 'objective' | 'ros'
}

export function PediatricsForm({ data, onChange, section }: PediatricsFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value })
  }

  if (section === 'ros') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Baby className="h-4 w-4 text-pink-500" />
              Developmental History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gross_motor">Gross Motor</Label>
                <Select
                  value={data.gross_motor as string || ''}
                  onValueChange={(v) => updateField('gross_motor', v)}
                >
                  <SelectTrigger id="gross_motor">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Age Appropriate</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="concern">Concern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fine_motor">Fine Motor</Label>
                <Select
                  value={data.fine_motor as string || ''}
                  onValueChange={(v) => updateField('fine_motor', v)}
                >
                  <SelectTrigger id="fine_motor">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Age Appropriate</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="concern">Concern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language/Speech</Label>
                <Select
                  value={data.language as string || ''}
                  onValueChange={(v) => updateField('language', v)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Age Appropriate</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="concern">Concern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="social">Social/Emotional</Label>
                <Select
                  value={data.social as string || ''}
                  onValueChange={(v) => updateField('social', v)}
                >
                  <SelectTrigger id="social">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Age Appropriate</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="concern">Concern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="developmental_concerns">Developmental Concerns</Label>
              <Textarea
                id="developmental_concerns"
                placeholder="Note any developmental concerns or milestone observations..."
                value={data.developmental_concerns as string || ''}
                onChange={(e) => updateField('developmental_concerns', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              Nutrition & Feeding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feeding_type">Feeding Type</Label>
                <Select
                  value={data.feeding_type as string || ''}
                  onValueChange={(v) => updateField('feeding_type', v)}
                >
                  <SelectTrigger id="feeding_type">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breastfed">Breastfed</SelectItem>
                    <SelectItem value="formula">Formula</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="solids">Solids</SelectItem>
                    <SelectItem value="regular_diet">Regular Diet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appetite">Appetite</Label>
                <Select
                  value={data.appetite as string || ''}
                  onValueChange={(v) => updateField('appetite', v)}
                >
                  <SelectTrigger id="appetite">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="decreased">Decreased</SelectItem>
                    <SelectItem value="increased">Increased</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeding_concerns">Feeding Concerns</Label>
              <Textarea
                id="feeding_concerns"
                placeholder="Any feeding difficulties, food allergies, or dietary restrictions..."
                value={data.feeding_concerns as string || ''}
                onChange={(e) => updateField('feeding_concerns', e.target.value)}
                className="min-h-[60px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Syringe className="h-4 w-4 text-blue-500" />
              Immunization Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="immunization_status">Immunization Status</Label>
              <Select
                value={data.immunization_status as string || ''}
                onValueChange={(v) => updateField('immunization_status', v)}
              >
                <SelectTrigger id="immunization_status">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="up_to_date">Up to Date</SelectItem>
                  <SelectItem value="behind">Behind Schedule</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                  <SelectItem value="refused">Parent Refused</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vaccines_due">Vaccines Due Today</Label>
              <Textarea
                id="vaccines_due"
                placeholder="List any vaccines due at this visit..."
                value={data.vaccines_due as string || ''}
                onChange={(e) => updateField('vaccines_due', e.target.value)}
                className="min-h-[60px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Physical Exam - Objective section (Growth & Development focus)
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Ruler className="h-4 w-4 text-primary" />
            Growth Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              <Input
                id="weight_kg"
                type="number"
                step="0.1"
                placeholder="12.5"
                value={data.weight_kg as string || ''}
                onChange={(e) => updateField('weight_kg', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight_percentile">Weight Percentile</Label>
              <Input
                id="weight_percentile"
                type="number"
                placeholder="50"
                value={data.weight_percentile as string || ''}
                onChange={(e) => updateField('weight_percentile', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height_cm">Height/Length (cm)</Label>
              <Input
                id="height_cm"
                type="number"
                step="0.1"
                placeholder="85"
                value={data.height_cm as string || ''}
                onChange={(e) => updateField('height_cm', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height_percentile">Height Percentile</Label>
              <Input
                id="height_percentile"
                type="number"
                placeholder="50"
                value={data.height_percentile as string || ''}
                onChange={(e) => updateField('height_percentile', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="head_circumference">Head Circumference (cm)</Label>
              <Input
                id="head_circumference"
                type="number"
                step="0.1"
                placeholder="47"
                value={data.head_circumference as string || ''}
                onChange={(e) => updateField('head_circumference', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hc_percentile">HC Percentile</Label>
              <Input
                id="hc_percentile"
                type="number"
                placeholder="50"
                value={data.hc_percentile as string || ''}
                onChange={(e) => updateField('hc_percentile', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bmi">BMI</Label>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                placeholder="17.2"
                value={data.bmi as string || ''}
                onChange={(e) => updateField('bmi', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bmi_percentile">BMI Percentile</Label>
              <Input
                id="bmi_percentile"
                type="number"
                placeholder="50"
                value={data.bmi_percentile as string || ''}
                onChange={(e) => updateField('bmi_percentile', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Baby className="h-4 w-4 text-pink-500" />
            Pediatric Physical Exam
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="general">General Appearance</Label>
              <Select
                value={data.general as string || ''}
                onValueChange={(v) => updateField('general', v)}
              >
                <SelectTrigger id="general">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="well_nourished">Well-nourished</SelectItem>
                  <SelectItem value="well_developed">Well-developed</SelectItem>
                  <SelectItem value="cooperative">Active & Cooperative</SelectItem>
                  <SelectItem value="fussy">Fussy</SelectItem>
                  <SelectItem value="lethargic">Lethargic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skin">Skin</Label>
              <Input
                id="skin"
                placeholder="Warm, dry, no rashes"
                value={data.skin as string || ''}
                onChange={(e) => updateField('skin', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontanelle">Fontanelle (if applicable)</Label>
            <Select
              value={data.fontanelle as string || ''}
              onValueChange={(v) => updateField('fontanelle', v)}
            >
              <SelectTrigger id="fontanelle">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open_flat">Open, Flat</SelectItem>
                <SelectItem value="open_bulging">Open, Bulging</SelectItem>
                <SelectItem value="open_sunken">Open, Sunken</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="na">N/A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tympanic_membranes">Tympanic Membranes</Label>
            <Input
              id="tympanic_membranes"
              placeholder="Clear bilaterally, no erythema or effusion"
              value={data.tympanic_membranes as string || ''}
              onChange={(e) => updateField('tympanic_membranes', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="throat_pediatric">Oropharynx</Label>
            <Input
              id="throat_pediatric"
              placeholder="No erythema, tonsils 1+, no exudate"
              value={data.throat_pediatric as string || ''}
              onChange={(e) => updateField('throat_pediatric', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heart_lungs">Heart & Lungs</Label>
            <Textarea
              id="heart_lungs"
              placeholder="RRR, no murmur. Lungs CTA bilaterally."
              value={data.heart_lungs as string || ''}
              onChange={(e) => updateField('heart_lungs', e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abdomen_pediatric">Abdomen</Label>
            <Textarea
              id="abdomen_pediatric"
              placeholder="Soft, non-tender, no hepatosplenomegaly"
              value={data.abdomen_pediatric as string || ''}
              onChange={(e) => updateField('abdomen_pediatric', e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genitourinary">Genitourinary (if examined)</Label>
            <Input
              id="genitourinary"
              placeholder="Normal external genitalia, Tanner stage I"
              value={data.genitourinary as string || ''}
              onChange={(e) => updateField('genitourinary', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neuro_pediatric">Neurological</Label>
            <Textarea
              id="neuro_pediatric"
              placeholder="Age-appropriate. Good tone, symmetric movement."
              value={data.neuro_pediatric as string || ''}
              onChange={(e) => updateField('neuro_pediatric', e.target.value)}
              className="min-h-[60px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
