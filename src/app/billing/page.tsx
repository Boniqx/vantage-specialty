'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { BillingStats } from '@/components/billing/billing-stats'
import { InvoicesTable } from '@/components/billing/invoices-table'
import { CreateInvoiceDialog } from '@/components/billing/create-invoice-dialog'
import { getBillingStats, getInvoices } from '@/services/billing'
import type { Invoice } from '@/lib/types/database'
import { Loader2 } from 'lucide-react'

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ monthlyRevenue: 0, outstandingBalance: 0, invoicesOverdue: 0 })
  const [invoices, setInvoices] = useState<Invoice[]>([])

  const loadData = useCallback(async () => {
      try {
          const [statsData, invoicesData] = await Promise.all([
              getBillingStats(),
              getInvoices({ limit: 50 })
          ])
          
          setStats(statsData)
          setInvoices(invoicesData as Invoice[] || [])
      } catch (error) {
          console.error('Error loading billing data:', error)
      } finally {
          setIsLoading(false)
      }
  }, [])

  useEffect(() => {
     loadData()
  }, [loadData])

  if (isLoading) {
      return (
          <div className="flex h-full items-center justify-center min-h-screen">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
              <p className="text-muted-foreground">
                Manage invoices, payments, and financial reporting.
              </p>
            </div>
            <CreateInvoiceDialog onInvoiceCreated={loadData} />
          </div>

          <BillingStats stats={stats} />

          <div className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Recent Invoices</h2>
              <InvoicesTable invoices={invoices} />
          </div>
        </main>
      </div>
    </div>
  )
}
