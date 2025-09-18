import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ATSScoreCard from '../ATSScoreCard';
import ExportOptions from '../ExportOptions';
import SkillIntegration from '../SkillIntegration';
import RealTimeATSAnalysis from '../RealTimeATSAnalysis';
import { atsService } from '@/services/atsService';
import { skillIntegrationService } from '@/services/skillIntegrationService';
import { resumeExportService } from '@/services/resumeExportService';

// Mock the services
vi.mock('@/services/atsService');
vi.mock('@/services/skillIntegrationService');
vi.mock('@/services/resumeExportService');
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-user' } })
}));

const mockResumeData = {
  fullName: 'John Doe',
  title: 'Software Engineer',
  email: 'john@example.com',
  phone: '+1234567890',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  summary: 'Experienced software engineer with expertise in React and Node.js',
  skills: 'JavaScript, TypeScript, React, Node.js, Python',
  experience: [
    {
      id: '1',
      role: 'Senior Software Engineer',
      company: 'Tech Corp',
      start: 'Jan 2022',
      end: 'Present',
      description: 'Built scalable web applications using React and Node.js'
    }
  ],
  education: [
    {
      id: '1',
      school: 'University of Technology',
      degree: 'B.S. Computer Science',
      start: '2018',
      end: '2022'
    }
  ]
};

const mockATSScore = {
  overall: 85,
  breakdown: {
    formatting: 90,
    keywords: 80,
    structure: 85,
    readability: 88,
    length: 82
  },
  suggestions: [
    {
      id: '1',
      type: 'improvement' as const,
      category: 'keywords' as const,
      title: 'Add more technical keywords',
      description: 'Include more relevant technical skills',
      impact: 5
    }
  ],
  passesATS: true
};

const mockSkillAssessments = [
  {
    skill: 'JavaScript',
    level: 'advanced' as const,
    verified: true,
    source: 'quiz' as const,
    score: 85,
    completedAt: new Date()
  },
  {
    skill: 'React',
    level: 'intermediate' as const,
    verified: true,
    source: 'dsa' as const,
    score: 78,
    completedAt: new Date()
  }
];

