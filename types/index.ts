export interface Project {
  id: string
  project_name: string
  password_hash: string
  created_at: string
  updated_at: string
}

export interface Income {
  id: string
  project_id: string
  name: string
  phone_number?: string
  amount: number
  description?: string
  date: string
  called_status: boolean
  called_by?: string
  created_at: string
}

export interface Expense {
  id: string
  project_id: string
  description: string
  amount: number
  date: string
  category: string
  created_at: string
}

export interface ProjectStats {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  incomeCount: number
  expenseCount: number
}

export interface CreateProjectData {
  project_name: string
  password: string
}

export interface AccessProjectData {
  project_name: string
  password: string
}

export interface CreateIncomeData {
  name: string
  phone_number?: string
  amount: number
  description?: string
  date: string
  called_status?: boolean
  called_by?: string
}

export interface CreateExpenseData {
  description: string
  amount: number
  date: string
  category?: string
}
export interface ProjectSummary {
  id: string;
  project_name: string;
  created_at: string;
}

export interface Project extends ProjectSummary {
  password_hash: string;
  updated_at: string;
}

export interface DonationData {
  name: string
  phone_number: string
  amount: number
  message?: string
}

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  notes: Record<string, string>
  created_at: number
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}