import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../core/services/session.service';
import { Session, SessionCategory, SessionStatus } from '../../core/models/session.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  sessions: Session[] = [];
  filteredSessions: Session[] = [];
  selectedCategory: SessionCategory | null = null;
  selectedStatus: SessionStatus | null = null;
  currentMonth = new Date();
  
  categories: SessionCategory[] = ['Formación', 'Reunión', 'Demo'];
  statuses: SessionStatus[] = ['Borrador', 'Bloqueado', 'Oculto'];

  constructor(private sessionService: SessionService) {
    // Efecto para actualizar automáticamente cuando cambien las sesiones
    effect(() => {
      const sessionsSignal = this.sessionService.getSessionsSignal();
      this.sessions = sessionsSignal();
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionService.getSessions().subscribe(sessions => {
      this.sessions = sessions;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.sessions];
    
    if (this.selectedCategory) {
      filtered = filtered.filter(s => s.category === this.selectedCategory);
    }
    
    if (this.selectedStatus) {
      filtered = filtered.filter(s => s.status === this.selectedStatus);
    }
    
    this.filteredSessions = filtered;
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  getDaysInMonth(): Date[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    const days: Date[] = [];
    
    // Agregar días vacíos al inicio para alinear el calendario
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDay = new Date(year, month, -i);
      days.push(prevMonthDay);
    }
    
    // Agregar días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Completar hasta 42 días (6 semanas) para mantener el grid consistente
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  }

  getSessionsForDay(day: Date): Session[] {
    return this.filteredSessions.filter(session => {
      const sessionDate = new Date(session.dateTime);
      return sessionDate.toDateString() === day.toDateString();
    });
  }

  getMonthName(): string {
    return this.currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
  }
}
