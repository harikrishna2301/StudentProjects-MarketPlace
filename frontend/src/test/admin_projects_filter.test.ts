import { describe, it, expect } from 'bun:test';
import { INITIAL_PROJECTS } from '../data/projects';
import { CATEGORIES } from '../data/categories';
import {
  filterAdminProjects,
  getAdminProjectCategoryOptions,
} from '../utils/adminProjectFilters';

describe('Admin Projects Real-Time Search & Category Filter', () => {
  it('derives category filter options with accurate kit counts including custom project categories', () => {
    const customProject = {
      ...INITIAL_PROJECTS[0],
      id: 'proj-custom-99',
      title: 'Quantum Key Distribution Simulator',
      category: 'Quantum Computing',
    };
    const options = getAdminProjectCategoryOptions(
      [...INITIAL_PROJECTS, customProject],
      CATEGORIES
    );

    const quantumOption = options.find((o) => o.name === 'Quantum Computing');
    expect(quantumOption).toBeDefined();
    expect(quantumOption?.count).toBe(1);

    const totalCountFromCategories = options.reduce((sum, item) => sum + item.count, 0);
    expect(totalCountFromCategories).toBe(INITIAL_PROJECTS.length + 1);
  });

  it('filters listed kits in real time by title, ID, language, tech stack, and access tag', () => {
    const first = INITIAL_PROJECTS[0];

    // By project ID
    const byId = filterAdminProjects(INITIAL_PROJECTS, first.id, 'All');
    expect(byId.some((p) => p.id === first.id)).toBe(true);

    // By tech stack token with mixed case and whitespace
    const techToken = first.techStack[0];
    const byTech = filterAdminProjects(INITIAL_PROJECTS, `  ${techToken.toLowerCase()}  `, 'All');
    expect(byTech.some((p) => p.id === first.id)).toBe(true);

    // By access type tag ('free')
    const freeMatches = filterAdminProjects(INITIAL_PROJECTS, 'free', 'All');
    expect(freeMatches.length).toBeGreaterThan(0);
    expect(
      freeMatches.every(
        (p) =>
          p.isFree ||
          p.accessType === 'FREE' ||
          p.price === 0 ||
          `${p.title} ${p.shortDescription}`.toLowerCase().includes('free')
      )
    ).toBe(true);
  });

  it('combines category filter and multi-word search query accurately', () => {
    const target = INITIAL_PROJECTS[0];
    const words = target.title.split(/\s+/).filter((w) => w.length > 2).slice(0, 2);
    const query = `${words.join(' ')} ${target.primaryLanguage}`;

    const matched = filterAdminProjects(INITIAL_PROJECTS, query, target.category);
    expect(matched.some((p) => p.id === target.id)).toBe(true);
    expect(matched.every((p) => p.category.toLowerCase() === target.category.toLowerCase())).toBe(true);

    // Filtering by an unrelated category excludes the target
    const mismatched = filterAdminProjects(INITIAL_PROJECTS, target.id, 'NonExistentDomain');
    expect(mismatched.length).toBe(0);
  });
});
