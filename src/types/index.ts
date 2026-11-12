export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  primaryLanguage: string;
  techStack: string[];
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  shortDescription: string;
  overview: string;
  problemStatement: string;
  objectives: string[];
  features: {
    title: string;
    description: string;
  }[];
  modules: string[];
  requirements: {
    hardware: string[];
    software: string[];
    dependencies: string[];
  };
  documentationIncluded: {
    item: string;
    format: string;
    description: string;
  }[];
  installationSteps: {
    step: number;
    title: string;
    codeCommand?: string;
    description: string;
  }[];
  featured: boolean;
  isFree?: boolean;
  accessType?: 'FREE' | 'PAID';
  publicationStatus?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  claimCount?: number;
  claimed?: boolean;
  purchased?: boolean;
  createdAt: string;
  downloadsCount: number;
  academicYear: string;
  colorTheme: string;
  imageUrl?: string;
  coverImage?: string;
  detailedDescription?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  demoUrl?: string;
  demoVideoUrl?: string;
  screenshots?: string[];
  resources?: {
    sourceCodeZip?: boolean;
    presentationPpt?: boolean;
    documentationPdf?: boolean;
    screenshots?: boolean;
    demo?: boolean;
    hasSourceCode?: boolean;
    hasPresentation?: boolean;
    hasDocumentation?: boolean;
    hasDemoVideo?: boolean;
    sourceCodeSize?: string;
    presentationSize?: string;
    documentationPages?: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  projectCount: number;
  color: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  collegeName?: string;
  role: 'student' | 'admin';
  avatar?: string;
  joinedDate: string;
  token?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  projectId: string;
  projectTitle: string;
  category: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Processing' | 'Failed';
  paymentMethod: string;
  invoiceId: string;
  downloadToken: string;
}

export interface PurchaseItem {
  orderId: string;
  project: Project;
  purchaseDate: string;
  downloadCount: number;
  licenseKey: string;
}
