export interface EvaluationResult {
  feedback: string;
  score: number; // 0-10
  correctedSolution: string;
  personalisedTips: string[];
}

// Prefer the QROQ var (matches other modules), fallback to GROQ var for compatibility
const QROQ_OR_GROQ_KEY = (import.meta as any).env?.VITE_QROQ_API_KEY_INTERVIEW
  || (import.meta as any).env?.VITE_GROQ_API_KEY_INTERVIEW;

if (!QROQ_OR_GROQ_KEY) {
  // eslint-disable-next-line no-console
  console.error('Missing VITE_QROQ_API_KEY_INTERVIEW (or VITE_GROQ_API_KEY_INTERVIEW). Define it in frontend/.env.local or Vercel env.');
}

export async function evaluateAnswer(question: string, answer: string, context?: { category?: string; difficulty?: string }): Promise<EvaluationResult> {
  const prompt = `You are an interview coach. Evaluate the candidate's answer concisely and constructively.\n\nQuestion: ${question}\nCandidate Answer: ${answer}\nCategory: ${context?.category || 'general'}\nDifficulty: ${context?.difficulty || 'Intermediate'}\n\nReturn STRICT JSON with keys: feedback (about 50 words), score (integer 0-10), correctedSolution (clear, improved version tailored to candidate), personalisedTips (array of 3-5 short, actionable tips). No extra text.\nExample format:\n{\n  "feedback": "~50 words...",\n  "score": 7,\n  "correctedSolution": "...",\n  "personalisedTips": ["tip 1", "tip 2", "tip 3"]\n}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QROQ_OR_GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a concise, constructive technical interview coach.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1200
      })
    });

    // Diagnostics (like quiz implementation)
    // eslint-disable-next-line no-console
    console.log('[interview-eval] Response status:', response.status);
    // eslint-disable-next-line no-console
    console.log('[interview-eval] Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      // eslint-disable-next-line no-console
      console.error('[interview-eval] API Error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let content: string = data.choices?.[0]?.message?.content ?? '';

    // Clean the content to ensure it's valid JSON
    let clean = content.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/```json\s*/i, '').replace(/```\s*$/i, '');
    }
    if (clean.startsWith('```')) {
      clean = clean.replace(/```\s*/i, '').replace(/```\s*$/i, '');
    }

    const parsed = JSON.parse(clean);

    const result: EvaluationResult = {
      feedback: typeof parsed.feedback === 'string' ? parsed.feedback : '',
      score: Number.isFinite(parsed.score) ? Math.max(0, Math.min(10, Math.round(parsed.score))) : 0,
      correctedSolution: typeof parsed.correctedSolution === 'string' ? parsed.correctedSolution : '',
      personalisedTips: Array.isArray(parsed.personalisedTips) ? parsed.personalisedTips.filter((t: any) => typeof t === 'string') : []
    };

    if (!result.feedback) throw new Error('Missing feedback');
    return result;
  } catch (err: any) {
    // Fallback simple heuristic if Groq fails
    const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
    const feedback = wordCount < 50
      ? 'Your answer is concise; add a concrete example, quantify your impact, and close with the outcome and lesson learned.'
      : 'Good depth; tighten structure using STAR, quantify results, and highlight decisions, trade-offs, and lessons.';
    return {
      feedback,
      score: Math.min(10, Math.max(3, Math.round(wordCount / 40))),
      correctedSolution: 'Structure your response with Situation, Task, Action, and Result. Emphasize your decisions, metrics, and what you learned. Tailor to the role and company context.',
      personalisedTips: [
        'Open with a one-line Situation and Task.',
        'Quantify impact with clear metrics.',
        'Highlight trade-offs and rationale.',
        'End with a lesson and forward action.',
        'Practice a 90–120 second delivery.'
      ]
    };
  }
}
