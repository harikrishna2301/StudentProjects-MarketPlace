import { describe, it, expect } from 'bun:test';

interface CatalogProject {
  id: number;
  title: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number;
  technologies: string[];
}

const mockProjects: CatalogProject[] = [
  {
    id: 1,
    title: 'Smart Attendance Face Recognition',
    category: 'AI & Machine Learning',
    difficulty: 'INTERMEDIATE',
    price: 999,
    technologies: ['Python', 'OpenCV', 'TensorFlow'],
  },
  {
    id: 2,
    title: 'IoT Smart Grid Power Meter',
    category: 'Internet of Things',
    difficulty: 'ADVANCED',
    price: 1499,
    technologies: ['ESP32', 'C++', 'MQTT', 'Node.js'],
  },
  {
    id: 3,
    title: 'Hospital Management Web Portal',
    category: 'Web Development',
    difficulty: 'BEGINNER',
    price: 799,
    technologies: ['React', 'Spring Boot', 'MySQL'],
  },
  {
    id: 4,
    title: 'Autonomous Mobile Robot (SLAM)',
    category: 'Robotics',
    difficulty: 'ADVANCED',
    price: 1999,
    technologies: ['ROS2', 'Python', 'C++'],
  },
];

interface FilterCriteria {
  keyword?: string;
  category?: string;
  difficulty?: string;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'title';
}

function filterCatalog(projects: CatalogProject[], criteria: FilterCriteria): CatalogProject[] {
  let result = projects.filter(p => {
    if (criteria.keyword) {
      const q = criteria.keyword.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTech = p.technologies.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchTech) return false;
    }

    if (criteria.category && p.category !== criteria.category) {
      return false;
    }

    if (criteria.difficulty && p.difficulty !== criteria.difficulty) {
      return false;
    }

    if (criteria.maxPrice !== undefined && p.price > criteria.maxPrice) {
      return false;
    }

    return true;
  });

  if (criteria.sortBy === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (criteria.sortBy === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (criteria.sortBy === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }

  return result;
}

describe('Project Catalog Search and Filters', () => {
  it('filters projects by technology keyword (ROS2)', () => {
    const results = filterCatalog(mockProjects, { keyword: 'ROS2' });
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Autonomous Mobile Robot (SLAM)');
  });

  it('filters projects by category and maximum price', () => {
    const results = filterCatalog(mockProjects, {
      category: 'AI & Machine Learning',
      maxPrice: 1000,
    });
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Smart Attendance Face Recognition');
  });

  it('filters projects by difficulty level (ADVANCED)', () => {
    const results = filterCatalog(mockProjects, { difficulty: 'ADVANCED' });
    expect(results.length).toBe(2);
    expect(results.map(r => r.id).sort()).toEqual([2, 4]);
  });

  it('sorts projects by price ascending accurately', () => {
    const results = filterCatalog(mockProjects, { sortBy: 'price_asc' });
    expect(results.map(r => r.price)).toEqual([799, 999, 1499, 1999]);
  });

  it('returns empty array when no projects match criteria (Empty State)', () => {
    const results = filterCatalog(mockProjects, { keyword: 'NonExistentTechnologyXYZ' });
    expect(results.length).toBe(0);
  });
});
