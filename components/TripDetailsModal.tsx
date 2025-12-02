import React from 'react';
import { Trip } from '../types';
import { formatCurrency, formatDecimal } from '../services/calculationService';
import { X, MapPin, TrendingUp, Fuel, Share2, Trash2, ExternalLink } from 'lucide-react';

interface Props {
  trip: Trip;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const TripDetailsModal: React.FC<Props> = ({ trip, onClose, onDelete }) => {
  // Traffic light colors
  const colorMap = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };
  
  const statusColor = colorMap[trip.traffic_light];

  const handleDelete = () => {
    if(window.confirm('Tem certeza que deseja apagar esta corrida?')) {
        onDelete(trip.id);
        onClose();
    }
  }

  const openMap = (address: string) => {
    if (!address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
           <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
              <span className="font-bold text-gray-700 dark:text-gray-200">{new Date(trip.timestamp).toLocaleDateString()}</span>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium uppercase">{trip.platform}</span>
           </div>
           <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
             <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
           </button>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto p-5 space-y-6">
            
            {/* Big Numbers */}
            <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Valor da Corrida</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">{formatCurrency(trip.total_price)}</p>
            </div>

            {/* Profit Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-900/50">
                    <div className="flex items-center gap-1 mb-1 text-green-700 dark:text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Lucro</span>
                    </div>
                    <p className="text-xl font-bold text-green-800 dark:text-green-300">{formatCurrency(trip.lucro_liquido)}</p>
                    <p className="text-xs text-green-600 dark:text-green-500">{formatDecimal(trip.percentual_lucro)}% margem</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50">
                     <div className="flex items-center gap-1 mb-1 text-red-700 dark:text-red-400">
                        <Fuel className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Custo</span>
                    </div>
                    <p className="text-xl font-bold text-red-800 dark:text-red-300">-{formatCurrency(trip.custo_total_combustivel)}</p>
                    <p className="text-xs text-red-600 dark:text-red-500">{formatDecimal(trip.litros_gastos, 2)} L consumidos</p>
                </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Rentabilidade</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{formatDecimal(trip.rentabilidade)}x</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Tempo Total</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{trip.total_time_min} min</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Distância Total</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{trip.total_distance_km} km</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Ganho por Hora</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{formatCurrency(trip.ganho_por_h)}</span>
                </div>
                 <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Velocidade Média</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{formatDecimal(trip.vel_media_real)} km/h</span>
                </div>
            </div>

            {/* Addresses with Individual Maps Buttons */}
            <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-xs">
                
                {/* Origin */}
                <div className="flex gap-3">
                    <div className="w-2 flex flex-col items-center pt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                        <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 my-1"></div>
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-400 font-medium mb-1 uppercase text-[10px]">Embarque</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium text-sm leading-snug mb-2">{trip.origin_address || 'Endereço não identificado'}</p>
                        <button 
                            onClick={() => openMap(trip.origin_address)}
                            className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                            <ExternalLink className="w-3 h-3 mr-1" /> Ver no Maps
                        </button>
                    </div>
                </div>

                {/* Destination */}
                <div className="flex gap-3">
                    <div className="w-2 flex flex-col items-center">
                         <div className="w-2.5 h-2.5 rounded-none bg-black dark:bg-white transform rotate-45"></div>
                    </div>
                    <div className="flex-1">
                         <p className="text-gray-400 font-medium mb-1 uppercase text-[10px]">Destino</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium text-sm leading-snug mb-2">{trip.destination_address || 'Endereço não identificado'}</p>
                        <button 
                            onClick={() => openMap(trip.destination_address)}
                            className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                            <ExternalLink className="w-3 h-3 mr-1" /> Ver no Maps
                        </button>
                    </div>
                </div>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex gap-3">
             <button 
                onClick={handleDelete}
                className="w-full flex items-center justify-center py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
             >
                 <Trash2 className="w-4 h-4 mr-2" /> Excluir Corrida
             </button>
        </div>

      </div>
    </div>
  );
};

export default TripDetailsModal;