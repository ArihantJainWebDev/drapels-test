import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileText, 
  File, 
  FileCode, 
  Database,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Info
} from 'lucide-react';
import { ExportFormat } from '@/types/ats';
import { resumeExportService, EXPORT_FORMATS } from '@/services/resumeExportService';
import { useToast } from '@/hooks/use-toast';

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
    id: string;
    role: string;
    company: string;
    start: string;
    end: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    start: string;
    end: string;
  }>;
  photo?: { dataUrl: string; shape: string; path?: string } | null;
}

interface ExportOptionsProps {
  resumeData: ResumeData;
  printAreaRef: React.RefObject<HTMLElement>;
  atsScore?: number;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  resumeData, 
  printAreaRef, 
  atsScore 
}) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { toast } = useToast();

  const getFormatIcon = (format: ExportFormat['format']) => {
    switch (format) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'docx':
        return <File className="w-5 h-5" />;
      case 'txt':
        return <FileCode className="w-5 h-5" />;
      case 'json':
        return <Database className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getFormatColor = (format: ExportFormat['format']) => {
    switch (format) {
      case 'pdf':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'docx':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'txt':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'json':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleExport = async (format: ExportFormat['format']) => {
    setIsExporting(format);
    
    try {
      const filename = resumeData.fullName || 'resume';
      
      if (format === 'pdf' && !printAreaRef.current) {
        throw new Error('Resume preview not available for PDF export');
      }

      await resumeExportService.exportResume(
        format,
        resumeData,
        printAreaRef.current || undefined,
        filename
      );

      toast({
        title: "Export Successful",
        description: `Your resume has been exported as ${format.toUpperCase()}.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const isResumeComplete = () => {
    return (
      resumeData.fullName.trim() &&
      resumeData.email.trim() &&
      resumeData.summary.trim() &&
      resumeData.skills.trim() &&
      resumeData.experience.length > 0
    );
  };

  const getATSRecommendation = () => {
    if (!atsScore) return null;
    
    if (atsScore >= 90) {
      return {
        type: 'success',
        message: 'Excellent ATS compatibility! All formats are recommended.',
        icon: <CheckCircle className="w-4 h-4" />
      };
    } else if (atsScore >= 75) {
      return {
        type: 'warning',
        message: 'Good ATS compatibility. PDF and Word formats are recommended.',
        icon: <AlertTriangle className="w-4 h-4" />
      };
    } else {
      return {
        type: 'error',
        message: 'Low ATS compatibility. Consider improving your resume before exporting.',
        icon: <AlertTriangle className="w-4 h-4" />
      };
    }
  };

  const atsRecommendation = getATSRecommendation();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ATS Recommendation */}
        {atsRecommendation && (
          <Alert className={
            atsRecommendation.type === 'success' ? 'border-green-200 bg-green-50' :
            atsRecommendation.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
            'border-red-200 bg-red-50'
          }>
            {atsRecommendation.icon}
            <AlertDescription className={
              atsRecommendation.type === 'success' ? 'text-green-800' :
              atsRecommendation.type === 'warning' ? 'text-yellow-800' :
              'text-red-800'
            }>
              {atsRecommendation.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Completion Check */}
        {!isResumeComplete() && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Complete all required sections (name, email, summary, skills, experience) for best export results.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="formats" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="formats">Export Formats</TabsTrigger>
            <TabsTrigger value="tips">Export Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formats" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXPORT_FORMATS.map((format) => (
                <Card 
                  key={format.format}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${getFormatColor(format.format)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getFormatIcon(format.format)}
                        <h3 className="font-semibold text-sm">{format.name}</h3>
                      </div>
                      {format.atsOptimized && (
                        <Badge variant="outline" className="text-xs">
                          ATS Friendly
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      {format.description}
                    </p>
                    
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleExport(format.format)}
                      disabled={isExporting === format.format || (!isResumeComplete() && format.format !== 'json')}
                    >
                      {isExporting === format.format ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Export {format.format.toUpperCase()}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  PDF Export Tips
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Best for email attachments and online applications</li>
                  <li>• Preserves exact formatting and layout</li>
                  <li>• Works on all devices and platforms</li>
                  <li>• Recommended for most job applications</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <File className="w-4 h-4" />
                  Word Document Tips
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Editable format for easy customization</li>
                  <li>• Excellent ATS compatibility</li>
                  <li>• Preferred by many HR systems</li>
                  <li>• Can be modified for specific applications</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  Plain Text Tips
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Maximum ATS compatibility</li>
                  <li>• Perfect for online forms and portals</li>
                  <li>• Easy to copy and paste</li>
                  <li>• Works with any system</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">ATS Optimization</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Use standard fonts (Arial, Calibri, Times New Roman)</li>
                  <li>• Avoid images, graphics, and complex formatting</li>
                  <li>• Include relevant keywords from job descriptions</li>
                  <li>• Use standard section headings</li>
                  <li>• Save in ATS-friendly formats (PDF, DOCX, TXT)</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;