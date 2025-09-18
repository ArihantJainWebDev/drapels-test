export interface EmailParams {
  name: string;
  role: string;
  experience: string;
  skills: string;
  projects: string;
  portfolioLink?: string;
  linkedinLink?: string;
  companyName: string;
  targetRole: string;
  recruiterName?: string;
  tone: string;
}

export interface EmailContent {
  subject: string;
  body: string;
}

const QROQ_API_KEY_EMAIL = process.env.NEXT_PUBLIC_GROQ_API_KEY_EMAIL || process.env.NEXT_PUBLIC_QROQ_API_KEY_EMAIL;
if (!QROQ_API_KEY_EMAIL) {
  // eslint-disable-next-line no-console
  console.error('Missing NEXT_PUBLIC_GROQ_API_KEY_EMAIL. Define it in .env.local');
}

export async function generateEmail(params: EmailParams): Promise<EmailContent> {
  const prompt = `Generate a professional cold email for a job application. 

Applicant Details:
- Name: ${params.name}
- Current Role: ${params.role}
- Experience: ${params.experience}
- Skills: ${params.skills}
- Key Projects: ${params.projects}
${params.portfolioLink ? `- Portfolio: ${params.portfolioLink}` : ''}
${params.linkedinLink ? `- LinkedIn: ${params.linkedinLink}` : ''}

Target Company: ${params.companyName}
Target Role: ${params.targetRole}
${params.recruiterName ? `Recruiter Name: ${params.recruiterName}` : ''}
Tone: ${params.tone}

Generate a compelling cold email with:
1. A clear, attention-grabbing subject line
2. A personalized opening that shows research about the company
3. A concise explanation of why you're interested in the role
4. Highlight relevant experience and achievements
5. A clear call-to-action
6. Professional closing

Format the response as JSON:
{
  "subject": "Subject line here",
  "body": "Email body here with proper line breaks"
}

Make sure the response is valid JSON only, no additional text.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QROQ_API_KEY_EMAIL}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    const content = data.choices[0].message.content;
    
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Parse the JSON response
    const emailContent = JSON.parse(cleanContent);
    
    // Validate the response structure
    if (!emailContent.subject || !emailContent.body) {
      throw new Error('Response missing subject or body');
    }

    return emailContent;
  } catch (error) {
    console.error('Error generating email:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse API response. The AI response was not valid JSON.');
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new Error(`Failed to generate email: ${errorMessage}`);
  }
} 
