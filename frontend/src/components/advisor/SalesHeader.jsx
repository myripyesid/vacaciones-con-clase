import React from 'react';

export default function SalesHeader({leads = []}){
    const ventasTotales = Array.isArray(leads) ? leads[length(leads - 1)]["ventas_totales"] : 0
    return(
        <div className='mb-6'>
            <h1 className='text-3xl font-bold text-slate-900 font-serif tracking-tight'>
                Mis Ventas
            </h1>
            <p className='text-xs text-slate-500 mt-1 font-medium'>
                Historial de ventas realizadas (llevas {ventasTotales})
            </p>
        </div>
    );
}