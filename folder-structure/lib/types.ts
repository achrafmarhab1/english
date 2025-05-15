// types.ts
export interface Student {
    id: string;
    name: string;
    avatar: string;
  }
  
  export interface Instructor {
    id: string;
    name: string;
    role: string;
    avatar: string;
    cvUrl: string;
  }
  
  export interface Space {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    colorPalette: [string, string];
    size: number;
    price: number;
    isActive: boolean;
    keyPoints: string[];
    instructor: Instructor;
    students: Student[];
    createdAt: string;
    tags: string[];
    schedule: string[];
    completedModules: number;
    totalModules: number;
    partner?: string;
    partnerLogo?: string;
    rating: number;
    certifications: string[];
  }
