import React from 'react';
import { UserSettings } from '../types';
import { Save, RefreshCw, Moon, Sun } from 'lucide-react';

interface Props {
  settings: UserSettings;
  onSave: (s: UserSettings) => void;
  onReset: () => void;
}

const SettingsForm: React.FC<Props> = ({ settings, onSave, onReset }) => {
  const [localSettings, setLocalSettings] = React.useState<UserSettings>(settings);

  const handleChange = (field: keyof UserSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeToggle = () => {
    const newTheme = localSettings.theme === 'dark' ? 'light' : 'dark';
    const newSettings = { ...localSettings, theme: newTheme };
    setLocalSettings(newSettings);
    // Auto-save just the theme for instant feedback
    onSave(newSettings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-20 mx-4 mt-4">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Ajustes</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Theme Toggle */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                {localSettings.theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-orange-400" />}
             </div>
             <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Modo Escuro</span>
          </div>
          <button
            type="button"
            onClick={handleThemeToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              localSettings.theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Velocidade Média de Referência */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Velocidade Média Ref. (km/h)</label>
          <input
            type="number"
            step="0.1"
            value={localSettings.v_mean_ref}
            onChange={(e) => handleChange('v_mean_ref', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Usado para calcular o tempo base por km.</p>
        </div>

        {/* Consumo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Consumo (km/L)</label>
            <input
              type="number"
              step="0.1"
              value={localSettings.consumo_km_per_l}
              onChange={(e) => handleChange('consumo_km_per_l', parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
            <select
              value={localSettings.fuel_type}
              onChange={(e) => handleChange('fuel_type', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="GASOLINA">Gasolina</option>
              <option value="ETANOL">Etanol</option>
              <option value="GNV">GNV</option>
            </select>
          </div>
        </div>

        {/* Preço Combustível */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preço Combustível (R$/L)</label>
          <input
            type="number"
            step="0.01"
            value={localSettings.preco_por_l}
            onChange={(e) => handleChange('preco_por_l', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Ajuste % */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ajuste de Custo por Minuto</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={localSettings.ajuste_pct}
              onChange={(e) => handleChange('ajuste_pct', parseFloat(e.target.value))}
              className="block w-20 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span className="text-gray-600 dark:text-gray-400">%</span>
            <div className="flex items-center space-x-2 ml-4">
              <input 
                 type="checkbox"
                 id="discount"
                 checked={localSettings.is_adjustment_discount}
                 onChange={(e) => handleChange('is_adjustment_discount', e.target.checked)}
                 className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="discount" className="text-sm text-gray-700 dark:text-gray-300">É desconto? (reduz custo)</label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
           <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Semáforo de Rentabilidade</h3>
           <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Min. Rentabilidade (Verde)</label>
                  <input
                    type="number" step="0.1"
                    value={localSettings.threshold_green_profitability}
                    onChange={(e) => handleChange('threshold_green_profitability', parseFloat(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
              </div>
              <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Min. Rentabilidade (Amarelo)</label>
                  <input
                    type="number" step="0.1"
                    value={localSettings.threshold_red_profitability}
                    onChange={(e) => handleChange('threshold_red_profitability', parseFloat(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
              </div>
           </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" /> Salvar
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex-shrink-0 flex justify-center items-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;