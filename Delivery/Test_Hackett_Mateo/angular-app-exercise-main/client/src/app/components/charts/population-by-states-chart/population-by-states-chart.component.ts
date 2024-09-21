import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { COLORS } from '../../../../constants/chart';
import { getRandomColor } from '../../../../helpers/common';
import { DataUSAService } from '../../../../services/dataUSA.service';

@Component({
  selector: 'population-by-states-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './population-by-states-chart.component.html',
})
export class PopulationByStatesChartComponent {
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
  };
  public lineChartLegend = true;

  public emptyData = false;
  private targetStates = ["Alabama", "Florida", "California"]

  constructor(private dataUSAService: DataUSAService) { }

  ngOnInit(): void {
    this.retriveData();
  }

  retriveData() {
    this.dataUSAService.getPopulationByStates(this.targetStates).subscribe({
      next: (data) => {
        if (!data.length) {
          this.emptyData = true;
          return;
        }

        this.targetStates.forEach((state, index) => {
          const stateData = data.filter((item) => item.State === state).sort((a, b) => a['ID Year'] - b['ID Year']);
          const color = COLORS[index] ?? getRandomColor();

          this.lineChartData = {
            labels: stateData.map((item) => item.Year),
            datasets: [...this.lineChartData.datasets, {
              data: stateData.map((item) => item.Population),
              label: state,
              borderColor: color,
              backgroundColor: color,
            }]
          }
        });
      },
      error: (error) => {
        console.error(error);
        this.emptyData = true;
      }
    })
  }

  getTitle() {
    const cloneTargetStates = this.targetStates.slice();
    const lastItem = cloneTargetStates.pop(); // Remove the last item
    return cloneTargetStates.join(", ") + ", and " + lastItem;
  }
}
