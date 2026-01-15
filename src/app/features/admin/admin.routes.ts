import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./session-list/session-list.component').then(m => m.SessionListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./session-form/session-form.component').then(m => m.SessionFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./session-form/session-form.component').then(m => m.SessionFormComponent)
  }
];