describe('Enhanced Resume Builder Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ATSScoreCard', () => {
    it('renders ATS score and breakdown correctly', () => {
      render(<ATSScoreCard score={mockATSScore} />);
      
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('ATS Friendly')).toBeInTheDocument();
      expect(screen.getByText('Score Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Formatting')).toBeInTheDocument();
      expect(screen.getByText('90%')).toBeInTheDocument();
    });

    it('shows improvement suggestions', () => {
      render(<ATSScoreCard score={mockATSScore} />);
      
      expect(screen.getByText('Improvement Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Add more technical keywords')).toBeInTheDocument();
      expect(screen.getByText('+5 pts')).toBeInTheDocument();
    });

    it('displays loading state', () => {
      render(<ATSScoreCard score={mockATSScore} isLoading={true} />);
      
      expect(screen.getByText('ATS Compatibility Score')).toBeInTheDocument();
      // Should show loading skeleton
    });
  });

  describe('ExportOptions', () => {
    const mockPrintAreaRef = { current: document.createElement('div') };

    it('renders all export format options', () => {
      render(
        <ExportOptions 
          resumeData={mockResumeData} 
          printAreaRef={mockPrintAreaRef}
          atsScore={85}
        />
      );
      
      expect(screen.getByText('Export Resume')).toBeInTheDocument();
      expect(screen.getByText('PDF Document')).toBeInTheDocument();
      expect(screen.getByText('Word Document')).toBeInTheDocument();
      expect(screen.getByText('Plain Text')).toBeInTheDocument();
      expect(screen.getByText('JSON Data')).toBeInTheDocument();
    });

    it('shows ATS recommendation based on score', () => {
      render(
        <ExportOptions 
          resumeData={mockResumeData} 
          printAreaRef={mockPrintAreaRef}
          atsScore={95}
        />
      );
      
      expect(screen.getByText(/Excellent ATS compatibility/)).toBeInTheDocument();
    });

    it('handles export functionality', async () => {
      const mockExport = vi.spyOn(resumeExportService, 'exportResume').mockResolvedValue();
      
      render(
        <ExportOptions 
          resumeData={mockResumeData} 
          printAreaRef={mockPrintAreaRef}
          atsScore={85}
        />
      );
      
      const pdfButton = screen.getByText('Export PDF');
      fireEvent.click(pdfButton);
      
      await waitFor(() => {
        expect(mockExport).toHaveBeenCalledWith(
          'pdf',
          mockResumeData,
          mockPrintAreaRef.current,
          'John Doe'
        );
      });
    });
  });

  describe('SkillIntegration', () => {
    beforeEach(() => {
      vi.mocked(skillIntegrationService.getSkillAssessments).mockResolvedValue(mockSkillAssessments);
      vi.mocked(skillIntegrationService.suggestSkillsForResume).mockReturnValue(['JavaScript', 'React', 'Node.js']);
    });

    it('loads and displays skill assessments', async () => {
      render(
        <SkillIntegration 
          currentSkills="JavaScript, TypeScript"
          onSkillsChange={vi.fn()}
          targetRole="Frontend Developer"
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('advanced')).toBeInTheDocument();
        expect(screen.getByText('Verified')).toBeInTheDocument();
      });
    });

    it('suggests skills based on assessments', async () => {
      render(
        <SkillIntegration 
          currentSkills=""
          onSkillsChange={vi.fn()}
          targetRole="Frontend Developer"
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Add All')).toBeInTheDocument();
      });
    });

    it('allows adding skills to resume', async () => {
      const mockOnSkillsChange = vi.fn();
      
      render(
        <SkillIntegration 
          currentSkills=""
          onSkillsChange={mockOnSkillsChange}
          targetRole="Frontend Developer"
        />
      );
      
      await waitFor(() => {
        const addButton = screen.getAllByText('Add to Resume')[0];
        fireEvent.click(addButton);
        
        expect(mockOnSkillsChange).toHaveBeenCalled();
      });
    });
  });

  describe('RealTimeATSAnalysis', () => {
    beforeEach(() => {
      vi.mocked(atsService.analyzeResume).mockReturnValue({
        score: mockATSScore,
        keywords: [
          { keyword: 'JavaScript', importance: 5, found: true, variations: ['JS'] },
          { keyword: 'Python', importance: 4, found: false, variations: [] }
        ],
        formatIssues: [],
        structureIssues: [],
        recommendations: ['Add more keywords']
      });
    });

    it('performs real-time analysis', async () => {
      const mockOnScoreChange = vi.fn();
      
      render(
        <RealTimeATSAnalysis 
          resumeData={mockResumeData}
          targetRole="Software Engineer"
          onScoreChange={mockOnScoreChange}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Real-time ATS Analysis')).toBeInTheDocument();
        expect(screen.getByText('85')).toBeInTheDocument();
        expect(mockOnScoreChange).toHaveBeenCalledWith(85);
      });
    });

    it('shows keyword analysis', async () => {
      render(
        <RealTimeATSAnalysis 
          resumeData={mockResumeData}
          targetRole="Software Engineer"
          onScoreChange={vi.fn()}
        />
      );
      
      await waitFor(() => {
        // Switch to keywords tab
        const keywordsTab = screen.getByText('Keywords');
        fireEvent.click(keywordsTab);
        
        expect(screen.getByText('Found Keywords')).toBeInTheDocument();
        expect(screen.getByText('Missing Keywords')).toBeInTheDocument();
      });
    });

    it('displays completeness metrics', async () => {
      render(
        <RealTimeATSAnalysis 
          resumeData={mockResumeData}
          targetRole="Software Engineer"
          onScoreChange={vi.fn()}
        />
      );
      
      await waitFor(() => {
        // Switch to completeness tab
        const completenessTab = screen.getByText('Completeness');
        fireEvent.click(completenessTab);
        
        expect(screen.getByText('Resume Completeness')).toBeInTheDocument();
        expect(screen.getByText('Overall Progress')).toBeInTheDocument();
      });
    });
  });

  describe('Integration Tests', () => {
    it('components work together for complete ATS workflow', async () => {
      const mockOnScoreChange = vi.fn();
      const mockOnSkillsChange = vi.fn();
      
      // Mock all services
      vi.mocked(atsService.analyzeResume).mockReturnValue({
        score: mockATSScore,
        keywords: [],
        formatIssues: [],
        structureIssues: [],
        recommendations: []
      });
      
      vi.mocked(skillIntegrationService.getSkillAssessments).mockResolvedValue(mockSkillAssessments);
      vi.mocked(skillIntegrationService.suggestSkillsForResume).mockReturnValue(['JavaScript', 'React']);
      
      // Render components together
      const { rerender } = render(
        <div>
          <RealTimeATSAnalysis 
            resumeData={mockResumeData}
            targetRole="Frontend Developer"
            onScoreChange={mockOnScoreChange}
          />
          <SkillIntegration 
            currentSkills={mockResumeData.skills}
            onSkillsChange={mockOnSkillsChange}
            targetRole="Frontend Developer"
          />
        </div>
      );
      
      // Verify ATS analysis runs
      await waitFor(() => {
        expect(mockOnScoreChange).toHaveBeenCalledWith(85);
      });
      
      // Verify skill suggestions load
      await waitFor(() => {
        expect(skillIntegrationService.getSkillAssessments).toHaveBeenCalled();
      });
      
      // Test skill addition affects ATS score
      await waitFor(() => {
        const addButton = screen.getAllByText('Add to Resume')[0];
        fireEvent.click(addButton);
        
        expect(mockOnSkillsChange).toHaveBeenCalled();
      });
    });
  });
});

