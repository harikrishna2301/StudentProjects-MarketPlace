import { Category, Project } from '../types';

export interface AdminCategoryFilterOption {
  name: string;
  count: number;
}

export function getAdminProjectCategoryOptions(
  projects: Project[],
  categories: Category[]
): AdminCategoryFilterOption[] {
  const counts = new Map<string, { displayName: string; count: number }>();

  for (const cat of categories) {
    const key = cat.name.trim().toLowerCase();
    if (key && !counts.has(key)) {
      counts.set(key, { displayName: cat.name.trim(), count: 0 });
    }
  }

  for (const project of projects) {
    const rawCat = (project.category || '').trim();
    const key = rawCat.toLowerCase();
    if (!key) continue;
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { displayName: rawCat, count: 1 });
    }
  }

  return Array.from(counts.values()).map((entry) => ({
    name: entry.displayName,
    count: entry.count,
  }));
}

export function filterAdminProjects(
  projects: Project[],
  searchQuery: string,
  selectedCategory: string
): Project[] {
  const normalizedCategory = (selectedCategory || 'All').trim().toLowerCase();
  const normalizedQuery = (searchQuery || '').trim().toLowerCase();
  const queryTerms = normalizedQuery ? normalizedQuery.split(/\s+/).filter(Boolean) : [];

  return projects.filter((project) => {
    const matchCategory =
      normalizedCategory === 'all' ||
      (project.category || '').trim().toLowerCase() === normalizedCategory;

    if (!matchCategory) {
      return false;
    }

    if (queryTerms.length === 0) {
      return true;
    }

    const accessTag =
      project.isFree || project.accessType === 'FREE' || project.price === 0 ? 'free' : 'paid';
    const statusTag = (project.publicationStatus || 'PUBLISHED').toLowerCase();

    const searchableText = [
      project.id,
      project.title,
      project.slug,
      project.category,
      project.primaryLanguage,
      project.difficulty || '',
      project.shortDescription,
      ...(project.techStack || []),
      accessTag,
      statusTag,
    ]
      .join(' ')
      .toLowerCase();

    return queryTerms.every((term) => searchableText.includes(term));
  });
}
