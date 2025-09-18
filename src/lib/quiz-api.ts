export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizParams {
  company: string;
  role: string;
  domain: string;
  difficulty: string;
}

const QROQ_API_KEY_QUIZ = process.env.NEXT_PUBLIC_GROQ_API_KEY_QUIZ || process.env.NEXT_PUBLIC_QROQ_API_KEY_QUIZ;
if (!QROQ_API_KEY_QUIZ) {
  // eslint-disable-next-line no-console
  console.error('Missing NEXT_PUBLIC_GROQ_API_KEY_QUIZ. Define it in .env.local');
}

export async function generateQuiz(params: QuizParams): Promise<QuizQuestion[]> {
  const prompt = `Generate 10 unique multiple choice questions for a ${params.role} role at ${params.company} in the domain of ${params.domain}. The questions should be ${params.difficulty} level.

Each question must include:
- 4 answer options
- 1 correct answer
- A 1–2 line explanation of the correct answer

Format output as JSON like:
[
  {
    "question": "....",
    "options": ["...", "...", "...", "..."],
    "answer": "...",
    "explanation": "..."
  }
]

Make sure the response is valid JSON array only, no additional text.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QROQ_API_KEY_QUIZ}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    const content = data.choices[0].message.content;
    
    // Clean the content to ensure it's valid JSON
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Parse the JSON response
    const questions = JSON.parse(cleanContent);
    
    // Validate the response structure
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }
    
    if (questions.length === 0) {
      throw new Error('No questions generated');
    }

    return questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse API response. The AI response was not valid JSON.');
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new Error(`Failed to generate quiz: ${errorMessage}`);
  }
}
