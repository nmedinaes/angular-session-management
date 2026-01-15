import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MenuComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
}
