export type SessionCategory = 'Formación' | 'Reunión' | 'Demo';
export type SessionStatus = 'Borrador' | 'Bloqueado' | 'Oculto';

export interface Session {
  id: string;
  title: string;
  description: string;
  category: SessionCategory;
  city: string;
  dateTime: Date;
  status: SessionStatus;
  imageUrl?: string;
  createdBy: string;
}
