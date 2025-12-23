
export function ArtistSpendingChart({ data }: { data: MonthlyArtistSpending }) {
  return (
    <div className="bg-gradient-to-br from-background to-blue-50 dark:to-[#232329] border border-border/20 rounded-xl p-3 mb-8 shadow-sm px-2 sm:px-6">
      <h2 className="text-lg font-semibold mb-2 text-black dark:text-white px-2 sm:px-6 text-center w-full">Gastos/mes</h2>
      <div className="h-48 w-full flex items-center justify-center bg-white/60 dark:bg-background/60 rounded-lg border border-border/10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, fontSize: 13, color: '#232329', border: '1px solid #e5e7eb' }} cursor={{ fill: '#e0e7ff', opacity: 0.2 }} />
            <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
import { MonthlyArtistSpending } from '@/types/venue-dashboard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
