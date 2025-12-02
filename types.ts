export interface UserSettings {
  v_mean_ref: number; // km/h
  consumo_km_per_l: number; // km/L
  preco_por_l: number; // R$
  ajuste_pct: number; // Percentage (0-100)
  is_adjustment_discount: boolean; // true = discount, false = increase
  fuel_type: 'GASOLINA' | 'ETANOL' | 'GNV';
  threshold_green_profitability: number;
  threshold_green_fuel_pct: number;
  threshold_red_profitability: number;
  threshold_red_fuel_pct: number;
  theme: 'light' | 'dark';
}

export interface OcrResult {
  platform: string;
  category: string;
  total_price: number;
  surge_multiplier: number | null;
  passenger_rating: number | null;
  time_to_passenger_min: number | null;
  distance_to_passenger_km: number | null;
  time_trip_min: number | null;
  distance_trip_km: number | null;
  total_time_min: number;
  total_distance_km: number;
  origin_address: string;
  destination_address: string;
  raw_text?: string;
}

export interface CalculatedMetrics {
  custo_por_km: number;
  custo_por_min_base: number;
  custo_por_min_ajustado: number;
  vel_media_real: number;
  ganho_por_km: number;
  ganho_por_h: number;
  custo_total_combustivel: number;
  litros_gastos: number;
  lucro_liquido: number;
  percentual_lucro: number;
  percentual_combustivel: number;
  rentabilidade: number;
  traffic_light: 'green' | 'yellow' | 'red';
}

export interface Trip extends OcrResult, CalculatedMetrics {
  id: string;
  timestamp: number;
  screenshot_url?: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  v_mean_ref: 30.0,
  consumo_km_per_l: 12.0,
  preco_por_l: 5.50,
  ajuste_pct: 10,
  is_adjustment_discount: true,
  fuel_type: 'GASOLINA',
  threshold_green_profitability: 4.0,
  threshold_green_fuel_pct: 25.0,
  threshold_red_profitability: 2.5,
  threshold_red_fuel_pct: 40.0,
  theme: 'light',
};