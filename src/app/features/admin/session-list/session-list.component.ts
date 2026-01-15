import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { Session } from '../../../core/models/session.model';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.css'
})
export class SessionListComponent implements OnInit {
  sessions: Session[] = [];

  constructor(
    private sessionService: SessionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionService.getSessions().subscribe(sessions => {
      this.sessions = sessions;
    });
  }

  deleteSession(id: string, title: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `La sesión "${title}" será eliminada permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.sessionService.deleteSession(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Eliminada!',
              text: 'La sesión ha sido eliminada correctamente',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadSessions();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la sesión',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  canDelete(session: Session): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.role === 'admin' && session.city === currentUser.email.split('@')[0];
  }
}
