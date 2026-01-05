'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { ReportCard } from '@/components/reports/report-card'
import { DemographicsCharts } from '@/components/reports/demographics-charts'
import { FinancialCharts } from '@/components/reports/financial-charts'
import { getReportStats } from '@/services/reports'
import { Loader2, Users, Calendar, DollarSign, Activity } from 'lucide-react'

export default function ReportsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const load = async () => {
            try {
                const stats = await getReportStats()
                setData(stats)
            } catch (e) {
                console.error("Failed to load reports", e)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="pl-64 transition-all duration-300">
                <TopBar />
                <main className="p-6 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                        <p className="text-muted-foreground">
                            Practice performance insights and trends.
                        </p>
                    </div>

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ReportCard 
                            title="Total Patients" 
                            value={data?.overview?.totalPatients} 
                            icon={Users}
                            description="Active patients"
                        />
                         <ReportCard 
                            title="Monthly Revenue" 
                            value={`$${data?.overview?.totalRevenue?.toLocaleString()}`} 
                            icon={DollarSign}
                            description="Total payments received"
                        />
                         <ReportCard 
                            title="Active Appointments" 
                            value={data?.overview?.activeAppointments} 
                            icon={Calendar}
                            description="Scheduled or completed"
                        />
                         <ReportCard 
                            title="No-Show Rate" 
                            value={`${data?.overview?.noShowRate?.toFixed(1)}%`} 
                            icon={Activity}
                            description="Missed appointments"
                        />
                    </div>

                    {/* Charts */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold tracking-tight">Patient Demographics</h2>
                        <DemographicsCharts 
                            ageData={data?.demographics?.age || []}
                            genderData={data?.demographics?.gender || []}
                        />

                        <h2 className="text-xl font-semibold tracking-tight">Financial & Operational Trends</h2>
                        <FinancialCharts 
                            revenueData={data?.financials?.revenueTrend || []}
                            volumeData={data?.operations?.dailyVolume || []}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}
