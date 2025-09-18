import { LearningPath } from '@/types/documentation';

export const learningPaths: LearningPath[] = [
  {
    id: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    description: 'Master the core concepts of JavaScript programming from variables to advanced functions.',
    language: 'JavaScript',
    difficulty: 'beginner',
    estimatedHours: 40,
    prerequisites: ['basic-programming-concepts'],
    topics: [
      {
        id: 'js-variables-datatypes',
        title: 'Variables and Data Types',
        description: 'Learn about JavaScript variables, primitive data types, and type coercion.',
        difficulty: 'beginner',
        estimatedMinutes: 45,
        order: 1,
        content: `# Variables and Data Types in JavaScript

JavaScript is a dynamically typed language, which means you don't need to specify the type of a variable when you declare it. The type is determined automatically at runtime.

## Variable Declaration

There are three ways to declare variables in JavaScript:

### var
The traditional way to declare variables. Has function scope and can be redeclared.

### let
Introduced in ES6. Has block scope and cannot be redeclared in the same scope.

### const
Also introduced in ES6. Has block scope, cannot be redeclared, and cannot be reassigned.

## Data Types

JavaScript has several primitive data types:

1. **Number** - Represents both integers and floating-point numbers
2. **String** - Represents text data
3. **Boolean** - Represents true/false values
4. **Undefined** - Represents a variable that has been declared but not assigned
5. **Null** - Represents an intentional absence of value
6. **Symbol** - Represents a unique identifier (ES6)
7. **BigInt** - Represents large integers (ES2020)

## Type Coercion

JavaScript automatically converts types when needed, which can sometimes lead to unexpected results.`,
        codeExamples: [
          {
            id: 'js-var-examples',
            title: 'Variable Declaration Examples',
            code: `// Variable declarations
var name = "John";
let age = 25;
const PI = 3.14159;

// Data types
let number = 42;
let string = "Hello World";
let boolean = true;
let undefined_var;
let null_var = null;

// Type checking
console.log(typeof number);    // "number"
console.log(typeof string);    // "string"
console.log(typeof boolean);   // "boolean"
console.log(typeof undefined_var); // "undefined"
console.log(typeof null_var);  // "object" (this is a known quirk)

// Type coercion examples
console.log("5" + 3);    // "53" (string concatenation)
console.log("5" - 3);    // 2 (numeric subtraction)
console.log(true + 1);   // 2 (boolean to number conversion)`,
            language: 'javascript',
            explanation: 'This example demonstrates different ways to declare variables and shows JavaScript\'s automatic type conversion.',
            runnable: true
          }
        ],
        exercises: [
          {
            id: 'js-var-exercise-1',
            title: 'Variable Practice',
            description: 'Create variables of different types and practice type checking.',
            difficulty: 'easy',
            solution: `let studentName = "Alice";
let studentAge = 20;
let isEnrolled = true;
let grade;
let scholarship = null;

console.log(typeof studentName);
console.log(typeof studentAge);
console.log(typeof isEnrolled);
console.log(typeof grade);
console.log(typeof scholarship);`,
            hints: [
              'Use let or const for variable declarations',
              'Remember that typeof null returns "object"',
              'Undefined variables have the type "undefined"'
            ]
          }
        ],
        resources: [
          {
            id: 'mdn-variables',
            title: 'MDN - JavaScript Variables',
            type: 'documentation',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types',
            description: 'Comprehensive guide to JavaScript variables and data types'
          }
        ]
      },
      {
        id: 'js-functions',
        title: 'Functions',
        description: 'Understand function declarations, expressions, arrow functions, and scope.',
        difficulty: 'beginner',
        estimatedMinutes: 60,
        order: 2,
        content: `# Functions in JavaScript

Functions are one of the fundamental building blocks in JavaScript. They allow you to encapsulate code into reusable blocks.

## Function Declaration

The most common way to define a function:

\`\`\`javascript
function functionName(parameters) {
    // function body
    return value;
}
\`\`\`

## Function Expression

Functions can also be assigned to variables:

\`\`\`javascript
const functionName = function(parameters) {
    // function body
    return value;
};
\`\`\`

## Arrow Functions (ES6)

A more concise way to write functions:

\`\`\`javascript
const functionName = (parameters) => {
    // function body
    return value;
};

// For single expressions, you can omit braces and return
const add = (a, b) => a + b;
\`\`\`

## Function Scope

Variables declared inside a function are only accessible within that function (local scope).`,
        codeExamples: [
          {
            id: 'js-function-examples',
            title: 'Function Examples',
            code: `// Function declaration
function greet(name) {
    return "Hello, " + name + "!";
}

// Function expression
const multiply = function(a, b) {
    return a * b;
};

// Arrow function
const divide = (a, b) => a / b;

// Arrow function with multiple statements
const calculateArea = (radius) => {
    const pi = 3.14159;
    return pi * radius * radius;
};

// Function with default parameters
const power = (base, exponent = 2) => {
    return Math.pow(base, exponent);
};

// Examples of usage
console.log(greet("Alice"));        // "Hello, Alice!"
console.log(multiply(4, 5));        // 20
console.log(divide(10, 2));         // 5
console.log(calculateArea(3));      // 28.27431
console.log(power(3));              // 9 (uses default exponent)
console.log(power(2, 3));           // 8`,
            language: 'javascript',
            explanation: 'This example shows different ways to define and use functions in JavaScript.',
            runnable: true
          }
        ]
      }
    ]
  },
  {
    id: 'python-data-science',
    title: 'Python for Data Science',
    description: 'Learn Python programming specifically for data science applications.',
    language: 'Python',
    difficulty: 'intermediate',
    estimatedHours: 60,
    prerequisites: ['python-basics'],
    topics: [
      {
        id: 'numpy-basics',
        title: 'NumPy Fundamentals',
        description: 'Master NumPy arrays and mathematical operations for data manipulation.',
        difficulty: 'intermediate',
        estimatedMinutes: 90,
        order: 1,
        content: `# NumPy Fundamentals

NumPy (Numerical Python) is the foundation of the Python data science ecosystem. It provides support for large, multi-dimensional arrays and matrices, along with mathematical functions to operate on these arrays.

## Why NumPy?

- **Performance**: NumPy operations are implemented in C, making them much faster than pure Python
- **Memory Efficiency**: NumPy arrays use less memory than Python lists
- **Broadcasting**: Allows operations between arrays of different shapes
- **Integration**: Works seamlessly with other data science libraries

## Creating Arrays

NumPy arrays can be created in several ways:

1. From Python lists
2. Using built-in functions (zeros, ones, arange, etc.)
3. From existing data (CSV files, databases, etc.)

## Array Operations

NumPy supports element-wise operations, mathematical functions, and linear algebra operations.`,
        codeExamples: [
          {
            id: 'numpy-basics-example',
            title: 'NumPy Array Operations',
            code: `import numpy as np

# Creating arrays
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.array([[1, 2, 3], [4, 5, 6]])

# Array properties
print("Shape of arr1:", arr1.shape)
print("Shape of arr2:", arr2.shape)
print("Data type:", arr1.dtype)

# Creating arrays with built-in functions
zeros = np.zeros((3, 4))
ones = np.ones((2, 3))
range_arr = np.arange(0, 10, 2)
linspace_arr = np.linspace(0, 1, 5)

print("Zeros array:\\n", zeros)
print("Range array:", range_arr)
print("Linspace array:", linspace_arr)

# Mathematical operations
arr = np.array([1, 2, 3, 4, 5])
print("Original array:", arr)
print("Array + 10:", arr + 10)
print("Array * 2:", arr * 2)
print("Square root:", np.sqrt(arr))
print("Sum:", np.sum(arr))
print("Mean:", np.mean(arr))

# Array indexing and slicing
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("Matrix:\\n", matrix)
print("Element at [1,2]:", matrix[1, 2])
print("First row:", matrix[0, :])
print("Last column:", matrix[:, -1])`,
            language: 'python',
            explanation: 'This example demonstrates basic NumPy array creation, properties, and operations.',
            runnable: true
          }
        ]
      }
    ]
  },
  {
    id: 'react-advanced',
    title: 'Advanced React Patterns',
    description: 'Master advanced React concepts including hooks, context, performance optimization, and design patterns.',
    language: 'React',
    difficulty: 'advanced',
    estimatedHours: 50,
    prerequisites: ['react-basics', 'javascript-es6'],
    topics: [
      {
        id: 'custom-hooks',
        title: 'Custom Hooks',
        description: 'Learn to create reusable custom hooks for complex state logic.',
        difficulty: 'advanced',
        estimatedMinutes: 75,
        order: 1,
        content: `# Custom Hooks in React

Custom hooks are a powerful feature that allows you to extract component logic into reusable functions. They follow the same rules as built-in hooks and enable you to share stateful logic between components.

## Rules of Hooks

1. Only call hooks at the top level of your React function
2. Only call hooks from React functions (components or other hooks)
3. Hook names must start with "use"

## Benefits of Custom Hooks

- **Reusability**: Share logic between multiple components
- **Separation of Concerns**: Keep components focused on rendering
- **Testability**: Easier to test isolated logic
- **Abstraction**: Hide complex implementation details

## Common Patterns

- Data fetching hooks
- Form handling hooks
- Local storage hooks
- Timer and interval hooks
- Window size and media query hooks`,
        codeExamples: [
          {
            id: 'custom-hooks-example',
            title: 'Custom Hook Examples',
            code: `import { useState, useEffect, useCallback } from 'react';

// Custom hook for data fetching
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// Custom hook for window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Call handler right away so state gets updated with initial window size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// Example component using custom hooks
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(\`/api/users/\${userId}\`);
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {});
  const { width } = useWindowSize();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Screen width: {width}px</p>
      <button onClick={() => setPreferences({ ...preferences, theme: 'dark' })}>
        Set Dark Theme
      </button>
    </div>
  );
}`,
            language: 'javascript',
            explanation: 'This example shows how to create and use custom hooks for common patterns like data fetching, local storage, and window size tracking.',
            runnable: false
          }
        ]
      }
    ]
  }
];

export const getPathsByLanguage = (language: string): LearningPath[] => {
  return learningPaths.filter(path => 
    path.language.toLowerCase() === language.toLowerCase()
  );
};

export const getPathsByDifficulty = (difficulty: string): LearningPath[] => {
  return learningPaths.filter(path => path.difficulty === difficulty);
};

export const getAllLanguages = (): string[] => {
  return [...new Set(learningPaths.map(path => path.language))];
};

export const getAllTopics = (): string[] => {
  const topics = new Set<string>();
  learningPaths.forEach(path => {
    path.topics.forEach(topic => {
      topics.add(topic.title);
    });
  });
  return Array.from(topics);
};