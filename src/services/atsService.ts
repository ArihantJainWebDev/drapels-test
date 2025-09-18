import { ATSScore, ATSSuggestion, ATSAnalysis, ATSKeyword, SkillAssessment } from '@/types/ats';

interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string;
  experience: Array<{
    role: string;
    company: string;
    start: string;
    end: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    start: string;
    end: string;
  }>;
}

class ATSService {
  private readonly TECH_KEYWORDS = [
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby',
    'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'html', 'css',
    
    // Frameworks & Libraries
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
    'rails', 'asp.net', 'jquery', 'bootstrap', 'tailwind', 'material-ui', 'redux', 'mobx',
    
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb',
    'sqlite', 'oracle', 'sql server',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions',
    'terraform', 'ansible', 'chef', 'puppet', 'nginx', 'apache',
    
    // Tools & Technologies
    'git', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'photoshop', 'illustrator',
    'postman', 'swagger', 'graphql', 'rest api', 'microservices', 'agile', 'scrum',
    
    // Soft Skills
    'leadership', 'teamwork', 'communication', 'problem solving', 'analytical', 'creative',
    'adaptable', 'detail-oriented', 'self-motivated', 'collaborative'
  ];

  private readonly ATS_UNFRIENDLY_ELEMENTS = [
    'tables', 'text boxes', 'headers/footers', 'images', 'graphics', 'columns',
    'special characters', 'fancy fonts', 'colored text', 'underlines'
  ];

  analyzeResume(resumeData: ResumeData, targetRole?: string): ATSAnalysis {
    const score = this.calculateATSScore(resumeData, targetRole);
    const keywords = this.analyzeKeywords(resumeData, targetRole);
    const formatIssues = this.checkFormatting(resumeData);
    const structureIssues = this.checkStructure(resumeData);
    const recommendations = this.generateRecommendations(score, keywords, formatIssues, structureIssues);

    return {
      score,
      keywords,
      formatIssues,
      structureIssues,
      recommendations
    };
  }

  private calculateATSScore(resumeData: ResumeData, targetRole?: string): ATSScore {
    const formatting = this.scoreFormatting(resumeData);
    const keywords = this.scoreKeywords(resumeData, targetRole);
    const structure = this.scoreStructure(resumeData);
    const readability = this.scoreReadability(resumeData);
    const length = this.scoreLength(resumeData);

    const breakdown = { formatting, keywords, structure, readability, length };
    const overall = Math.round(
      (formatting * 0.25) + (keywords * 0.3) + (structure * 0.2) + (readability * 0.15) + (length * 0.1)
    );

    const suggestions = this.generateSuggestions(breakdown, resumeData);
    const passesATS = overall >= 75;

    return { overall, breakdown, suggestions, passesATS };
  }

  private scoreFormatting(resumeData: ResumeData): number {
    let score = 100;
    
    // Check for ATS-friendly formatting
    const text = this.getResumeText(resumeData);
    
    // Penalize special characters that might confuse ATS
    const specialChars = /[^\w\s@.-]/g;
    const specialCharCount = (text.match(specialChars) || []).length;
    score -= Math.min(specialCharCount * 2, 30);
    
    // Check for proper email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resumeData.email)) {
      score -= 10;
    }
    
    // Check for phone format
    const phoneRegex = /[\d\s\-\+\(\)]{10,}/;
    if (!phoneRegex.test(resumeData.phone)) {
      score -= 5;
    }

