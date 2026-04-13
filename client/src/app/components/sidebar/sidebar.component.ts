import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  readonly nav = [
    { label: 'Dashboard', icon: 'assets/home.svg', active: true },
    { label: 'Accounts', icon: 'assets/users.svg', active: false },
    { label: 'Activities', icon: 'assets/sync.svg', active: false },
  ] as const;
}
