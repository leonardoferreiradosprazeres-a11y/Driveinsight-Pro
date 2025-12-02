import React from 'react';
import { Trip } from '../types';
import { formatCurrency, formatDecimal } from '../services/calculationService';
import { Clock, Navigation, Trash2, MapPin } from 'lucide-react';

interface Props {
  trips: Trip[];
  onClear: () => void;
  onSelectTrip: (trip: Trip) => void;
}

const HistoryTable: React.FC<Props> = ({ trips, onClear, onSelectTrip }) => {
  if (trips.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p className="text-lg font-medium">Histórico vazio</p>
        <p className="text-sm opacity-70">Suas corridas salvas aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex justify-between items-center px-4 py-4 sticky top-0 bg-gray-100/95 dark:bg-gray-900/95 backdrop-blur z-10 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Histórico</h2>
        <button 
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="flex items-center text-xs font-semibold px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors cursor-pointer"
        >
            <Trash2 className="w-3 h-3 mr-1" /> Limpar
        </button>
      </div>

      <div className="space-y-3 px-4 mt-4">
        {trips.map((trip) => (
          <div 
            key={trip.id} 
            onClick={() => onSelectTrip(trip)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-3 active:scale-[0.98] transition-transform cursor-pointer"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start">
               <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${trip.traffic_light === 'green' ? 'bg-green-500' : trip.traffic_light === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">{formatCurrency(trip.total_price)}</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(trip.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
               </div>
               <div className="text-right">
                  <span className="block text-sm font-bold text-green-600 dark:text-green-400">Lucro: {formatCurrency(trip.lucro_liquido)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{formatDecimal(trip.rentabilidade)}x rentab.</span>
               </div>
            </div>
            
            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-2 text-xs bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <span className="block text-gray-400 font-medium mb-0.5">Tempo</span>
                    <span className="font-bold text-gray-700 dark:text-gray-200">{trip.total_time_min} min</span>
                </div>
                <div className="text-center border-l border-gray-200 dark:border-gray-600">
                    <span className="block text-gray-400 font-medium mb-0.5">Distância</span>
                    <span className="font-bold text-gray-700 dark:text-gray-200">{trip.total_distance_km} km</span>
                </div>
                <div className="text-center border-l border-gray-200 dark:border-gray-600">
                    <span className="block text-gray-400 font-medium mb-0.5">Combust.</span>
                    <span className="font-bold text-red-500 dark:text-red-400">-{formatCurrency(trip.custo_total_combustivel)}</span>
                </div>
            </div>

            {/* Address Row - Shows both Origin and Destination */}
            <div className="flex flex-col gap-1.5 mt-1">
                 <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="min-w-[12px] flex justify-center mr-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    </div>
                    <span className="truncate">{trip.origin_address || "Endereço de origem não identificado"}</span>
                 </div>
                 <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="min-w-[12px] flex justify-center mr-2">
                        <MapPin className="w-3 h-3 text-gray-800 dark:text-white" />
                    </div>
                    <span className="truncate font-medium text-gray-700 dark:text-gray-300">{trip.destination_address || "Endereço de destino não identificado"}</span>
                 </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryTable;