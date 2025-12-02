import React, { useState } from 'react';
import { Trip } from '../types';
import { formatCurrency, formatDecimal } from '../services/calculationService';
import { X, MapPin, TrendingUp, Fuel, ChevronUp } from 'lucide-react';

interface Props {
  trip: Trip;
  onClose: () => void;
  onSave: () => void;
  isSaved: boolean;
}

const FloatingCard: React.FC<Props> = ({ trip, onClose, onSave, isSaved }) => {
  const [expanded, setExpanded] = useState(true);

  // Traffic light colors
  const colorMap = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };
  
  const bgMap = {
    green: 'bg-green-50 border-green-200 dark:bg-green-900/40 dark:border-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/40 dark:border-yellow-800',
    red: 'bg-red-50 border-red-200 dark:bg-red-900/40 dark:border-red-800',
  };

  const textMap = {
    green: 'text-green-800 dark:text-green-300',
    yellow: 'text-yellow-800 dark:text-yellow-300',
    red: 'text-red-800 dark:text-red-300',
  };

  const statusColor = colorMap[trip.traffic_light];
  const cardStyle = bgMap[trip.traffic_light];
  const textStyle = textMap[trip.traffic_light];

  if (!expanded) {
    return (
      <div 
        onClick={() => setExpanded(true)}
        className="absolute top-24 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-xl rounded-full p-2 border-2 border-indigo-500 cursor-pointer animate-pulse z-50 flex items-center gap-2 pr-4"
      >
        <div className={`w-4 h-4 rounded-full ${statusColor}`}></div>
        <span className="text-xs font-bold text-gray-800 dark:text-white">{formatCurrency(trip.total_price)}</span>
      </div>
    );
  }

  return (
    <div className={`absolute top-16 left-4 right-4 z-50 rounded-xl shadow-2xl border ${cardStyle} backdrop-blur-md transition-all duration-300 overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/20">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${statusColor} shadow-sm`}></div>
          <span className="font-bold text-sm text-gray-800 dark:text-white uppercase tracking-tight">DriveInsight PRO</span>
          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium">{trip.platform}</span>
        </div>
        <div className="flex items-center space-x-1">
             <button onClick={() => setExpanded(false)} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded">
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <button onClick={onClose} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded">
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="p-4 space-y-3">
        {/* Row 1: Big Value */}
        <div className="flex justify-between items-baseline">
            <div>
                 <p className="text-xs text-gray-500 dark:text-gray-300 uppercase font-semibold">Valor da Corrida</p>
                 <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{formatCurrency(trip.total_price)}</p>
            </div>
            <div className={`text-right ${textStyle}`}>
                <p className="text-xs uppercase font-semibold">Rentabilidade</p>
                <p className="text-xl font-bold">{formatDecimal(trip.rentabilidade)}x</p>
            </div>
        </div>

        {/* Row 2: Profit & Cost */}
        <div className="grid grid-cols-2 gap-2 bg-white/50 dark:bg-black/20 p-2 rounded-lg">
            <div>
                <div className="flex items-center space-x-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Lucro Líquido</span>
                </div>
                <p className="text-base font-bold text-green-700 dark:text-green-400">{formatCurrency(trip.lucro_liquido)}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{formatDecimal(trip.percentual_lucro)}% da corrida</p>
            </div>
            <div>
                <div className="flex items-center space-x-1 mb-1">
                    <Fuel className="w-3 h-3 text-red-500 dark:text-red-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Combustível</span>
                </div>
                <p className="text-base font-bold text-red-700 dark:text-red-400">-{formatCurrency(trip.custo_total_combustivel)}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{formatDecimal(trip.litros_gastos, 3)} L consumidos</p>
            </div>
        </div>

        {/* Row 3: Metrics */}
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 border-t border-black/5 dark:border-white/5 pt-2">
            <div className="text-center">
                <p className="font-semibold">{trip.total_time_min} min</p>
                <p className="text-[10px] opacity-70">Tempo Total</p>
            </div>
            <div className="text-center border-l border-black/5 dark:border-white/5 pl-2">
                <p className="font-semibold">{trip.total_distance_km} km</p>
                <p className="text-[10px] opacity-70">Distância</p>
            </div>
             <div className="text-center border-l border-black/5 dark:border-white/5 pl-2">
                <p className="font-semibold">{formatCurrency(trip.ganho_por_h)}</p>
                <p className="text-[10px] opacity-70">Ganho/Hora</p>
            </div>
             <div className="text-center border-l border-black/5 dark:border-white/5 pl-2">
                <p className="font-semibold">{formatCurrency(trip.ganho_por_km)}</p>
                <p className="text-[10px] opacity-70">Ganho/Km</p>
            </div>
        </div>
        
        {/* Addresses - Explicitly Shown */}
        <div className="space-y-2 bg-white/40 dark:bg-black/20 p-2 rounded-lg text-xs mt-2">
            <div className="flex gap-2">
                <div className="min-w-[45px] text-gray-500 dark:text-gray-400 font-medium">Origem:</div>
                <div className="text-gray-800 dark:text-gray-200 truncate font-medium">{trip.origin_address || '...'}</div>
            </div>
            <div className="flex gap-2">
                <div className="min-w-[45px] text-gray-500 dark:text-gray-400 font-medium">Destino:</div>
                <div className="text-gray-800 dark:text-gray-200 truncate font-medium">{trip.destination_address || '...'}</div>
            </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="grid grid-cols-2 gap-1 p-2 bg-white/60 dark:bg-black/30">
        <button 
            onClick={onSave}
            disabled={isSaved}
            className={`py-2 rounded-lg text-xs font-bold transition-colors ${isSaved ? 'bg-gray-200 dark:bg-gray-700 text-gray-400' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'}`}
        >
            {isSaved ? 'Salvo' : 'Salvar Corrida'}
        </button>
        <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.origin_address)}`}
            target="_blank" rel="noreferrer"
            className="py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold text-center hover:bg-indigo-200 dark:hover:bg-indigo-900/70 flex items-center justify-center"
        >
            <MapPin className="w-3 h-3 mr-1" /> Maps
        </a>
      </div>
    </div>
  );
};

export default FloatingCard;