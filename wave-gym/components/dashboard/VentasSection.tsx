'use client';

interface Props {
  ventas: any[];
  fmt: (n: number) => string;
}

export default function VentasSection({ ventas, fmt }: Props) {
  if (ventas.length === 0) {
    return (
      <div className="border border-white/5 bg-[#0A0A0A] p-10 text-center">
        <div className="font-heading text-[11px] text-[#444] tracking-widest">AÚN NO HAY VENTAS REGISTRADAS</div>
      </div>
    );
  }

  return (
    <div className="border border-white/5 bg-[#0A0A0A] overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <div className="font-heading font-bold text-xs tracking-[0.15em] text-white uppercase">Historial de Ventas</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['PLAN', 'MONTO', 'ESTADO', 'FECHA'].map((h) => (
                <th key={h} className="text-left px-5 py-3 font-heading text-[9px] tracking-[0.2em] text-[#444] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ventas.map((v, i) => (
              <tr key={v.id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3 font-heading text-xs text-white tracking-wider uppercase">{v.plan || '—'}</td>
                <td className="px-5 py-3 font-heading text-xs text-white">{fmt(v.monto || 0)}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2 py-0.5 font-heading text-[9px] tracking-widest uppercase ${
                    v.estado === 'aprobado' || v.estado === 'approved'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : v.estado === 'pendiente' || v.estado === 'pending'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {v.estado || 'desconocido'}
                  </span>
                </td>
                <td className="px-5 py-3 font-body text-[11px] text-[#555]">
                  {v.created_at ? new Date(v.created_at).toLocaleDateString('es-CL') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
