import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { COLORS } from '../../../../constants/chart';
import { getRandomColor } from '../../../../helpers/common';
import { DataUSAService } from '../../../../services/dataUSA.service';

@Component({
  selector: 'cars-per-househould-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './cars-per-househould-chart.component.html',
})
export class CarsPerHousehouldChartComponent {
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartLabels: string[][] = [];
  public pieChartDatasets: Array<{
    backgroundColor: string[],
    data: number[]
  }> = [{
    backgroundColor: [],
    data: []
  }];
  public pieChartLegend = false;

  public emptyData = false;
  private targetYears = [2021]

  constructor(private dataUSAService: DataUSAService) { }

  ngOnInit(): void {
    this.retriveData();
  }

  retriveData() {
    this.dataUSAService.getHouseholdsByYears(this.targetYears).subscribe({
      next: (data) => {
        if (!data.length) {
          this.emptyData = true;
          return;
        }

        this.targetYears.forEach((year) => {
          const yearData = data.filter((d) => d['ID Year'] === year);

          yearData.forEach((d, index) => {
            this.pieChartLabels = [...this.pieChartLabels, [d['Vehicles Available']]];
            this.pieChartDatasets[0].backgroundColor = [...this.pieChartDatasets[0].backgroundColor, COLORS[index] ?? getRandomColor()];
            this.pieChartDatasets[0].data = [...this.pieChartDatasets[0].data, d['Commute Means by Gender']];
          });

        });
      },
      error: (error) => {
        console.error(error);
        this.emptyData = true;
      }
    })
  }


}
