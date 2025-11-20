import { useEffect, useState, useRef } from 'react'

function Timer({ startTime, endTime }) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const tick = () => {
      const start = startTime ? new Date(startTime).getTime() : Date.now()
      const end = endTime ? new Date(endTime).getTime() : Date.now()
      setSeconds(Math.max(0, Math.floor((end - start) / 1000)))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startTime, endTime])
  const m = Math.floor(seconds/60)
  const s = seconds%60
  return <span className="font-mono">{m.toString().padStart(2,'0')}:{s.toString().padStart(2,'0')}</span>
}

export default function KitchenQueue() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${baseUrl}/orders?status=prepping`)
      const prepping = await res.json()
      const res2 = await fetch(`${baseUrl}/orders?status=placed`)
      const placed = await res2.json()
      setOrders([...(prepping||[]), ...(placed||[])])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const id = setInterval(fetchOrders, 3000)
    return () => clearInterval(id)
  }, [])

  const updateStatus = async (o, next) => {
    // simple patch via webhook order creation is not ideal; provide a patch endpoint later
    // For now, simulate by printing
    alert(`Update ${o.order_number} -> ${next}`)
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white">Kitchen Queue</h2>
      {loading ? <div className="text-blue-200">Loading...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {orders.map(o => (
            <div key={o._id} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-white font-semibold">#{o.order_number}</div>
                <div className="text-xs px-2 py-1 rounded bg-blue-600 text-white">{o.status}</div>
              </div>
              <div className="text-blue-200 text-sm mb-3">Channel: {o.channel}</div>
              <div className="text-blue-300 mb-3">Timer: <Timer startTime={o.prep_start||o.order_time} endTime={o.handover_time} /></div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={()=>updateStatus(o,'prepping')} className="bg-amber-500 hover:bg-amber-400 text-white rounded px-3 py-2 text-sm">Start Prep</button>
                <button onClick={()=>updateStatus(o,'ready')} className="bg-green-600 hover:bg-green-500 text-white rounded px-3 py-2 text-sm">Mark Ready</button>
                <button onClick={()=>updateStatus(o,'packed')} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2 text-sm">Packed</button>
                <button onClick={()=>updateStatus(o,'handed_over')} className="bg-purple-600 hover:bg-purple-500 text-white rounded px-3 py-2 text-sm">Handover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
