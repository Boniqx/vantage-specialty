import { supabase } from '@/lib/supabase'
import type { Invoice, InvoiceItem, Payment, InvoiceStatus } from '@/lib/types/database'

export type CreateInvoiceDTO = {
    patient_id: string
    appointment_id?: string
    due_date?: string
    items: {
        description: string
        quantity: number
        unit_price: number
    }[]
}

/**
 * Create a new invoice with line items
 */
export async function createInvoice(data: CreateInvoiceDTO) {
    // 1. Calculate total
    const total_amount = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

    // 2. Insert Invoice
    const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
            patient_id: data.patient_id,
            appointment_id: data.appointment_id,
            due_date: data.due_date,
            total_amount,
            status: 'draft'
        })
        .select()
        .single()

    if (invoiceError) throw invoiceError

    // 3. Insert Items
    const itemsWithInvoiceId = data.items.map(item => ({
        invoice_id: invoice.id,
        ...item
    }))

    const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsWithInvoiceId)

    if (itemsError) throw itemsError

    return invoice
}

/**
 * Get all invoices with options
 */
export async function getInvoices(options?: { status?: InvoiceStatus, limit?: number }) {
    let query = supabase
        .from('invoices')
        .select(`
            *,
            patient:patients(first_name, last_name, mrn),
            items:invoice_items(*),
            payments:payments(*)
        `)
        .order('created_at', { ascending: false })

    if (options?.status) {
        query = query.eq('status', options.status)
    }

    if (options?.limit) {
        query = query.limit(options.limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data
}

/**
 * Get single invoice details
 */
export async function getInvoiceById(id: string) {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            *,
            patient:patients(*),
            appointment:appointments(*),
            items:invoice_items(*),
            payments:payments(*)
        `)
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

/**
 * Add a payment to an invoice
 */
export type AddPaymentDTO = {
    invoice_id: string
    amount: number
    method: Payment['method']
    notes?: string,
    created_by: string
}

export async function addPayment(payment: AddPaymentDTO) {
    // 1. Record Payment
    const { data: paymentRecord, error: paymentError } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single()

    if (paymentError) throw paymentError

    // 2. Update Invoice Status Check
    // Fetch current totals
    const invoice = await getInvoiceById(payment.invoice_id)
    const totalPaid = invoice.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0

    let newStatus: InvoiceStatus = invoice.status
    if (totalPaid >= invoice.total_amount) {
        newStatus = 'paid'
    } else if (totalPaid > 0) {
        // partial payment logic if needed, or keep as sent/overdue
        if (invoice.status === 'draft') newStatus = 'sent'
    }

    if (newStatus !== invoice.status) {
        await supabase
            .from('invoices')
            .update({ status: newStatus })
            .eq('id', invoice.id)
    }

    return paymentRecord
}

/**
 * Get Billing Stats for Dashboard
 */
export async function getBillingStats() {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()

    // Revenue this month
    const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .gte('transaction_date', firstDayOfMonth)

    const monthlyRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0

    // Outstanding Balance (All Unpaid/Sent/Overdue invoices)
    const { data: openInvoices } = await supabase
        .from('invoices')
        .select('total_amount, payments(amount)')
        .in('status', ['sent', 'overdue'])

    let outstanding = 0
    openInvoices?.forEach((inv: any) => {
        const paid = inv.payments.reduce((s: number, p: any) => s + p.amount, 0)
        outstanding += (inv.total_amount - paid)
    })

    return {
        monthlyRevenue,
        outstandingBalance: outstanding,
        invoicesOverdue: 0 // Placeholder or can query count
    }
}
