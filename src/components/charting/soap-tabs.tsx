'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageSquare, 
  Stethoscope, 
  ClipboardList, 
  FileText,
  Thermometer,
  Heart,
  Activity
} from 'lucide-react'
import type { Specialty, VitalSigns } from '@/lib/types/database'

// Import specialty-specific forms
import { CardiologyForm } from './specialty-forms/cardiology-form'
import { GeneralForm } from './specialty-forms/general-form'
import { PediatricsForm } from './specialty-forms/pediatrics-form'

interface SOAPTabsProps {
  specialty: Specialty
  data: {
    subjective: {
      chief_complaint: string
      history_of_present_illness: string
      past_medical_history: string
      family_history: string
      social_history: string
      allergies: string[]
      review_of_systems: Record<string, unknown>
    }
    objective: {
      vital_signs: VitalSigns
      physical_exam: Record<string, unknown>
    }
    assessment: {
      clinical_impression: string
      diagnoses: Array<{ icd10_code: string; description: string; is_primary: boolean }>
      differential_diagnoses: string[]
    }
    plan: {
      treatment_plan: string
      follow_up_instructions: string
      patient_education: string
    }
  }
  onChange: (section: string, data: unknown) => void
}

export function SOAPTabs({ specialty, data, onChange }: SOAPTabsProps) {
  const updateSubjective = (field: string, value: unknown) => {
    onChange('subjective', { ...data.subjective, [field]: value })
  }

  const updateObjective = (field: string, value: unknown) => {
    onChange('objective', { ...data.objective, [field]: value })
  }

  const updateVitalSigns = (field: string, value: unknown) => {
    onChange('objective', {
      ...data.objective,
      vital_signs: { ...data.objective.vital_signs, [field]: value },
    })
  }

  const updateAssessment = (field: string, value: unknown) => {
    onChange('assessment', { ...data.assessment, [field]: value })
  }

  const updatePlan = (field: string, value: unknown) => {
    onChange('plan', { ...data.plan, [field]: value })
  }

  // Render specialty-specific form
  const renderSpecialtyForm = (section: 'objective' | 'ros') => {
    const formData = section === 'ros' ? data.subjective.review_of_systems : data.objective.physical_exam
    const handleChange = (newData: Record<string, unknown>) => {
      if (section === 'ros') {
        updateSubjective('review_of_systems', newData)
      } else {
        updateObjective('physical_exam', newData)
      }
    }

    switch (specialty) {
      case 'cardiology':
        return <CardiologyForm data={formData} onChange={handleChange} section={section} />
      case 'pediatrics':
        return <PediatricsForm data={formData} onChange={handleChange} section={section} />
      default:
        return <GeneralForm data={formData} onChange={handleChange} section={section} />
    }
  }

  return (
    <Tabs defaultValue="subjective" className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-12 p-1">
        <TabsTrigger value="subjective" className="flex items-center gap-2 text-sm">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Subjective</span>
        </TabsTrigger>
        <TabsTrigger value="objective" className="flex items-center gap-2 text-sm">
          <Stethoscope className="h-4 w-4" />
          <span className="hidden sm:inline">Objective</span>
        </TabsTrigger>
        <TabsTrigger value="assessment" className="flex items-center gap-2 text-sm">
          <ClipboardList className="h-4 w-4" />
          <span className="hidden sm:inline">Assessment</span>
        </TabsTrigger>
        <TabsTrigger value="plan" className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Plan</span>
        </TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[calc(100vh-320px)] mt-4">
        {/* Subjective Tab */}
        <TabsContent value="subjective" className="space-y-6 pr-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Chief Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Patient's primary reason for visit in their own words..."
                value={data.subjective.chief_complaint}
                onChange={(e) => updateSubjective('chief_complaint', e.target.value)}
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">History of Present Illness (HPI)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Detailed description of the current illness: onset, location, duration, character, aggravating/relieving factors, timing, severity..."
                value={data.subjective.history_of_present_illness}
                onChange={(e) => updateSubjective('history_of_present_illness', e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Review of Systems</CardTitle>
            </CardHeader>
            <CardContent>
              {renderSpecialtyForm('ros')}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Past Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Previous diagnoses, surgeries, hospitalizations..."
                  value={data.subjective.past_medical_history}
                  onChange={(e) => updateSubjective('past_medical_history', e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Family History</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Relevant family medical history..."
                  value={data.subjective.family_history}
                  onChange={(e) => updateSubjective('family_history', e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Social History</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Tobacco, alcohol, drug use, occupation, living situation..."
                value={data.subjective.social_history}
                onChange={(e) => updateSubjective('social_history', e.target.value)}
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="NKDA or list allergies with reactions..."
                value={data.subjective.allergies.join(', ')}
                onChange={(e) => updateSubjective('allergies', e.target.value.split(', ').filter(Boolean))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objective Tab */}
        <TabsContent value="objective" className="space-y-6 pr-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bp_systolic" className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    BP Systolic
                  </Label>
                  <Input
                    id="bp_systolic"
                    type="number"
                    placeholder="120"
                    value={data.objective.vital_signs.bp_systolic || ''}
                    onChange={(e) => updateVitalSigns('bp_systolic', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bp_diastolic">BP Diastolic</Label>
                  <Input
                    id="bp_diastolic"
                    type="number"
                    placeholder="80"
                    value={data.objective.vital_signs.bp_diastolic || ''}
                    onChange={(e) => updateVitalSigns('bp_diastolic', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heart_rate" className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-green-500" />
                    Heart Rate
                  </Label>
                  <Input
                    id="heart_rate"
                    type="number"
                    placeholder="72"
                    value={data.objective.vital_signs.heart_rate || ''}
                    onChange={(e) => updateVitalSigns('heart_rate', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="respiratory_rate">Resp Rate</Label>
                  <Input
                    id="respiratory_rate"
                    type="number"
                    placeholder="16"
                    value={data.objective.vital_signs.respiratory_rate || ''}
                    onChange={(e) => updateVitalSigns('respiratory_rate', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temp (°F)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={data.objective.vital_signs.temperature || ''}
                    onChange={(e) => updateVitalSigns('temperature', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spo2">SpO2 (%)</Label>
                  <Input
                    id="spo2"
                    type="number"
                    placeholder="98"
                    value={data.objective.vital_signs.spo2 || ''}
                    onChange={(e) => updateVitalSigns('spo2', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={data.objective.vital_signs.height || ''}
                    onChange={(e) => updateVitalSigns('height', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={data.objective.vital_signs.weight || ''}
                    onChange={(e) => updateVitalSigns('weight', Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                Physical Examination
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  ({specialty.charAt(0).toUpperCase() + specialty.slice(1)} Focus)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSpecialtyForm('objective')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment Tab */}
        <TabsContent value="assessment" className="space-y-6 pr-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Clinical Impression</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Summary of clinical findings and your assessment..."
                value={data.assessment.clinical_impression}
                onChange={(e) => updateAssessment('clinical_impression', e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Diagnoses (ICD-10)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data.assessment.diagnoses.length === 0 ? [{ icd10_code: '', description: '', is_primary: true }] : data.assessment.diagnoses).map((diagnosis, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3 space-y-2">
                    <Label>ICD-10 Code</Label>
                    <Input
                      placeholder="I10"
                      value={diagnosis.icd10_code}
                      onChange={(e) => {
                        const newDiagnoses = [...data.assessment.diagnoses]
                        if (newDiagnoses[index]) {
                          newDiagnoses[index].icd10_code = e.target.value
                        } else {
                          newDiagnoses.push({ icd10_code: e.target.value, description: '', is_primary: index === 0 })
                        }
                        updateAssessment('diagnoses', newDiagnoses)
                      }}
                    />
                  </div>
                  <div className="col-span-7 space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Essential (primary) hypertension"
                      value={diagnosis.description}
                      onChange={(e) => {
                        const newDiagnoses = [...data.assessment.diagnoses]
                        if (newDiagnoses[index]) {
                          newDiagnoses[index].description = e.target.value
                        } else {
                          newDiagnoses.push({ icd10_code: '', description: e.target.value, is_primary: index === 0 })
                        }
                        updateAssessment('diagnoses', newDiagnoses)
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    {index === 0 && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Primary
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newDiagnoses = [...data.assessment.diagnoses, { icd10_code: '', description: '', is_primary: false }]
                  updateAssessment('diagnoses', newDiagnoses)
                }}
                className="text-sm text-primary hover:underline"
              >
                + Add Another Diagnosis
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Differential Diagnoses</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List differential diagnoses to consider..."
                value={data.assessment.differential_diagnoses.join('\n')}
                onChange={(e) => updateAssessment('differential_diagnoses', e.target.value.split('\n').filter(Boolean))}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Tab */}
        <TabsContent value="plan" className="space-y-6 pr-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Treatment Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Medications, procedures, referrals, labs to order..."
                value={data.plan.treatment_plan}
                onChange={(e) => updatePlan('treatment_plan', e.target.value)}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Follow-up Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Return to clinic in X weeks, call if symptoms worsen..."
                value={data.plan.follow_up_instructions}
                onChange={(e) => updatePlan('follow_up_instructions', e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Patient Education</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Discussed diagnosis, treatment options, and answered patient questions..."
                value={data.plan.patient_education}
                onChange={(e) => updatePlan('patient_education', e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}
