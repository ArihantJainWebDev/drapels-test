import {
  AIInterviewer,
  InterviewQuestion,
  InterviewResponse,
  MockInterviewSession,
} from "@/types/mockInterview";

// Use the same API key as other interview services
const GROQ_API_KEY =
  (import.meta as any).env?.VITE_QROQ_API_KEY_INTERVIEW ||
  (import.meta as any).env?.VITE_GROQ_API_KEY_INTERVIEW;

if (!GROQ_API_KEY) {
  console.error(
    "Missing VITE_QROQ_API_KEY_INTERVIEW (or VITE_GROQ_API_KEY_INTERVIEW). Define it in frontend/.env.local or Vercel env."
  );
}

export class AIInterviewerService {
  private static readonly API_BASE =
    "https://api.groq.com/openai/v1/chat/completions";
  private static readonly MODEL = "llama-3.3-70b-versatile";

  // Predefined AI interviewers with different personalities
  static readonly INTERVIEWERS: AIInterviewer[] = [
    {
      id: "sarah-tech",
      name: "Sarah Chen",
      avatar: "👩‍💻",
      personality: "professional",
      company: "Google",
      role: "Senior Engineering Manager",
      experience: "8+ years in tech leadership",
      specialties: ["System Design", "Technical Leadership", "Scalability"],
    },
    {
      id: "mike-startup",
      name: "Mike Rodriguez",
      avatar: "👨‍💼",
      personality: "friendly",
      company: "Stripe",
      role: "VP of Engineering",
      experience: "10+ years in fintech",
      specialties: ["Product Engineering", "Team Building", "Innovation"],
    },
    {
      id: "alex-faang",
      name: "Alex Kim",
      avatar: "🧑‍💻",
      personality: "challenging",
      company: "Meta",
      role: "Principal Engineer",
      experience: "12+ years in distributed systems",
      specialties: ["Distributed Systems", "Performance", "Architecture"],
    },
    {
      id: "priya-supportive",
      name: "Priya Patel",
      avatar: "👩‍🔬",
      personality: "supportive",
      company: "Microsoft",
      role: "Senior Technical Program Manager",
      experience: "7+ years in program management",
      specialties: [
        "Cross-functional Leadership",
        "Process Improvement",
        "Mentoring",
      ],
    },
  ];

  static getInterviewer(id: string): AIInterviewer | null {
    return (
      this.INTERVIEWERS.find((interviewer) => interviewer.id === id) || null
    );
  }

  static getInterviewersByCompany(company: string): AIInterviewer[] {
    return this.INTERVIEWERS.filter((interviewer) =>
      interviewer.company.toLowerCase().includes(company.toLowerCase())
    );
  }

