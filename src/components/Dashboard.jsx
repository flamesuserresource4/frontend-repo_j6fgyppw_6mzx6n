import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ start: '', end: '', channel: '', item: '' })

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.start) params.append('start', filters.start)
      if (filters.end) params.append('end', filters.end)
      if (filters.channel) params.append('channel', filters.channel)
      if (filters.item) params.append('item', filters.item)
      const res = await fetch(`${baseUrl}/dashboard?${params.toString()}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white">GRABB Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <div className="text-blue-200 col-span-4">Loading...</div>
        ) : error ? (
          <div className="text-red-400 col-span-4">{error}</div>
        ) : (
          <>
            <Stat title="Sales Today" value={`₹${(data?.sales_today || 0).toFixed(2)}`} />
            <Stat title="Orders Today" value={data?.orders_today || 0} />
            <Stat title="AOV" value={`₹${(data?.aov || 0).toFixed(2)}`} />
            <Stat title="Avg Kitchen Time" value={`${Math.floor((data?.avg_kitchen_time_seconds||0)/60)}m ${(data?.avg_kitchen_time_seconds||0)%60}s`} />
          </>
        )}
      </div>

      {!loading && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Food Cost %"><div className="text-3xl font-semibold text-blue-200">{data.food_cost_percent || 0}%</div></Card>
          <Card title="Waste %"><div className="text-3xl font-semibold text-blue-200">{data.waste_percent || 0}%</div></Card>
          <Card title="Top 10 Items">
            <ul className="text-blue-100 text-sm space-y-2">
              {data.top_items?.map((t, i) => (
                <li key={i} className="flex justify-between"><span>{t.menu_item_id}</span><span>₹{t.sales.toFixed(2)}</span></li>
              ))}
            </ul>
          </Card>
          <Card title="Sales by Channel">
            <ul className="text-blue-100 text-sm space-y-2">
              {Object.entries(data.sales_by_channel||{}).map(([k,v]) => (
                <li key={k} className="flex justify-between"><span>{k}</span><span>₹{v.toFixed(2)}</span></li>
              ))}
            </ul>
          </Card>
          <Card title="Orders by Hour">
            <ul className="text-blue-100 text-sm space-y-2">
              {Object.entries(data.orders_by_hour||{}).map(([k,v]) => (
                <li key={k} className="flex justify-between"><span>{k}</span><span>{v}</span></li>
              ))}
            </ul>
          </Card>
          <Card title="Reorder Alerts">
            <ul className="text-blue-100 text-sm space-y-2">
              {data.reorder_alerts?.length ? data.reorder_alerts.map((a, i) => (
                <li key={i} className="flex justify-between text-amber-300"><span>{a.ingredient}</span><span>{a.stock}</span></li>
              )) : <div className="text-blue-300">All good</div>}
            </ul>
          </Card>
        </div>
      )}

      <div className="bg-slate-800/40 border border-blue-500/20 rounded-xl p-4 text-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="bg-slate-900/60 border border-blue-500/20 rounded px-3 py-2 text-sm" type="datetime-local" value={filters.start} onChange={e=>setFilters({...filters,start:e.target.value})} />
          <input className="bg-slate-900/60 border border-blue-500/20 rounded px-3 py-2 text-sm" type="datetime-local" value={filters.end} onChange={e=>setFilters({...filters,end:e.target.value})} />
          <input className="bg-slate-900/60 border border-blue-500/20 rounded px-3 py-2 text-sm" placeholder="Channel" value={filters.channel} onChange={e=>setFilters({...filters,channel:e.target.value})} />
          <div className="flex gap-2">
            <input className="flex-1 bg-slate-900/60 border border-blue-500/20 rounded px-3 py-2 text-sm" placeholder="Item ID" value={filters.item} onChange={e=>setFilters({...filters,item:e.target.value})} />
            <button onClick={fetchData} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4">Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ title, value }) {
  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <div className="text-blue-300 text-sm">{title}</div>
      <div className="text-white text-2xl font-semibold">{value}</div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <div className="text-blue-300 text-sm mb-3 font-semibold">{title}</div>
      {children}
    </div>
  )
}
