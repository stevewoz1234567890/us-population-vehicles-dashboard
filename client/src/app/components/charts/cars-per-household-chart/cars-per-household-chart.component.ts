import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Chart } from 'chart.js';

import type { VehiclesResponse } from '../../../models/charts.model';
import { DataUsaService } from '../../../services/data-usa.service';

/** Template-inspired pie palette */
const PIE_COLORS = [
  '#F28482',
  '#F4A261',
  '#E9C46A',
  '#8AB17D',
  '#2A9D8F',
  '#457B9D',
];

@Component({
  selector: 'app-cars-per-household-chart',
  standalone: true,
  templateUrl: './cars-per-household-chart.component.html',
  styleUrl: './cars-per-household-chart.component.css',
})
export class CarsPerHouseholdChartComponent implements AfterViewInit, OnDestroy {
  private readonly dataUsa = inject(DataUsaService);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.dataUsa.getVehiclesByHousehold().subscribe({
      next: (data) => {
        this.loading.set(false);
        this.error.set(null);
        this.renderChart(data);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load vehicles data.');
      },
    });
  }

  private renderChart(data: VehiclesResponse): void {
    const el = this.canvas()?.nativeElement;
    if (!el) {
      return;
    }
    this.chart?.destroy();
    const labels = data.slices.map((s) => s.label);
    const values = data.slices.map((s) => s.value);
    const backgroundColor = data.slices.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]);

    this.chart = new Chart(el, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor,
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            bodyFont: { family: "'Open Sans', sans-serif" },
            titleFont: { family: "'Open Sans', sans-serif" },
            callbacks: {
              label: (ctx) => {
                const v = typeof ctx.parsed === 'number' ? ctx.parsed : Number(ctx.parsed);
                const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const pct = total ? ((v / total) * 100).toFixed(1) : '0';
                return `${ctx.label}: ${v.toLocaleString()} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }
}
