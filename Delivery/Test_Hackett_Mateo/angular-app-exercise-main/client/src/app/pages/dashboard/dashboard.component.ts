import { Component } from '@angular/core';
import { CarsPerHousehouldChartComponent } from '../../components/charts/cars-per-househould-chart/cars-per-househould-chart.component';
import { PopulationByStatesChartComponent } from '../../components/charts/population-by-states-chart/population-by-states-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PopulationByStatesChartComponent, CarsPerHousehouldChartComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

}
