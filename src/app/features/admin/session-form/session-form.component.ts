import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { SessionCategory, SessionStatus } from '../../../core/models/session.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './session-form.component.html',
  styleUrl: './session-form.component.css'
})
export class SessionFormComponent implements OnInit {
  sessionForm: FormGroup;
  isEditMode = false;
  sessionId: string | null = null;

  categories: SessionCategory[] = ['Formación', 'Reunión', 'Demo'];
  statuses: SessionStatus[] = ['Borrador', 'Bloqueado', 'Oculto'];
  cities: string[] = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'];

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sessionForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      city: ['', [Validators.required]],
      dateTime: ['', [Validators.required]],
      status: ['Borrador', [Validators.required]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.sessionId = id;
        this.loadSession(id);
      }
    });
  }

  loadSession(id: string): void {
    this.sessionService.getSessionById(id).subscribe(session => {
      if (session) {
        const dateTime = new Date(session.dateTime).toISOString().slice(0, 16);
        this.sessionForm.patchValue({
          ...session,
          dateTime
        });
      }
    });
  }

  onSubmit(): void {
    if (this.sessionForm.valid) {
      const formValue = this.sessionForm.value;
      const sessionData = {
        ...formValue,
        dateTime: new Date(formValue.dateTime)
      };

      if (this.isEditMode && this.sessionId) {
        this.sessionService.updateSession(this.sessionId, sessionData).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Actualizada!',
              text: 'La sesión ha sido actualizada correctamente',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/admin']);
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar la sesión',
              confirmButtonColor: '#3b82f6'
            });
          }
        });
      } else {
        this.sessionService.createSession(sessionData).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Creada!',
              text: 'La sesión ha sido creada correctamente',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/admin']);
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear la sesión',
              confirmButtonColor: '#3b82f6'
            });
          }
        });
      }
    } else {
      this.markFormGroupTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos requeridos',
        confirmButtonColor: '#3b82f6'
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.sessionForm.controls).forEach(key => {
      const control = this.sessionForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.sessionForm.dirty) {
      Swal.fire({
        title: '¿Descartar cambios?',
        text: 'Los cambios no guardados se perderán',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, descartar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/admin']);
        }
      });
    } else {
      this.router.navigate(['/admin']);
    }
  }
}
