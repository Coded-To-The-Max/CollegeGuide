export interface User {
  id: string;
  username: string;
  displayName: string;
  country: string;
  residence: string;
  createdAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  displayName: string;
  country: string;
  residence: string;
}

export interface RecoveryData {
  username: string;
  recoveryCode: string;
  newPassword: string;
}

export interface College {
  id: string;
  name: string;
  type: 'reach' | 'target' | 'safety';
  deadlines: {
    earlyAction?: string;
    earlyDecision?: string;
    regularDecision: string;
  };
  progress: number;
  country: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
  type: 'application' | 'essay' | 'test' | 'custom';
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: Source[];
}

export interface Source {
  title: string;
  url: string;
  description?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
}