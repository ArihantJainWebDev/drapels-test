import { PracticeQuestion, Company, Role } from '@/types/practice';

// Companies Database
export const companies: Company[] = [
  { id: 'google', name: 'Google', industry: 'Technology', size: 'enterprise' },
  { id: 'meta', name: 'Meta', industry: 'Technology', size: 'enterprise' },
  { id: 'amazon', name: 'Amazon', industry: 'Technology', size: 'enterprise' },
  { id: 'microsoft', name: 'Microsoft', industry: 'Technology', size: 'enterprise' },
  { id: 'apple', name: 'Apple', industry: 'Technology', size: 'enterprise' },
  { id: 'netflix', name: 'Netflix', industry: 'Technology', size: 'large' },
  { id: 'uber', name: 'Uber', industry: 'Technology', size: 'large' },
  { id: 'airbnb', name: 'Airbnb', industry: 'Technology', size: 'large' },
  { id: 'stripe', name: 'Stripe', industry: 'Fintech', size: 'large' },
  { id: 'spotify', name: 'Spotify', industry: 'Technology', size: 'large' },
];

// Roles Database
export const roles: Role[] = [
  { id: 'swe-entry', title: 'Software Engineer', level: 'entry', department: 'engineering' },
  { id: 'swe-mid', title: 'Software Engineer II', level: 'mid', department: 'engineering' },
  { id: 'swe-senior', title: 'Senior Software Engineer', level: 'senior', department: 'engineering' },
  { id: 'swe-staff', title: 'Staff Software Engineer', level: 'staff', department: 'engineering' },
  { id: 'frontend-mid', title: 'Frontend Engineer', level: 'mid', department: 'engineering' },
  { id: 'backend-mid', title: 'Backend Engineer', level: 'mid', department: 'engineering' },
  { id: 'fullstack-senior', title: 'Full Stack Engineer', level: 'senior', department: 'engineering' },
  { id: 'devops-mid', title: 'DevOps Engineer', level: 'mid', department: 'devops' },
  { id: 'pm-mid', title: 'Product Manager', level: 'mid', department: 'product' },
  { id: 'data-senior', title: 'Data Engineer', level: 'senior', department: 'data' },
];