    return Math.max(0, score);
  }

  private scoreKeywords(resumeData: ResumeData, targetRole?: string): number {
    const text = this.getResumeText(resumeData).toLowerCase();
    const skillsArray = resumeData.skills.toLowerCase().split(',').map(s => s.trim());
    
    let relevantKeywords = [...this.TECH_KEYWORDS];
    
    // Add role-specific keywords if target role is provided
    if (targetRole) {
      const roleKeywords = this.getRoleSpecificKeywords(targetRole.toLowerCase());
      relevantKeywords = [...relevantKeywords, ...roleKeywords];
    }
    
    let foundKeywords = 0;
    let totalImportantKeywords = 0;
    
    relevantKeywords.forEach(keyword => {
      const importance = this.getKeywordImportance(keyword, targetRole);
      totalImportantKeywords += importance;
      
      if (text.includes(keyword.toLowerCase()) || skillsArray.some(skill => skill.includes(keyword.toLowerCase()))) {
        foundKeywords += importance;
      }
    });
    
    return Math.min(100, Math.round((foundKeywords / Math.max(totalImportantKeywords, 1)) * 100));
  }

  private scoreStructure(resumeData: ResumeData): number {
    let score = 100;
    
    // Check for required sections
    if (!resumeData.fullName.trim()) score -= 20;
    if (!resumeData.email.trim()) score -= 15;
    if (!resumeData.phone.trim()) score -= 10;
    if (!resumeData.summary.trim()) score -= 15;
    if (!resumeData.skills.trim()) score -= 20;
    if (resumeData.experience.length === 0) score -= 30;
    
    // Check experience entries completeness
    resumeData.experience.forEach(exp => {
      if (!exp.role.trim()) score -= 5;
      if (!exp.company.trim()) score -= 5;
      if (!exp.description.trim()) score -= 10;
    });
    
    return Math.max(0, score);
  }

  private scoreReadability(resumeData: ResumeData): number {
    const text = this.getResumeText(resumeData);
    let score = 100;
    
    // Check for bullet points in experience descriptions
    const bulletPointRegex = /[•·▪▫‣⁃]/;
    let hasBulletPoints = false;
    
    resumeData.experience.forEach(exp => {
      if (bulletPointRegex.test(exp.description) || exp.description.includes('\n-') || exp.description.includes('\n•')) {
        hasBulletPoints = true;
      }
    });
    
    if (!hasBulletPoints) score -= 20;
    
    // Check for action verbs
    const actionVerbs = ['achieved', 'built', 'created', 'developed', 'implemented', 'improved', 'led', 'managed', 'optimized', 'reduced'];
    const hasActionVerbs = actionVerbs.some(verb => text.toLowerCase().includes(verb));
    if (!hasActionVerbs) score -= 15;
    
    // Check for quantifiable results
    const numberRegex = /\d+%|\d+\+|\$\d+|\d+x/;
    if (!numberRegex.test(text)) score -= 15;
    
    return Math.max(0, score);
  }

  private scoreLength(resumeData: ResumeData): number {
    const text = this.getResumeText(resumeData);
    const wordCount = text.split(/\s+/).length;
    
    // Optimal range: 400-800 words
    if (wordCount >= 400 && wordCount <= 800) return 100;
    if (wordCount >= 300 && wordCount < 400) return 80;
    if (wordCount >= 200 && wordCount < 300) return 60;
    if (wordCount > 800 && wordCount <= 1000) return 80;
    if (wordCount > 1000) return Math.max(40, 100 - ((wordCount - 1000) / 50));
    
    return Math.max(20, (wordCount / 200) * 60);
  }

  private generateSuggestions(breakdown: ATSScore['breakdown'], resumeData: ResumeData): ATSSuggestion[] {
    const suggestions: ATSSuggestion[] = [];
    
    if (breakdown.formatting < 80) {
      suggestions.push({
        id: 'formatting-1',
        type: 'critical',
        category: 'formatting',
        title: 'Improve ATS-friendly formatting',
        description: 'Use standard fonts, avoid special characters, and ensure proper contact information format',
        impact: 85 - breakdown.formatting
      });
    }
    
    if (breakdown.keywords < 70) {
      suggestions.push({
        id: 'keywords-1',
        type: 'critical',
        category: 'keywords',
        title: 'Add more relevant keywords',
        description: 'Include more technical skills and industry-specific terms relevant to your target role',
        impact: 75 - breakdown.keywords
      });
    }
    
    if (breakdown.structure < 80) {
      suggestions.push({
        id: 'structure-1',
        type: 'warning',
        category: 'structure',
        title: 'Complete all required sections',
        description: 'Ensure all sections (contact, summary, skills, experience) are properly filled',
        impact: 85 - breakdown.structure
      });
    }
    
    if (breakdown.readability < 75) {
      suggestions.push({
        id: 'readability-1',
        type: 'improvement',
        category: 'readability',
        title: 'Improve readability',
        description: 'Use bullet points, action verbs, and quantifiable achievements',
        impact: 80 - breakdown.readability
      });
    }
    
    return suggestions.sort((a, b) => b.impact - a.impact);
  }

  private analyzeKeywords(resumeData: ResumeData, targetRole?: string): ATSKeyword[] {
    const text = this.getResumeText(resumeData).toLowerCase();
    const skillsArray = resumeData.skills.toLowerCase().split(',').map(s => s.trim());
    
    return this.TECH_KEYWORDS.map(keyword => ({
      keyword,
      importance: this.getKeywordImportance(keyword, targetRole),
      found: text.includes(keyword.toLowerCase()) || skillsArray.some(skill => skill.includes(keyword.toLowerCase())),
      variations: this.getKeywordVariations(keyword)
    })).sort((a, b) => b.importance - a.importance);
  }

  private checkFormatting(resumeData: ResumeData): string[] {
    const issues: string[] = [];
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeData.email)) {
      issues.push('Invalid email format');
    }
    
    if (!/[\d\s\-\+\(\)]{10,}/.test(resumeData.phone)) {
      issues.push('Phone number format may not be ATS-friendly');
    }
    
    const text = this.getResumeText(resumeData);
    if (/[^\w\s@.-]/.test(text)) {
      issues.push('Contains special characters that may confuse ATS systems');
    }
    
    return issues;
  }

  private checkStructure(resumeData: ResumeData): string[] {
    const issues: string[] = [];
    
    if (!resumeData.fullName.trim()) issues.push('Missing full name');
    if (!resumeData.summary.trim()) issues.push('Missing professional summary');
    if (!resumeData.skills.trim()) issues.push('Missing skills section');
    if (resumeData.experience.length === 0) issues.push('Missing work experience');
    
    resumeData.experience.forEach((exp, index) => {
      if (!exp.role.trim()) issues.push(`Experience ${index + 1}: Missing job title`);
      if (!exp.company.trim()) issues.push(`Experience ${index + 1}: Missing company name`);
      if (!exp.description.trim()) issues.push(`Experience ${index + 1}: Missing job description`);
    });
    
    return issues;
  }

  private generateRecommendations(
    score: ATSScore,
    keywords: ATSKeyword[],
    formatIssues: string[],
    structureIssues: string[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (score.overall < 75) {
      recommendations.push('Your resume needs improvement to pass ATS screening. Focus on the critical issues first.');
    }
    
    if (formatIssues.length > 0) {
      recommendations.push('Fix formatting issues to ensure ATS can properly parse your resume.');
    }
    
    if (structureIssues.length > 0) {
      recommendations.push('Complete all required sections for better ATS compatibility.');
    }
    
    const missingKeywords = keywords.filter(k => !k.found && k.importance >= 3);
    if (missingKeywords.length > 0) {
      recommendations.push(`Consider adding these important keywords: ${missingKeywords.slice(0, 5).map(k => k.keyword).join(', ')}`);
    }
    
    if (score.breakdown.readability < 75) {
      recommendations.push('Use bullet points and action verbs to improve readability.');
    }
    
    return recommendations;
  }

  private getResumeText(resumeData: ResumeData): string {
    const parts = [
      resumeData.fullName,
      resumeData.title,
      resumeData.summary,
      resumeData.skills,
      ...resumeData.experience.map(exp => `${exp.role} ${exp.company} ${exp.description}`),
      ...resumeData.education.map(edu => `${edu.degree} ${edu.school}`)
    ];
    
    return parts.join(' ');
  }

  private getRoleSpecificKeywords(role: string): string[] {
    const roleKeywords: Record<string, string[]> = {
      'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'responsive design'],
      'backend': ['node.js', 'python', 'java', 'api', 'database', 'server', 'microservices'],
      'fullstack': ['react', 'node.js', 'javascript', 'typescript', 'api', 'database', 'frontend', 'backend'],
      'devops': ['docker', 'kubernetes', 'aws', 'ci/cd', 'jenkins', 'terraform', 'monitoring'],
      'data': ['python', 'sql', 'machine learning', 'data analysis', 'pandas', 'numpy', 'visualization'],
      'mobile': ['react native', 'flutter', 'ios', 'android', 'swift', 'kotlin', 'mobile development']
    };
    
    for (const [key, keywords] of Object.entries(roleKeywords)) {
      if (role.includes(key)) {
        return keywords;
      }
    }
    
    return [];
  }

  private getKeywordImportance(keyword: string, targetRole?: string): number {
    // Base importance
    let importance = 2;
    
    // High importance keywords
    const highImportance = ['javascript', 'python', 'react', 'node.js', 'sql', 'git', 'api'];
    if (highImportance.includes(keyword.toLowerCase())) {
      importance = 4;
    }
    
    // Role-specific importance boost
    if (targetRole) {
      const roleKeywords = this.getRoleSpecificKeywords(targetRole.toLowerCase());
      if (roleKeywords.includes(keyword.toLowerCase())) {
        importance = Math.min(5, importance + 2);
      }
    }
    
    return importance;
  }

  private getKeywordVariations(keyword: string): string[] {
    const variations: Record<string, string[]> = {
      'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
      'typescript': ['ts'],
      'react': ['reactjs', 'react.js'],
      'node.js': ['nodejs', 'node'],
      'css': ['css3', 'cascading style sheets'],
      'html': ['html5', 'hypertext markup language']
    };
    
    return variations[keyword.toLowerCase()] || [];
  }

  // Integration with platform skill assessments
  async getSkillAssessments(userId: string): Promise<SkillAssessment[]> {
    // This would integrate with existing quiz and DSA progress
    // For now, return mock data
    return [
      {
        skill: 'JavaScript',
        level: 'advanced',
        verified: true,
        source: 'quiz',
        score: 85,
        completedAt: new Date()
      },
      {
        skill: 'React',
        level: 'intermediate',
        verified: true,
        source: 'dsa',
        score: 78,
        completedAt: new Date()
      }
    ];
  }

  suggestSkillsFromAssessments(assessments: SkillAssessment[]): string[] {
    return assessments
      .filter(assessment => assessment.verified && assessment.level !== 'beginner')
      .map(assessment => assessment.skill);
  }
}

export const atsService = new ATSService();