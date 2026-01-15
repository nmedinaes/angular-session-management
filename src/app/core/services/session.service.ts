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
    return [
      {
        id: '1',
        title: 'Sesión de Formación Angular',
        description: 'Taller práctico sobre Angular avanzado',
        category: 'Formación',
        city: 'Madrid',
        dateTime: new Date('2024-12-20T10:00:00'),
        status: 'Borrador',
        createdBy: 'admin1'
      },
      {
        id: '2',
        title: 'Reunión de Equipo',
        description: 'Reunión mensual del equipo de desarrollo',
        category: 'Reunión',
        city: 'Barcelona',
        dateTime: new Date('2024-12-22T14:00:00'),
        status: 'Bloqueado',
        createdBy: 'admin2'
      }
    ];
  }
}