// Practice Questions Database
export const practiceQuestions: PracticeQuestion[] = [
  // Behavioral Questions
  {
    id: 'beh-google-1',
    question: 'Tell me about a time you disagreed with your manager and how you handled it.',
    category: 'behavioral',
    difficulty: 'Intermediate',
    company: 'google',
    role: 'swe-mid',
    topic: 'conflict-resolution',
    timeLimit: 3,
    type: 'verbal',
    exampleAnswer: 'I disagreed with my manager about the technical approach for a critical feature. I prepared data showing performance implications, scheduled a private meeting, presented alternatives respectfully, and we agreed on a hybrid solution that addressed both concerns.',
    tips: [
      'Show respect for authority while advocating for your position',
      'Use data and facts to support your viewpoint',
      'Focus on the outcome and what you learned',
      'Demonstrate collaboration and compromise'
    ]
  },
  {
    id: 'beh-meta-1',
    question: 'Describe a time when you had to work with a difficult team member.',
    category: 'behavioral',
    difficulty: 'Intermediate',
    company: 'meta',
    role: 'swe-senior',
    topic: 'teamwork',
    timeLimit: 3,
    type: 'verbal',
    exampleAnswer: 'A team member was consistently missing deadlines and not communicating blockers. I approached them privately to understand their challenges, offered help, and established regular check-ins. We also adjusted task assignments to better match their strengths.',
    tips: [
      'Show empathy and attempt to understand the other person',
      'Focus on solutions rather than blame',
      'Demonstrate leadership and initiative',
      'Highlight the positive outcome'
    ]
  },
  {
    id: 'beh-amazon-1',
    question: 'Tell me about a time you failed and what you learned from it.',
    category: 'behavioral',
    difficulty: 'Beginner',
    company: 'amazon',
    role: 'swe-entry',
    topic: 'failure-learning',
    timeLimit: 3,
    type: 'verbal',
    exampleAnswer: 'I deployed a feature without proper testing that caused a production issue. I immediately rolled back, communicated with stakeholders, implemented proper testing procedures, and created a post-mortem to prevent similar issues.',
    tips: [
      'Take full ownership of the failure',
      'Focus on what you learned and how you improved',
      'Show how you prevented similar issues in the future',
      'Demonstrate growth mindset'
    ]
  },

  // Technical Questions
  {
    id: 'tech-google-1',
    question: 'Explain the difference between synchronous and asynchronous programming.',
    category: 'technical',
    difficulty: 'Beginner',
    company: 'google',
    role: 'swe-entry',
    topic: 'programming-concepts',
    timeLimit: 5,
    type: 'written',
    exampleAnswer: 'Synchronous programming executes code sequentially, blocking until each operation completes. Asynchronous programming allows operations to run concurrently, using callbacks, promises, or async/await to handle completion without blocking the main thread.',
    tips: [
      'Provide clear definitions for both concepts',
      'Give practical examples of when to use each',
      'Mention specific technologies (promises, async/await)',
      'Discuss performance implications'
    ]
  },
  {
    id: 'tech-meta-1',
    question: 'How would you optimize a slow database query?',
    category: 'technical',
    difficulty: 'Intermediate',
    company: 'meta',
    role: 'backend-mid',
    topic: 'database-optimization',
    timeLimit: 7,
    type: 'written',
    exampleAnswer: 'First, analyze the query execution plan to identify bottlenecks. Add appropriate indexes, optimize JOIN operations, consider query rewriting, implement caching for frequently accessed data, and monitor performance metrics.',
    tips: [
      'Start with analysis and measurement',
      'Mention specific optimization techniques',
      'Discuss indexing strategies',
      'Consider caching and architectural solutions'
    ]
  },

  // Coding Questions
  {
    id: 'code-amazon-1',
    question: 'Implement a function to reverse a linked list.',
    category: 'technical',
    difficulty: 'Intermediate',
    company: 'amazon',
    role: 'swe-mid',
    topic: 'data-structures',
    timeLimit: 15,
    type: 'coding',
    exampleAnswer: `function reverseLinkedList(head) {
  let prev = null;
  let current = head;
  
  while (current !== null) {
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}`,
    tips: [
      'Think about the iterative approach first',
      'Keep track of previous, current, and next pointers',
      'Handle edge cases (empty list, single node)',
      'Consider the recursive solution as well'
    ]
  },
  {
    id: 'code-google-2',
    question: 'Find the first non-repeating character in a string.',
    category: 'technical',
    difficulty: 'Beginner',
    company: 'google',
    role: 'swe-entry',
    topic: 'algorithms',
    timeLimit: 10,
    type: 'coding',
    exampleAnswer: `function firstNonRepeating(str) {
  const charCount = {};
  
  // Count occurrences
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  // Find first non-repeating
  for (let char of str) {
    if (charCount[char] === 1) {
      return char;
    }
  }
  
  return null;
}`,
    tips: [
      'Use a hash map to count character frequencies',
      'Make two passes through the string',
      'Consider edge cases (empty string, all repeating)',
      'Think about time and space complexity'
    ]
  },

  // System Design Questions
  {
    id: 'sys-netflix-1',
    question: 'Design a video streaming service like Netflix.',
    category: 'system-design',
    difficulty: 'Advanced',
    company: 'netflix',
    role: 'swe-senior',
    topic: 'distributed-systems',
    timeLimit: 45,
    type: 'written',
    exampleAnswer: 'Key components: CDN for video delivery, metadata service, recommendation engine, user service, video encoding pipeline, analytics system. Use microservices architecture, implement caching strategies, and ensure global scalability.',
    tips: [
      'Start with requirements and scale estimates',
      'Design the high-level architecture first',
      'Focus on video delivery and storage challenges',
      'Discuss caching, CDN, and global distribution'
    ]
  },
  {
    id: 'sys-uber-1',
    question: 'Design a ride-sharing service like Uber.',
    category: 'system-design',
    difficulty: 'Advanced',
    company: 'uber',
    role: 'swe-staff',
    topic: 'real-time-systems',
    timeLimit: 45,
    type: 'written',
    exampleAnswer: 'Core services: user service, driver service, trip service, location service, matching service, payment service. Use geospatial indexing, real-time location updates, and event-driven architecture for matching.',
    tips: [
      'Focus on real-time location tracking',
      'Design the matching algorithm',
      'Consider geospatial data structures',
      'Discuss scalability and reliability'
    ]
  },

  // Case Study Questions
  {
    id: 'case-stripe-1',
    question: 'Payment success rate dropped by 5% after a recent deployment. How would you investigate and resolve this?',
    category: 'case-studies',
    difficulty: 'Intermediate',
    company: 'stripe',
    role: 'swe-senior',
    topic: 'incident-response',
    timeLimit: 10,
    type: 'written',
    exampleAnswer: 'Immediately check monitoring dashboards, compare error rates before/after deployment, analyze payment gateway logs, identify affected payment methods/regions, rollback if necessary, and implement additional monitoring.',
    tips: [
      'Start with immediate impact assessment',
      'Use data to identify patterns',
      'Consider rollback as first option',
      'Plan for prevention of similar issues'
    ]
  },
  {
    id: 'case-airbnb-1',
    question: 'User engagement has decreased by 15% over the past month. How would you approach this problem?',
    category: 'case-studies',
    difficulty: 'Intermediate',
    company: 'airbnb',
    role: 'pm-mid',
    topic: 'product-analysis',
    timeLimit: 15,
    type: 'written',
    exampleAnswer: 'Segment users by cohorts, analyze funnel drop-offs, conduct user interviews, review recent product changes, A/B test potential solutions, and implement data-driven improvements.',
    tips: [
      'Break down the problem by user segments',
      'Look for correlation with recent changes',
      'Use both quantitative and qualitative analysis',
      'Propose testable hypotheses'
    ]
  }
];

// Helper functions
export const getQuestionsByCompany = (companyId: string): PracticeQuestion[] => {
  return practiceQuestions.filter(q => q.company === companyId);
};

export const getQuestionsByRole = (roleId: string): PracticeQuestion[] => {
  return practiceQuestions.filter(q => q.role === roleId);
};

export const getQuestionsByCategory = (category: string): PracticeQuestion[] => {
  return practiceQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: string): PracticeQuestion[] => {
  return practiceQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByType = (type: 'verbal' | 'written' | 'coding'): PracticeQuestion[] => {
  return practiceQuestions.filter(q => q.type === type);
};

export const getFilteredQuestions = (filters: Partial<{
  companies: string[];
  roles: string[];
  categories: string[];
  difficulties: string[];
  topics: string[];
  types: string[];
}>): PracticeQuestion[] => {
  return practiceQuestions.filter(question => {
    if (filters.companies?.length && !filters.companies.includes(question.company || '')) return false;
    if (filters.roles?.length && !filters.roles.includes(question.role || '')) return false;
    if (filters.categories?.length && !filters.categories.includes(question.category)) return false;
    if (filters.difficulties?.length && !filters.difficulties.includes(question.difficulty)) return false;
    if (filters.topics?.length && !filters.topics.includes(question.topic || '')) return false;
    if (filters.types?.length && !filters.types.includes(question.type)) return false;
    return true;
  });
};