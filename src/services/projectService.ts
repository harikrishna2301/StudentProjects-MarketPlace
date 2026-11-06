import apiClient from './api';
import { Project, Category } from '../types';
import { INITIAL_PROJECTS } from '../data/projects';
import { CATEGORIES } from '../data/categories';

export interface ProjectSearchParams {
  category?: string;
  search?: string;
  primaryLanguage?: string;
  sort?: 'popular' | 'price-low' | 'price-high' | 'newest';
  minPrice?: number;
  maxPrice?: number;
}

export const projectService = {
  /**
   * Fetch projects with optional filters, search, and sorting
   */
  async getAll(params?: ProjectSearchParams): Promise<Project[]> {
    try {
      const response = await apiClient.get<Project[]>('/api/projects', { params });
      return response.data;
    } catch {
      // Offline / Development fallback
      let filtered = [...INITIAL_PROJECTS];

      if (params?.category && params.category !== 'All') {
        filtered = filtered.filter(
          (p) => p.category.toLowerCase() === params.category?.toLowerCase()
        );
      }

      if (params?.search?.trim()) {
        const query = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.shortDescription.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.techStack.some((t) => t.toLowerCase().includes(query)) ||
            p.primaryLanguage.toLowerCase().includes(query)
        );
      }

      if (params?.primaryLanguage && params.primaryLanguage !== 'All') {
        filtered = filtered.filter(
          (p) => p.primaryLanguage.toLowerCase() === params.primaryLanguage?.toLowerCase()
        );
      }

      if (params?.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.price >= params.minPrice!);
      }

      if (params?.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.price <= params.maxPrice!);
      }

      if (params?.sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (params?.sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (params?.sort === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else {
        // Default popular / rating
        filtered.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));
      }

      return filtered;
    }
  },

  /**
   * Get single project details by ID or slug
   */
  async getById(id: string): Promise<Project | null> {
    try {
      const response = await apiClient.get<Project>(`/api/projects/${id}`);
      return response.data;
    } catch {
      const found = INITIAL_PROJECTS.find((p) => p.id === id || p.slug === id);
      return found || null;
    }
  },

  /**
   * Fetch all project categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/api/categories');
      return response.data;
    } catch {
      return CATEGORIES;
    }
  },

  /**
   * Create a new project (Admin)
   */
  async create(data: Partial<Project>): Promise<Project> {
    try {
      const response = await apiClient.post<Project>('/api/admin/projects', data);
      return response.data;
    } catch {
      const newKit: Project = {
        ...INITIAL_PROJECTS[0],
        id: `proj-${Date.now()}`,
        title: data.title || 'Untitled Project',
        slug: (data.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: data.price || 1999,
        originalPrice: data.originalPrice || 2999,
        createdAt: new Date().toISOString().split('T')[0],
        ...data,
      } as Project;
      return newKit;
    }
  },

  /**
   * Update an existing project kit (Admin)
   */
  async update(id: string, data: Partial<Project>): Promise<Project> {
    try {
      const response = await apiClient.put<Project>(`/api/admin/projects/${id}`, data);
      return response.data;
    } catch {
      return { ...INITIAL_PROJECTS[0], id, ...data } as Project;
    }
  },

  /**
   * Delete a project kit (Admin)
   */
  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/api/admin/projects/${id}`);
      return true;
    } catch {
      return true;
    }
  },
};

export default projectService;
