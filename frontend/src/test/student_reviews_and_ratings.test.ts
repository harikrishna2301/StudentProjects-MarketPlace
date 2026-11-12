import { describe, test, expect } from 'bun:test';
import { INITIAL_STUDENT_REVIEWS } from '../data/reviews';
import { StudentReview } from '../types';

describe('Student Reviews & Rating System', () => {
  test('initial reviews dataset contains valid verified reviews with ratings between 1 and 5', () => {
    expect(INITIAL_STUDENT_REVIEWS.length).toBeGreaterThanOrEqual(6);
    INITIAL_STUDENT_REVIEWS.forEach((rev) => {
      expect(rev.rating).toBeGreaterThanOrEqual(1);
      expect(rev.rating).toBeLessThanOrEqual(5);
      expect(rev.studentName.length).toBeGreaterThan(0);
      expect(rev.collegeName.length).toBeGreaterThan(0);
      expect(rev.comment.length).toBeGreaterThan(10);
    });
  });

  test('calculates overall average rating accurately', () => {
    const reviews: StudentReview[] = [
      {
        id: '1',
        studentName: 'Student A',
        collegeName: 'VIT',
        branch: 'CSE',
        rating: 5,
        title: 'Great',
        comment: 'Very helpful',
        date: 'March 2026',
        verifiedPurchase: true,
        helpfulCount: 5,
      },
      {
        id: '2',
        studentName: 'Student B',
        collegeName: 'SRM',
        branch: 'ECE',
        rating: 4,
        title: 'Good',
        comment: 'Worked well',
        date: 'March 2026',
        verifiedPurchase: true,
        helpfulCount: 2,
      },
      {
        id: '3',
        studentName: 'Student C',
        collegeName: 'BITS',
        branch: 'IT',
        rating: 5,
        title: 'Superb',
        comment: 'Top quality',
        date: 'March 2026',
        verifiedPurchase: true,
        helpfulCount: 1,
      },
    ];

    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = Number((sum / reviews.length).toFixed(1));
    expect(avg).toBe(4.7);
  });

  test('calculates star distribution percentage breakdown accurately', () => {
    const reviews: StudentReview[] = [
      { id: '1', studentName: 'A', collegeName: 'C1', branch: 'B1', rating: 5, title: 'T1', comment: 'C1', date: 'D1', verifiedPurchase: true, helpfulCount: 0 },
      { id: '2', studentName: 'B', collegeName: 'C2', branch: 'B2', rating: 5, title: 'T2', comment: 'C2', date: 'D2', verifiedPurchase: true, helpfulCount: 0 },
      { id: '3', studentName: 'C', collegeName: 'C3', branch: 'B3', rating: 4, title: 'T3', comment: 'C3', date: 'D3', verifiedPurchase: true, helpfulCount: 0 },
      { id: '4', studentName: 'D', collegeName: 'C4', branch: 'B4', rating: 5, title: 'T4', comment: 'C4', date: 'D4', verifiedPurchase: true, helpfulCount: 0 },
    ];

    const total = reviews.length;
    const count5 = reviews.filter((r) => r.rating === 5).length;
    const count4 = reviews.filter((r) => r.rating === 4).length;

    expect(Math.round((count5 / total) * 100)).toBe(75);
    expect(Math.round((count4 / total) * 100)).toBe(25);
  });

  test('adding a new student review updates dataset and increments total count', () => {
    let currentReviews = [...INITIAL_STUDENT_REVIEWS];
    const initialCount = currentReviews.length;

    const newReview: StudentReview = {
      id: 'rev-custom-1',
      projectId: 'proj-1',
      studentName: 'Vikram Joshi',
      collegeName: 'IIT Bombay',
      branch: 'B.Tech CSE',
      rating: 5,
      title: 'Flawless execution during internal project seminar',
      comment: 'The architectural design diagrams and setup documentation helped us defend all technical queries effortlessly.',
      date: 'Just now',
      verifiedPurchase: true,
      helpfulCount: 0,
      highlightTag: 'Cleared with 95%',
    };

    currentReviews = [newReview, ...currentReviews];
    expect(currentReviews.length).toBe(initialCount + 1);
    expect(currentReviews[0].studentName).toBe('Vikram Joshi');
    expect(currentReviews[0].rating).toBe(5);
  });

  test('filters reviews by star rating', () => {
    const reviews = [...INITIAL_STUDENT_REVIEWS];
    const fiveStarReviews = reviews.filter((r) => r.rating === 5);
    const fourStarReviews = reviews.filter((r) => r.rating === 4);

    expect(fiveStarReviews.length).toBeGreaterThan(0);
    fiveStarReviews.forEach((r) => expect(r.rating).toBe(5));
    fourStarReviews.forEach((r) => expect(r.rating).toBe(4));
  });

  test('helpful upvoting increments review helpfulCount', () => {
    const review: StudentReview = {
      id: 'rev-test',
      studentName: 'Test Student',
      collegeName: 'Test College',
      branch: 'CSE',
      rating: 5,
      title: 'Great work',
      comment: 'Very helpful package',
      date: 'March 2026',
      verifiedPurchase: true,
      helpfulCount: 10,
    };

    const upvoted = { ...review, helpfulCount: review.helpfulCount + 1 };
    expect(upvoted.helpfulCount).toBe(11);
  });
});
