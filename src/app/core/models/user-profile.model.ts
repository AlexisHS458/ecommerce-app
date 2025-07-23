export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  newsletter?: boolean;
  createdAt?: Date | string;
} 