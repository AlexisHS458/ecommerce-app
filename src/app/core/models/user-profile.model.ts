import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Timestamp;
  gender?: string;
  newsletter?: boolean;
  createdAt?: Timestamp;
} 