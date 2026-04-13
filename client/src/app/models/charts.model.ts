export interface LineSeries {
  label: string;
  data: number[];
}

export interface PopulationResponse {
  labels: number[];
  datasets: LineSeries[];
}

export interface PieSlice {
  label: string;
  value: number;
}

export interface VehiclesResponse {
  slices: PieSlice[];
}
