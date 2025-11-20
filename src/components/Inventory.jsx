import { useEffect, useState } from 'react'

export default function Inventory() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [ingredients, setIngredients] = useState([])
  const [form, setForm] = useState({ name: '', unit: 'kg', unit_cost: 0, current_stock: 0, lead_time_days: 0, safety_stock: 0, reorder_point: 0 })

  const load = async () => {
    const res = await fetch(`${baseUrl}/ingredients`)
    const json = await res.json()
    setIngredients(json)
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await fetch(`${baseUrl}/ingredients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm({ name: '', unit: 'kg', unit_cost: 0, current_stock: 0, lead_time_days: 0, safety_stock: 0, reorder_point: 0 })
    load()
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white">Ingredients</h2>
      <form onSubmit={submit} className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-800/50 p-3 rounded">
        {['name','unit','unit_cost','current_stock','lead_time_days','safety_stock','reorder_point'].map((k)=> (
          <input key={k} required={k==='name'} value={form[k]} onChange={e=>setForm({...form, [k]: k==='name'||k==='unit'? e.target.value : Number(e.target.value)})} placeholder={k} className="bg-slate-900/60 border border-blue-500/20 rounded px-3 py-2 text-sm text-white" />
        ))}
        <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2">Add</button>
      </form>
      <div className="overflow-auto">
        <table className="min-w-full text-sm text-blue-100">
          <thead>
            <tr className="bg-slate-800/70">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Unit</th>
              <th className="p-2 text-left">Unit Cost</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Lead Time</th>
              <th className="p-2 text-left">Safety</th>
              <th className="p-2 text-left">Reorder</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((i)=> (
              <tr key={i._id} className="border-b border-blue-500/10">
                <td className="p-2">{i.name}</td>
                <td className="p-2">{i.unit}</td>
                <td className="p-2">{i.unit_cost}</td>
                <td className="p-2">{i.current_stock}</td>
                <td className="p-2">{i.lead_time_days}</td>
                <td className="p-2">{i.safety_stock}</td>
                <td className="p-2">{i.reorder_point}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