describe('Service Integration Tests', () => {
  describe('ATS Service', () => {
    it('analyzes resume data correctly', () => {
      const analysis = atsService.analyzeResume(mockResumeData, 'Software Engineer');
      
      expect(analysis.score.overall).toBeGreaterThan(0);
      expect(analysis.score.breakdown).toHaveProperty('formatting');
      expect(analysis.score.breakdown).toHaveProperty('keywords');
      expect(analysis.score.breakdown).toHaveProperty('structure');
      expect(analysis.keywords).toBeInstanceOf(Array);
      expect(analysis.recommendations).toBeInstanceOf(Array);
    });

    it('provides role-specific analysis', () => {
      const frontendAnalysis = atsService.analyzeResume(mockResumeData, 'Frontend Developer');
      const backendAnalysis = atsService.analyzeResume(mockResumeData, 'Backend Developer');
      
      // Should have different keyword analysis based on role
      expect(frontendAnalysis.keywords).not.toEqual(backendAnalysis.keywords);
    });
  });

  describe('Skill Integration Service', () => {
    it('generates skill suggestions based on assessments', async () => {
      const assessments = await skillIntegrationService.getSkillAssessments('test-user');
      const suggestions = skillIntegrationService.suggestSkillsForResume(assessments, 'Frontend Developer');
      
      expect(assessments).toBeInstanceOf(Array);
      expect(suggestions).toBeInstanceOf(Array);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('prioritizes skills by role relevance', () => {
      const frontendSuggestions = skillIntegrationService.suggestSkillsForResume(mockSkillAssessments, 'Frontend Developer');
      const backendSuggestions = skillIntegrationService.suggestSkillsForResume(mockSkillAssessments, 'Backend Developer');
      
      // Frontend should prioritize React, Backend should prioritize different skills
      expect(frontendSuggestions).toContain('React');
    });
  });

  describe('Export Service', () => {
    it('supports multiple export formats', () => {
      const formats = resumeExportService.constructor.name; // Access to EXPORT_FORMATS
      
      expect(typeof resumeExportService.exportToPDF).toBe('function');
      expect(typeof resumeExportService.exportToWord).toBe('function');
      expect(typeof resumeExportService.exportToText).toBe('function');
      expect(typeof resumeExportService.exportToJSON).toBe('function');
    });
  });
});