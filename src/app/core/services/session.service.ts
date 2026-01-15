import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Session, SessionCategory, SessionStatus } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessions = signal<Session[]>(this.getMockSessions());

  constructor() {}

  getSessions(): Observable<Session[]> {
    return of(this.sessions()).pipe(delay(300));
  }

  getSessionsSignal() {
    return this.sessions.asReadonly();
  }

  getSessionById(id: string): Observable<Session | undefined> {
    return of(this.sessions().find(s => s.id === id)).pipe(delay(200));
  }

  createSession(session: Omit<Session, 'id' | 'createdBy'>): Observable<Session> {
    const newSession: Session = {
      ...session,
      id: `session_${Date.now()}`,
      createdBy: 'current_user_id'
    };
    
    this.sessions.update(sessions => [...sessions, newSession]);
    return of(newSession).pipe(delay(400));
  }

  updateSession(id: string, updates: Partial<Session>): Observable<Session> {
    this.sessions.update(sessions => 
      sessions.map(s => s.id === id ? { ...s, ...updates } : s)
    );
    
    const updated = this.sessions().find(s => s.id === id);
    return of(updated!).pipe(delay(400));
  }

  deleteSession(id: string): Observable<boolean> {
    this.sessions.update(sessions => sessions.filter(s => s.id !== id));
    return of(true).pipe(delay(300));
  }

  getSessionsByCategory(category: SessionCategory | null): Session[] {
    if (!category) return this.sessions();
    return this.sessions().filter(s => s.category === category);
  }

  getSessionsByStatus(status: SessionStatus | null): Session[] {
    if (!status) return this.sessions();
    return this.sessions().filter(s => s.status === status);
  }

  private getMockSessions(): Session[] {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const generateDate = (day: number, monthOffset: number = 0, hour: number = 10) => {
      const date = new Date(currentYear, currentMonth + monthOffset, day, hour, 0);
      return date;
    };

    return [
      {
        id: '1',
        title: 'Sesión de Formación Angular',
        description: 'Taller práctico sobre Angular avanzado y mejores prácticas',
        category: 'Formación',
        city: 'Madrid',
        dateTime: generateDate(5, 0, 10),
        status: 'Borrador',
        createdBy: 'admin1'
      },
      {
        id: '2',
        title: 'Reunión de Equipo',
        description: 'Reunión mensual del equipo de desarrollo para revisar objetivos',
        category: 'Reunión',
        city: 'Barcelona',
        dateTime: generateDate(8, 0, 14),
        status: 'Bloqueado',
        createdBy: 'admin2'
      },
      {
        id: '3',
        title: 'Demo Producto Nuevo',
        description: 'Presentación del nuevo producto a clientes potenciales',
        category: 'Demo',
        city: 'Valencia',
        dateTime: generateDate(12, 0, 16),
        status: 'Borrador',
        createdBy: 'admin1'
      },
      {
        id: '4',
        title: 'Workshop TypeScript',
        description: 'Taller intensivo sobre TypeScript avanzado',
        category: 'Formación',
        city: 'Madrid',
        dateTime: generateDate(15, 0, 9),
        status: 'Borrador',
        createdBy: 'admin1'
      },
      {
        id: '5',
        title: 'Reunión de Planificación',
        description: 'Planificación trimestral de proyectos',
        category: 'Reunión',
        city: 'Sevilla',
        dateTime: generateDate(18, 0, 11),
        status: 'Bloqueado',
        createdBy: 'admin2'
      },
      {
        id: '6',
        title: 'Demo API REST',
        description: 'Demostración de la nueva API REST a desarrolladores',
        category: 'Demo',
        city: 'Barcelona',
        dateTime: generateDate(22, 0, 15),
        status: 'Oculto',
        createdBy: 'admin1'
      },
      {
        id: '7',
        title: 'Curso de Testing',
        description: 'Formación en testing unitario y e2e',
        category: 'Formación',
        city: 'Madrid',
        dateTime: generateDate(25, 0, 10),
        status: 'Borrador',
        createdBy: 'admin1'
      },
      {
        id: '8',
        title: 'Reunión de Retrospectiva',
        description: 'Revisión del sprint anterior y mejora continua',
        category: 'Reunión',
        city: 'Valencia',
        dateTime: generateDate(28, 0, 13),
        status: 'Borrador',
        createdBy: 'admin2'
      },
      {
        id: '9',
        title: 'Formación Docker',
        description: 'Taller sobre contenedores y Docker',
        category: 'Formación',
        city: 'Barcelona',
        dateTime: generateDate(3, 1, 10),
        status: 'Borrador',
        createdBy: 'admin1'
      },
      {
        id: '10',
        title: 'Demo Frontend',
        description: 'Presentación de las nuevas funcionalidades del frontend',
        category: 'Demo',
        city: 'Madrid',
        dateTime: generateDate(7, 1, 16),
        status: 'Borrador',
        createdBy: 'admin1'
      }
    ];
  }
}
