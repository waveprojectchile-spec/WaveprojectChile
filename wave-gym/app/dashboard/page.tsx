export default function DashboardPage() {
  // Datos de prueba (mockups) para el dashboard de Ventas
  const metrics = [
    { label: 'TOTAL INGRESOS', value: '$4.250.000' },
    { label: 'VENTAS', value: '142' },
    { label: 'CLIENTES ACTIVOS', value: '328' },
  ];

  const recentSales = [
    { id: '1', name: 'JUAN PÉREZ', plan: 'ANUAL', amount: '$350.000', status: 'COMPLETADO', date: '2026-06-15' },
    { id: '2', name: 'MARÍA GONZÁLEZ', plan: 'MENSUAL', amount: '$45.000', status: 'COMPLETADO', date: '2026-06-15' },
    { id: '3', name: 'CARLOS SILVA', plan: 'TRIMESTRAL', amount: '$120.000', status: 'PENDIENTE', date: '2026-06-14' },
    { id: '4', name: 'ANA ROJAS', plan: 'SEMESTRAL', amount: '$200.000', status: 'COMPLETADO', date: '2026-06-14' },
    { id: '5', name: 'LUIS MARTÍNEZ', plan: 'ANUAL', amount: '$350.000', status: 'COMPLETADO', date: '2026-06-13' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-2">RESUMEN DE VENTAS</h1>
        <p className="text-neutral-400 text-sm uppercase tracking-wider font-bold">MÉTRICAS GENERALES Y ÚLTIMAS TRANSACCIONES</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-neutral-950 border border-neutral-800 p-6">
            <h3 className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-2">{metric.label}</h3>
            <p className="text-3xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Sales Table */}
      <div className="bg-neutral-950 border border-neutral-800">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-widest text-white">ÚLTIMAS VENTAS</h2>
          <button className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">
            VER TODAS →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase tracking-widest bg-neutral-900/50">
              <tr>
                <th className="px-6 py-4 font-bold">CLIENTE</th>
                <th className="px-6 py-4 font-bold">PLAN</th>
                <th className="px-6 py-4 font-bold">MONTO</th>
                <th className="px-6 py-4 font-bold">ESTADO</th>
                <th className="px-6 py-4 font-bold">FECHA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4 font-bold">{sale.name}</td>
                  <td className="px-6 py-4 font-bold tracking-wider">{sale.plan}</td>
                  <td className="px-6 py-4">{sale.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                      sale.status === 'COMPLETADO' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
