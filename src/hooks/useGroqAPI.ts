import { useState } from 'react';

interface DSASolution {
  algorithm: string;
  pseudocode: string;
  flowchart: string;
  code: { [language: string]: string };
}

export const useGroqAPI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateDSASolution = async (question: string, languages: string[]): Promise<DSASolution> => {
    setIsLoading(true);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.NEXT_PUBLIC_QROQ_API_KEY_NEURON;
      
      if (!apiKey) {
        throw new Error('Groq API key not found. Please check your environment variables.');
      }

      // Generate the comprehensive solution directly without validation
      const solutionPrompt = `You are Neuron, an expert DSA solver. For the following problem, provide a comprehensive solution with exactly these 4 sections:

PROBLEM: ${question}

LANGUAGES REQUESTED: ${languages.join(', ')}

Please format your response EXACTLY as follows:

=== ALGORITHM ===
[Provide a detailed step-by-step algorithm explanation]

=== PSEUDOCODE ===
[Provide clear pseudocode]

=== FLOWCHART ===
[Provide flowchart steps in text format, one step per line, using keywords like START, END, IF, WHILE, etc.]

=== CODE ===
${languages.map(lang => `
${lang.toUpperCase()}:
[Return ONLY raw, runnable ${lang} code. No comments, no explanations, no markdown fences, no docstrings. For C++: include necessary headers, add using namespace std;, avoid std:: qualifiers.]
`).join('')}

Make sure each section is clearly separated and the code is production-ready with proper error handling and comments.`;

      const solutionResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are Neuron, an expert DSA solver. Always provide comprehensive solutions with algorithm explanation, pseudocode, flowchart, and code implementations. Focus on Data Structures and Algorithms problems.'
            },
            {
              role: 'user',
              content: solutionPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 4000
        })
      });

      if (!solutionResponse.ok) {
        const errorData = await solutionResponse.json().catch(() => ({}));
        throw new Error(`API request failed: ${solutionResponse.status} ${solutionResponse.statusText}. ${errorData.error?.message || ''}`);
      }

      const solutionData = await solutionResponse.json();
      const content = solutionData.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No solution generated from the API');
      }

      // Parse the response
      const solution = parseSolutionResponse(content, languages);
      return solution;

    } catch (error) {
      console.error('Error generating DSA solution:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const parseSolutionResponse = (content: string, languages: string[]): DSASolution => {
    const sections = {
      algorithm: '',
      pseudocode: '',
      flowchart: '',
      code: {} as { [language: string]: string }
    };

    // Split content by section markers
    const algorithmMatch = content.match(/=== ALGORITHM ===([\s\S]*?)(?:=== |$)/);
    const pseudocodeMatch = content.match(/=== PSEUDOCODE ===([\s\S]*?)(?:=== |$)/);
    const flowchartMatch = content.match(/=== FLOWCHART ===([\s\S]*?)(?:=== |$)/);
    const codeMatch = content.match(/=== CODE ===([\s\S]*?)$/);

    sections.algorithm = algorithmMatch ? algorithmMatch[1].trim() : 'Algorithm explanation not found in response';
    sections.pseudocode = pseudocodeMatch ? pseudocodeMatch[1].trim() : 'Pseudocode not found in response';
    sections.flowchart = flowchartMatch ? flowchartMatch[1].trim() : 'START\nProcess the problem\nEND';

    // Parse code sections
    if (codeMatch) {
      const codeContent = codeMatch[1];
      const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Build alias label list for lookahead (section separators)
      const labelAliases: Record<string, string[]> = {};
      for (const l of languages) {
        const low = l.toLowerCase();
        if (low === 'c++') labelAliases[l] = [l.toUpperCase(), 'CPP', 'CXX'];
        else labelAliases[l] = [l.toUpperCase()];
      }
      const allLabels = Object.values(labelAliases).flat();
      const upperEscapedList = allLabels.map(escapeRegex).join('|');

      for (const language of languages) {
        const currentLabels = labelAliases[language] || [language.toUpperCase()];
        const currentAlternation = currentLabels.map(escapeRegex).join('|');
        // Match start of line, label, optional 'code'/'implementation', optional colon, then capture until next label or end.
        const langPattern = new RegExp(
          `(?:^|\n)\s*(?:${currentAlternation})(?:\s+(?:code|implementation))?\s*:?[\t ]*\n?` +
          `([\s\S]*?)(?=(?:\n\s*(?:${upperEscapedList})(?:\s+(?:code|implementation))?\s*:?[\t ]*\n)|$)`,
          'i'
        );
        const langMatch = codeContent.match(langPattern);
        const keyLower = language.toLowerCase();
        const fallback = `// ${language} implementation not found in response\n// Please try regenerating the solution`;
        let codeForLang = langMatch ? langMatch[1].trim() : fallback;
        // If only one language was requested and no labeled section matched, assume whole CODE block is for that language
        if (!langMatch && languages.length === 1) {
          const whole = (codeContent || '').trim();
          if (whole) codeForLang = whole;
        }
        // Save canonical and lowercase keys
        sections.code[language] = codeForLang;
        sections.code[keyLower] = codeForLang;
        // Aliases for C++
        if (keyLower === 'c++') {
          sections.code['cpp'] = codeForLang;
          sections.code['cxx'] = codeForLang;
          sections.code['c++'] = codeForLang;
        }
      }
    } else {
      // Fallback: create placeholder code
      for (const language of languages) {
        const fallback = `// ${language} implementation not found in response\n// Please try regenerating the solution`;
        sections.code[language] = fallback;
        sections.code[language.toLowerCase()] = fallback;
        if (language.toLowerCase() === 'c++') {
          sections.code['cpp'] = fallback;
          sections.code['cxx'] = fallback;
          sections.code['c++'] = fallback;
        }
      }
    }

    return sections;
  };

  return {
    generateDSASolution,
    isLoading
  };
};
