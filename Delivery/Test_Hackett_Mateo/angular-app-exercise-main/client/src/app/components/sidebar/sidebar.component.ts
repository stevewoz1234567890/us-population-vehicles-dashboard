import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  navItems = [
    {
      name: 'Dashboard',
      route: '/',
      icon: 'assets/images/home.svg',
      disabled: false
    },
    {
      name: 'Accounts',
      route: '/accounts',
      icon: 'assets/images/users.svg',
      disabled: true
    },
    {
      name: 'Activities',
      route: '/activities',
      icon: 'assets/images/sync.svg',
      disabled: true
    },
  ]
}
