import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnDestroy,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Chart } from 'chart.js';

import type { PopulationResponse } from '../../../models/charts.model';
import { DataUsaService } from '../../../services/data-usa.service';

const LINE_COLORS: Record<string, { border: string; bg: string }> = {
  Alabama: { border: '#E63946', bg: 'rgb(230 57 70 / 0.15)' },
  Florida: { border: '#1D7ED8', bg: 'rgb(29 126 216 / 0.12)' },
  California: { border: '#2A9D8F', bg: 'rgb(42 157 143 / 0.12)' },
};

@Component({
  selector: 'app-population-by-states-chart',
  standalone: true,
  templateUrl: './population-by-states-chart.component.html',
  styleUrl: './population-by-states-chart.component.css',
})
export class PopulationByStatesChartComponent implements AfterViewInit, OnDestroy {
  private readonly dataUsa = inject(DataUsaService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.dataUsa
      .getPopulationByState()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.loading.set(false);
          this.error.set(null);
          afterNextRender(() => this.renderChart(data), { injector: this.injector });
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Could not load population data.');
        },
      });
  }

  private renderChart(data: PopulationResponse): void {
    const el = this.canvas()?.nativeElement;
    if (!el) {
      return;
    }
    this.chart?.destroy();
    const colors = LINE_COLORS;
    this.chart = new Chart(el, {
      type: 'line',
      data: {
        labels: data.labels.map(String),
        datasets: data.datasets.map((ds) => {
          const c = colors[ds.label] ?? {
            border: '#0F335B',
            bg: 'rgb(15 51 91 / 0.1)',
          };
          return {
            label: ds.label,
            data: ds.data,
            borderColor: c.border,
            backgroundColor: c.bg,
            tension: 0.25,
            pointRadius: 4,
            pointHoverRadius: 5,
            fill: false,
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              font: { family: "'Open Sans', sans-serif", size: 12 },
              color: '#4D5358',
            },
          },
        },
        scales: {
          x: {
            grid: { color: '#D9E7F5' },
            ticks: {
              font: { family: "'Open Sans', sans-serif" },
              color: '#4D5358',
            },
          },
          y: {
            grid: { color: '#D9E7F5' },
            ticks: {
              font: { family: "'Open Sans', sans-serif" },
              color: '#4D5358',
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
