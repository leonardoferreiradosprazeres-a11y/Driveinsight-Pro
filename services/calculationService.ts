import { UserSettings, OcrResult, CalculatedMetrics } from '../types';

export const calculateTripMetrics = (
  ocr: OcrResult,
  settings: UserSettings
): CalculatedMetrics => {
  // 1. Derived Basics
  const tempo_por_km_min = 60 / settings.v_mean_ref;
  const custo_por_km = settings.preco_por_l / settings.consumo_km_per_l;
  const custo_por_min_base = custo_por_km / tempo_por_km_min;

  // 2. Adjustment
  const adjustment_factor = settings.ajuste_pct / 100;
  const custo_por_min_ajustado = settings.is_adjustment_discount
    ? custo_por_min_base * (1 - adjustment_factor)
    : custo_por_min_base * (1 + adjustment_factor);

  // 3. Trip Totals (Fallback handling)
  // If total time is missing but we have parts, sum them. 
  // OcrResult should ideally have total_time_min handled, but we double check.
  const t_total_min = ocr.total_time_min > 0 ? ocr.total_time_min : (ocr.time_to_passenger_min || 0) + (ocr.time_trip_min || 0);
  const d_total_km = ocr.total_distance_km > 0 ? ocr.total_distance_km : (ocr.distance_to_passenger_km || 0) + (ocr.distance_trip_km || 0);
  const valor_corrida = ocr.total_price;

  // 4. Matrix Calculations
  const vel_media_real = t_total_min > 0 ? d_total_km / (t_total_min / 60) : 0;
  const ganho_por_km = d_total_km > 0 ? valor_corrida / d_total_km : 0;
  const ganho_por_h = t_total_min > 0 ? (valor_corrida / t_total_min) * 60 : 0;

  const custo_total_combustivel = custo_por_min_ajustado * t_total_min;
  const litros_gastos = settings.preco_por_l > 0 ? custo_total_combustivel / settings.preco_por_l : 0;
  
  const lucro_liquido = valor_corrida - custo_total_combustivel;
  const percentual_lucro = valor_corrida > 0 ? (lucro_liquido / valor_corrida) * 100 : 0;
  const percentual_combustivel = valor_corrida > 0 ? (custo_total_combustivel / valor_corrida) * 100 : 0;
  
  const rentabilidade = custo_total_combustivel > 0 ? valor_corrida / custo_total_combustivel : 0;

  // 5. Traffic Light Logic
  let traffic_light: 'green' | 'yellow' | 'red' = 'yellow';

  const isGreen = rentabilidade >= settings.threshold_green_profitability || percentual_combustivel <= settings.threshold_green_fuel_pct;
  const isRed = rentabilidade < settings.threshold_red_profitability || percentual_combustivel > settings.threshold_red_fuel_pct;

  if (isGreen) traffic_light = 'green';
  else if (isRed) traffic_light = 'red';
  else traffic_light = 'yellow';

  return {
    custo_por_km,
    custo_por_min_base,
    custo_por_min_ajustado,
    vel_media_real,
    ganho_por_km,
    ganho_por_h,
    custo_total_combustivel,
    litros_gastos,
    lucro_liquido,
    percentual_lucro,
    percentual_combustivel,
    rentabilidade,
    traffic_light
  };
};

export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const formatDecimal = (value: number, digits: number = 2) => {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
};