  static async generateQuestions(
    company: string,
    role: string,
    interviewType: string,
    difficulty: string,
    questionCount: number = 5
  ): Promise<InterviewQuestion[]> {
    const prompt = `Generate ${questionCount} realistic ${interviewType} interview questions for a ${difficulty} level ${role} position at ${company}.

For each question, provide:
1. The question text
2. Category (behavioral, technical, system-design, coding, etc.)
3. Difficulty level
4. Time limit in seconds (typically 120-900 seconds)
5. Expected keywords that indicate a good answer
6. Follow-up questions (1-2)

Return as JSON array with this structure:
[
  {
    "id": "unique-id",
    "question": "question text",
    "category": "${interviewType}",
    "difficulty": "${difficulty}",
    "timeLimit": 300,
    "expectedKeywords": ["keyword1", "keyword2"],
    "followUpQuestions": ["follow-up 1", "follow-up 2"]
  }
]

Make questions realistic and company-specific. For technical questions, focus on relevant technologies. For behavioral questions, align with company values.`;

    try {
      const response = await fetch(this.API_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are an expert technical recruiter who creates realistic interview questions. Always return valid JSON.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content ?? "";

      // Clean JSON response
      content = content.trim();
      if (content.startsWith("```json")) {
        content = content.replace(/```json\s*/i, "").replace(/```\s*$/i, "");
      }
      if (content.startsWith("```")) {
        content = content.replace(/```\s*/i, "").replace(/```\s*$/i, "");
      }

      const questions = JSON.parse(content);

      // Validate and format questions
      return questions.map((q: any, index: number) => ({
        id: q.id || `q-${Date.now()}-${index}`,
        question: q.question || "",
        category: q.category || interviewType,
        difficulty: q.difficulty || difficulty,
        timeLimit: q.timeLimit || 300,
        expectedKeywords: Array.isArray(q.expectedKeywords)
          ? q.expectedKeywords
          : [],
        followUpQuestions: Array.isArray(q.followUpQuestions)
          ? q.followUpQuestions
          : [],
      }));
    } catch (error) {
      console.error("Error generating questions:", error);

      // Fallback questions
      return this.getFallbackQuestions(
        interviewType,
        difficulty,
        questionCount
      );
    }
  }

  static async generateFollowUp(
    originalQuestion: string,
    userResponse: string,
    interviewer: AIInterviewer,
    context: {
      company: string;
      role: string;
      sessionProgress: number; // 0-1
    }
  ): Promise<string> {
    const personalityPrompts = {
      friendly:
        "Ask a warm, encouraging follow-up question that builds on their answer.",
      professional:
        "Ask a direct, focused follow-up question to dive deeper into their experience.",
      challenging:
        "Ask a probing follow-up question that challenges their assumptions or explores edge cases.",
      supportive:
        "Ask a supportive follow-up question that helps them elaborate on their strengths.",
    };

    const prompt = `You are ${interviewer.name}, a ${interviewer.role} at ${
      interviewer.company
    } with ${interviewer.experience}. You're interviewing a candidate for a ${
      context.role
    } position.

Original Question: "${originalQuestion}"
Candidate's Response: "${userResponse}"

${personalityPrompts[interviewer.personality]}

The interview is ${Math.round(
      context.sessionProgress * 100
    )}% complete. Keep the follow-up concise (1-2 sentences) and natural. Don't repeat information already covered.

Respond as the interviewer would, maintaining their personality and expertise in ${interviewer.specialties.join(
      ", "
    )}.`;

    try {
      const response = await fetch(this.API_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: "system",
              content: `You are ${interviewer.name}, an experienced interviewer with a ${interviewer.personality} personality. Keep responses natural and conversational.`,
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.choices?.[0]?.message?.content?.trim() ||
        this.getFallbackFollowUp(interviewer.personality)
      );
    } catch (error) {
      console.error("Error generating follow-up:", error);
      return this.getFallbackFollowUp(interviewer.personality);
    }
  }

  static async evaluateResponse(
    question: InterviewQuestion,
    userResponse: string,
    interviewer: AIInterviewer,
    context: {
      company: string;
      role: string;
      timeSpent: number;
    }
  ): Promise<{
    score: number;
    feedback: string;
    keywordMatches: string[];
    improvementAreas: string[];
    strengths: string[];
  }> {
    const prompt = `As ${interviewer.name}, evaluate this interview response:

Question: "${question.question}"
Category: ${question.category}
Difficulty: ${question.difficulty}
Expected Keywords: ${question.expectedKeywords?.join(", ") || "N/A"}
Time Spent: ${Math.round(context.timeSpent / 60)} minutes

Candidate Response: "${userResponse}"

Evaluate for a ${context.role} position at ${context.company}. Consider:
1. Technical accuracy (if applicable)
2. Communication clarity
3. Structure and organization
4. Depth of experience
5. Cultural fit for ${context.company}

Return JSON with:
{
  "score": 0-10,
  "feedback": "2-3 sentence constructive feedback",
  "keywordMatches": ["matched keywords"],
  "improvementAreas": ["area1", "area2"],
  "strengths": ["strength1", "strength2"]
}`;

    try {
      const response = await fetch(this.API_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: "system",
              content: `You are ${interviewer.name}, an expert interviewer. Provide fair, constructive evaluations. Always return valid JSON.`,
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content?.trim() || "";

      // Clean JSON response
      if (content.startsWith("```json")) {
        content = content.replace(/```json\s*/i, "").replace(/```\s*$/i, "");
      }
      if (content.startsWith("```")) {
        content = content.replace(/```\s*/i, "").replace(/```\s*$/i, "");
      }

      const evaluation = JSON.parse(content);

      return {
        score: Math.max(0, Math.min(10, evaluation.score || 0)),
        feedback: evaluation.feedback || "Good response overall.",
        keywordMatches: Array.isArray(evaluation.keywordMatches)
          ? evaluation.keywordMatches
          : [],
        improvementAreas: Array.isArray(evaluation.improvementAreas)
          ? evaluation.improvementAreas
          : [],
        strengths: Array.isArray(evaluation.strengths)
          ? evaluation.strengths
          : [],
      };
    } catch (error) {
      console.error("Error evaluating response:", error);

      // Fallback evaluation
      const wordCount = userResponse.trim().split(/\s+/).length;
      return {
        score: Math.min(8, Math.max(3, Math.round(wordCount / 30))),
        feedback:
          "Your response shows good understanding. Consider adding more specific examples and quantifiable results.",
        keywordMatches: [],
        improvementAreas: ["Add specific examples", "Quantify impact"],
        strengths: ["Clear communication", "Relevant experience"],
      };
    }
  }

  static async generateResponse(prompt: string, data: any[]): Promise<string> {
    // Your implementation here
    // You can use the prompt and data to generate a response

    // Example implementation using a placeholder response
    const response = `AI-generated response for the prompt: ${prompt}`;
    return response;
  }

  static async generateSessionSummary(
    session: MockInterviewSession,
    responses: InterviewResponse[]
  ): Promise<{
    overallFeedback: string;
    keyStrengths: string[];
    improvementAreas: string[];
    nextSteps: string[];
    companySpecificAdvice: string;
  }> {
    const interviewer = this.getInterviewer("sarah-tech"); // Default interviewer for summary

    const prompt = `Provide a comprehensive interview summary for a ${
      session.role
    } candidate at ${session.company}.

Session Details:
- Duration: ${Math.round(session.duration / 60)} minutes
- Questions: ${session.questions.length}
- Overall Score: ${session.overallScore}/10
- Interview Type: ${session.interviewType}

Individual Responses:
${responses
  .map(
    (r, i) => `
${i + 1}. Q: ${r.question}
   A: ${r.userResponse.substring(0, 200)}...
   Score: ${r.score}/10
`
  )
  .join("\n")}

Provide JSON with:
{
  "overallFeedback": "3-4 sentence summary of performance",
  "keyStrengths": ["strength1", "strength2", "strength3"],
  "improvementAreas": ["area1", "area2", "area3"],
  "nextSteps": ["actionable step1", "actionable step2", "actionable step3"],
  "companySpecificAdvice": "2-3 sentences about succeeding at this specific company"
}`;

    try {
      const response = await fetch(this.API_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are an expert interview coach providing comprehensive feedback. Always return valid JSON.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content?.trim() || "";

      // Clean JSON response
      if (content.startsWith("```json")) {
        content = content.replace(/```json\s*/i, "").replace(/```\s*$/i, "");
      }

      const summary = JSON.parse(content);

      return {
        overallFeedback:
          summary.overallFeedback || "Good interview performance overall.",
        keyStrengths: Array.isArray(summary.keyStrengths)
          ? summary.keyStrengths
          : [],
        improvementAreas: Array.isArray(summary.improvementAreas)
          ? summary.improvementAreas
          : [],
        nextSteps: Array.isArray(summary.nextSteps) ? summary.nextSteps : [],
        companySpecificAdvice:
          summary.companySpecificAdvice ||
          "Continue practicing and preparing for company-specific scenarios.",
      };
    } catch (error) {
      console.error("Error generating session summary:", error);

      // Fallback summary
      return {
        overallFeedback: `You completed a ${session.interviewType} interview simulation with an overall score of ${session.overallScore}/10. Your responses showed good preparation and understanding of the role requirements.`,
        keyStrengths: [
          "Clear communication",
          "Relevant experience",
          "Good preparation",
        ],
        improvementAreas: [
          "Add more specific examples",
          "Quantify achievements",
          "Practice storytelling",
        ],
        nextSteps: [
          "Practice STAR method",
          "Research company culture",
          "Prepare specific examples",
        ],
        companySpecificAdvice: `For ${session.company}, focus on their core values and recent initiatives. Research their technology stack and recent product launches.`,
      };
    }
  }

  private static getFallbackQuestions(
    interviewType: string,
    difficulty: string,
    count: number
  ): InterviewQuestion[] {
    const fallbackQuestions = {
      behavioral: [
        {
          id: "beh-fallback-1",
          question:
            "Tell me about a challenging project you worked on and how you overcame obstacles.",
          category: "behavioral",
          difficulty,
          timeLimit: 300,
          expectedKeywords: ["challenge", "solution", "teamwork", "result"],
          followUpQuestions: [
            "What would you do differently?",
            "How did this experience change your approach?",
          ],
        },
        {
          id: "beh-fallback-2",
          question:
            "Describe a time when you had to work with a difficult team member.",
          category: "behavioral",
          difficulty,
          timeLimit: 300,
          expectedKeywords: [
            "communication",
            "conflict resolution",
            "collaboration",
          ],
          followUpQuestions: [
            "What was the outcome?",
            "How do you handle conflict now?",
          ],
        },
      ],
      technical: [
        {
          id: "tech-fallback-1",
          question:
            "Explain the difference between synchronous and asynchronous programming.",
          category: "technical",
          difficulty,
          timeLimit: 240,
          expectedKeywords: [
            "blocking",
            "non-blocking",
            "callbacks",
            "promises",
          ],
          followUpQuestions: [
            "When would you use each approach?",
            "What are the trade-offs?",
          ],
        },
        {
          id: "tech-fallback-2",
          question: "How would you optimize a slow database query?",
          category: "technical",
          difficulty,
          timeLimit: 360,
          expectedKeywords: [
            "indexing",
            "query plan",
            "optimization",
            "performance",
          ],
          followUpQuestions: [
            "What tools would you use?",
            "How do you measure improvement?",
          ],
        },
      ],
    };

    const questions =
      fallbackQuestions[interviewType as keyof typeof fallbackQuestions] ||
      fallbackQuestions.behavioral;
    return questions.slice(0, count);
  }

  private static getFallbackFollowUp(personality: string): string {
    const fallbacks = {
      friendly:
        "That's interesting! Can you tell me more about how that experience shaped your approach?",
      professional:
        "I'd like to understand more about the technical details. Can you walk me through your decision-making process?",
      challenging:
        "That's a good start, but what would you do if the constraints were different? How would you handle edge cases?",
      supportive:
        "You've clearly thought this through well. What aspects of this experience are you most proud of?",
    };

    return (
      fallbacks[personality as keyof typeof fallbacks] || fallbacks.professional
    );
  }
}
