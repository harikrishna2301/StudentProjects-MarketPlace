import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Category } from '../types';
import { INITIAL_PROJECTS } from '../data/projects';
import { CATEGORIES } from '../data/categories';

interface ProjectsContextType {
  projects: Project[];
  categories: Category[];
  getProjectById: (idOrSlug: string) => Project | undefined;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'downloadsCount'>) => Project;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  resetToDefaultProjects: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projectkit_projects_catalog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROJECTS;
      }
    }
    return INITIAL_PROJECTS;
  });

  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  useEffect(() => {
    localStorage.setItem('projectkit_projects_catalog', JSON.stringify(projects));
  }, [projects]);

  const getProjectById = (idOrSlug: string) => {
    return projects.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'downloadsCount'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
      slug: projectData.slug || projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    setProjects((prev) => [newProject, ...prev]);

    // Update category projectCount
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name.toLowerCase() === projectData.category.toLowerCase()
          ? { ...cat, projectCount: cat.projectCount + 1 }
          : cat
      )
    );

    return newProject;
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const resetToDefaultProjects = () => {
    setProjects(INITIAL_PROJECTS);
    localStorage.removeItem('projectkit_projects_catalog');
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        categories,
        getProjectById,
        addProject,
        deleteProject,
        updateProject,
        resetToDefaultProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
