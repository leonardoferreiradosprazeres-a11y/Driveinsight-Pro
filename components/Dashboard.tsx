import React, { useState, useMemo } from 'react';
import { Trip } from '../types';
import { formatCurrency, formatDecimal } from '../services/calculationService';
import { TrendingUp, Wallet, Clock, Activity, Calendar, Map, Gauge } from 'lucide-react';

interface Props {
  history: Trip[];
}

const Dashboard: React.FC<Props> = ({ history }) => {
  const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [hoveredData, setHoveredData] = useState<any | null>(null);

  const filteredHistory = useMemo(() => {
    const now = new Date();
    return history.filter(trip => {
      const tripDate = new Date(trip.timestamp);
      if (filter === 'all') return true;
      if (filter === 'today') {
        return tripDate.getDate() === now.getDate() && 
               tripDate.getMonth() === now.getMonth() && 
               tripDate.getFullYear() === now.getFullYear();
      }
      if (filter === 'week') {
        const diffTime = Math.abs(now.getTime() - tripDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (filter === 'month') {
        return tripDate.getMonth() === now.getMonth() && 
               tripDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [history, filter]);

  const stats = useMemo(() => {
    const totalEarnings = filteredHistory.reduce((acc, curr) => acc + curr.total_price, 0);
    const totalProfit = filteredHistory.reduce((acc, curr) => acc + curr.lucro_liquido, 0);
    const totalFuelCost = filteredHistory.reduce((acc, curr) => acc + curr.custo_total_combustivel, 0);
    const totalTime = filteredHistory.reduce((acc, curr) => acc + curr.total_time_min, 0);
    const totalRides = filteredHistory.length;
    const totalKm = filteredHistory.reduce((acc, curr) => acc + curr.total_distance_km, 0);
    
    // Weighted averages
    const avgProfitPerHour = totalTime > 0 ? (totalProfit / totalTime) * 60 : 0;
    const avgProfitPerRide = totalRides > 0 ? totalProfit / totalRides : 0;
    const avgEarningsPerKm = totalKm > 0 ? totalEarnings / totalKm : 0;

    return { totalEarnings, totalProfit, totalFuelCost, totalTime, totalRides, totalKm, avgProfitPerHour, avgProfitPerRide, avgEarningsPerKm };
  }, [filteredHistory]);

  const filterOptions = [
    { id: 'today', label: 'Hoje' },
    { id: 'week', label: '7 Dias' },
    { id: 'month', label: 'Mês' },
    { id: 'all', label: 'Total' },
  ];

  // --- Chart Logic ---
  const chartData = useMemo(() => {
    // Reverse to show oldest to newest (left to right)
    return [...filteredHistory].reverse();
  }, [filteredHistory]);

  const renderChart = () => {
    if (chartData.length < 2) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm italic">
          Dados insuficientes para exibir o gráfico (mín. 2 viagens)
        </div>
      );
    }

    const height = 180;
    const width = 1000; // SVG internal width
    const padding = 20;

    // Determine scale based on maximum value in the dataset
    const maxVal = Math.max(
      ...chartData.map(d => d.total_price),
      ...chartData.map(d => d.custo_total_combustivel)
    ) * 1.1; // Add 10% headroom

    const minVal = 0;

    const getX = (index: number) => {
      return padding + (index / (chartData.length - 1)) * (width - padding * 2);
    };

    const getY = (value: number) => {
      if (maxVal === 0) return height - padding;
      return height - padding - ((value - minVal) / (maxVal - minVal)) * (height - padding * 2);
    };

    // Ensure we are accessing the correct properties
    const earningsPath = chartData.map((d, i) => 
        `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.total_price)}`
    ).join(' ');

    const costPath = chartData.map((d, i) => 
        `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.custo_total_combustivel)}`
    ).join(' ');

    return (
      <div className="relative w-full h-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible preserve-3d">
          {/* Background Grid */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />

          {/* Lines */}
          <path d={costPath} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 drop-shadow-sm" />
          <path d={earningsPath} fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />

          {/* Interactive Dots */}
          {chartData.map((d, i) => (
            <g key={d.id}>
              {/* Cost Dot - ensured to use custo_total_combustivel */}
              <circle 
                cx={getX(i)} cy={getY(d.custo_total_combustivel)} r="4" fill="#ef4444" 
                className="hover:r-6 transition-all cursor-pointer"
                onMouseEnter={() => setHoveredData({ ...d, type: 'cost', x: getX(i), y: getY(d.custo_total_combustivel) })}
                onMouseLeave={() => setHoveredData(null)}
              />
              {/* Earnings Dot */}
              <circle 
                cx={getX(i)} cy={getY(d.total_price)} r="4" fill="#22c55e" 
                className="hover:r-6 transition-all cursor-pointer"
                onMouseEnter={() => setHoveredData({ ...d, type: 'earn', x: getX(i), y: getY(d.total_price) })}
                onMouseLeave={() => setHoveredData(null)}
              />
            </g>
          ))}
        </svg>
        
        {/* Simple Tooltip Overlay */}
        {hoveredData && (
          <div className="absolute top-0 right-0 bg-gray-900/90 text-white text-xs p-2 rounded shadow-lg pointer-events-none z-10 backdrop-blur-sm">
             <p className="font-bold">{new Date(hoveredData.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
             <p className="text-green-400">Bruto: {formatCurrency(hoveredData.total_price)}</p>
             <p className="text-red-400">Custo: -{formatCurrency(hoveredData.custo_total_combustivel)}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visão geral dos seus ganhos</p>
        </div>
        <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full">
          <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {filterOptions.map(opt => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id as any)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === opt.id 
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Big Profit Card */}
        <div className="col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
          <div className="flex items-center space-x-2 mb-2 opacity-80">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Lucro Líquido</span>
          </div>
          <p className="text-4xl font-black">{formatCurrency(stats.totalProfit)}</p>
          <div className="flex justify-between mt-4 text-xs opacity-90 border-t border-white/20 pt-3">
             <span>Bruto: {formatCurrency(stats.totalEarnings)}</span>
             <span>-{formatCurrency(stats.totalFuelCost)} (Combust.)</span>
          </div>
        </div>

        {/* Small Stats Row 1 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center space-x-2 mb-2 text-green-600 dark:text-green-400">
             <TrendingUp className="w-4 h-4" />
             <span className="text-xs font-bold uppercase">Média/Hora</span>
           </div>
           <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(stats.avgProfitPerHour)}</p>
           <p className="text-[10px] text-gray-400 mt-1">Lucro por hora trab.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center space-x-2 mb-2 text-blue-600 dark:text-blue-400">
             <Calendar className="w-4 h-4" />
             <span className="text-xs font-bold uppercase">Corridas</span>
           </div>
           <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{stats.totalRides}</p>
           <p className="text-[10px] text-gray-400 mt-1">Média {formatCurrency(stats.avgProfitPerRide)}/corrida</p>
        </div>

        {/* Small Stats Row 2 (New Metrics) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center space-x-2 mb-2 text-orange-600 dark:text-orange-400">
             <Map className="w-4 h-4" />
             <span className="text-xs font-bold uppercase">Distância</span>
           </div>
           <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{formatDecimal(stats.totalKm)} km</p>
           <p className="text-[10px] text-gray-400 mt-1">Total percorrido</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center space-x-2 mb-2 text-purple-600 dark:text-purple-400">
             <Gauge className="w-4 h-4" />
             <span className="text-xs font-bold uppercase">Ganho/Km</span>
           </div>
           <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(stats.avgEarningsPerKm)}</p>
           <p className="text-[10px] text-gray-400 mt-1">Valor Bruto / Km</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-between">
             <span className="flex items-center"><Activity className="w-4 h-4 mr-2" /> Movimentação</span>
             <div className="flex gap-2 text-[10px]">
                <span className="flex items-center text-green-600 dark:text-green-400"><div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div> Bruto</span>
                <span className="flex items-center text-red-600 dark:text-red-400"><div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div> Custo</span>
             </div>
          </h3>
          <div className="h-48 w-full">
              {renderChart()}
          </div>
      </div>

      {/* Time Online Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
             <Clock className="w-4 h-4 mr-2" />
             Tempo Online Estimado
          </h3>
          <div className="flex items-end space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(stats.totalTime / 60)}<span className="text-sm text-gray-500 font-normal">h</span> {stats.totalTime % 60}<span className="text-sm text-gray-500 font-normal">min</span>
              </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full mt-3 overflow-hidden">
             <div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
      </div>

    </div>
  );
};

export default Dashboard;