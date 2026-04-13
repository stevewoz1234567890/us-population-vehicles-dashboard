import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { PopulationResponse, VehiclesResponse } from '../models/charts.model';

@Injectable({
  providedIn: 'root',
})
export class DataUsaService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  getPopulationByState(): Observable<PopulationResponse> {
    return this.http.get<PopulationResponse>(`${this.base}/api/charts/population-by-state`);
  }

  getVehiclesByHousehold(): Observable<VehiclesResponse> {
    return this.http.get<VehiclesResponse>(`${this.base}/api/charts/vehicles-by-household`);
  }
}
