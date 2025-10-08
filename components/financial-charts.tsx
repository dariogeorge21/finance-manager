"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/currency'
import { ProjectStats } from '@/types'

interface FinancialChartsProps {
  stats: ProjectStats
  showAmounts: boolean
}

const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B']

export function FinancialCharts({ stats, showAmounts }: FinancialChartsProps) {
  // Helper function to conditionally display amounts
  const displayAmount = (amount: number) => {
    return showAmounts ? formatCurrency(amount) : '₹•••••'
  }

  const pieData = [
    { name: 'Income', value: stats.totalIncome, color: '#10B981' },
    { name: 'Expenses', value: stats.totalExpenses, color: '#EF4444' },
  ]

  const barData = [
    {
      name: 'Financial Overview',
      Income: stats.totalIncome,
      Expenses: stats.totalExpenses,
      Balance: stats.netBalance,
    },
  ]

  // Check if there's any financial data
  const hasData = stats.totalIncome > 0 || stats.totalExpenses > 0

  if (!hasData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              No financial records
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              No financial records
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 transition-all duration-200">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => showAmounts ? `${name}: ${formatCurrency(value as number)}` : name}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => displayAmount(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 transition-all duration-200">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => showAmounts ? `₹${(value / 1000).toFixed(0)}K` : '₹•••'} />
                <Tooltip formatter={(value) => displayAmount(value as number)} />
                <Legend />
                <Bar dataKey="Income" fill="#10B981" name="Income" />
                <Bar dataKey="Expenses" fill="#EF4444" name="Expenses" />
                <Bar dataKey="Balance" fill={stats.netBalance >= 0 ? '#3B82F6' : '#F59E0B'} name="Net Balance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}