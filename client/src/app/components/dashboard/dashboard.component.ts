import { Component } from '@angular/core';

import { CarsPerHouseholdChartComponent } from '../charts/cars-per-household-chart/cars-per-household-chart.component';
import { PopulationByStatesChartComponent } from '../charts/population-by-states-chart/population-by-states-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CarsPerHouseholdChartComponent, PopulationByStatesChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
