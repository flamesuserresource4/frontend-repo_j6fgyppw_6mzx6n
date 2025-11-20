import Dashboard from './components/Dashboard'
import KitchenQueue from './components/KitchenQueue'
import Inventory from './components/Inventory'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="sticky top-0 z-10 backdrop-blur border-b border-blue-500/10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="text-white font-bold text-lg">GRABB Ops</div>
          <nav className="flex gap-3 text-sm">
            <a href="#dashboard" className="text-blue-300 hover:text-white">Dashboard</a>
            <a href="#queue" className="text-blue-300 hover:text-white">Kitchen Queue</a>
            <a href="#inventory" className="text-blue-300 hover:text-white">Inventory</a>
          </nav>
        </div>
      </div>

      <section id="dashboard" className="max-w-7xl mx-auto px-4 py-6">
        <Dashboard />
      </section>
      <section id="queue" className="max-w-7xl mx-auto px-4 py-6">
        <KitchenQueue />
      </section>
      <section id="inventory" className="max-w-7xl mx-auto px-4 py-6">
        <Inventory />
      </section>
    </div>
  )
}

export default App