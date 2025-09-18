import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutTemplate, 
  Palette, 
  Star, 
  CheckCircle, 
  Eye,
  Zap,
  Target,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { ResumeTemplate } from '@/types/ats';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  customAccent?: string;
  onAccentChange?: (color: string) => void;
  customBg?: string;
  onBgChange?: (color: string) => void;
}

const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Clean, professional design optimized for tech roles with excellent ATS compatibility',
    atsScore: 95,
    category: 'modern',
    features: ['ATS Optimized', 'Tech-focused', 'Clean Layout', 'Keyword Friendly'],
    preview: '/templates/modern-tech.png'
  },
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional format perfect for corporate environments and conservative industries',
    atsScore: 98,
    category: 'classic',
    features: ['Maximum ATS Score', 'Corporate Style', 'Traditional Layout', 'Universal Appeal'],
    preview: '/templates/classic-professional.png'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Minimalist design that highlights content with excellent readability',
    atsScore: 92,
    category: 'minimal',
    features: ['Minimalist', 'Content-focused', 'High Readability', 'Space Efficient'],
    preview: '/templates/minimal-clean.png'
  },
  {
    id: 'creative-modern',
    name: 'Creative Modern',
    description: 'Stylish design for creative roles while maintaining ATS compatibility',
    atsScore: 85,
    category: 'creative',
    features: ['Creative Design', 'Visual Appeal', 'Balanced Layout', 'Industry Specific'],
    preview: '/templates/creative-modern.png'
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Premium design for senior roles and executive positions',
    atsScore: 90,
    category: 'modern',
    features: ['Executive Style', 'Premium Look', 'Leadership Focus', 'Professional Impact'],
    preview: '/templates/executive-premium.png'
  },
  {
    id: 'startup-dynamic',
    name: 'Startup Dynamic',
    description: 'Dynamic design perfect for startup environments and innovative companies',
    atsScore: 88,
    category: 'modern',
    features: ['Startup Culture', 'Innovation Focus', 'Dynamic Layout', 'Growth Oriented'],
    preview: '/templates/startup-dynamic.png'
  }
];

const ACCENT_COLORS = [
  { name: 'Professional Blue', value: '#2563EB', category: 'professional' },
  { name: 'Tech Green', value: '#059669', category: 'tech' },
  { name: 'Corporate Navy', value: '#1E40AF', category: 'corporate' },
  { name: 'Creative Purple', value: '#7C3AED', category: 'creative' },
  { name: 'Executive Gray', value: '#374151', category: 'executive' },
  { name: 'Startup Orange', value: '#EA580C', category: 'startup' },
  { name: 'Finance Teal', value: '#0D9488', category: 'finance' },
  { name: 'Healthcare Red', value: '#DC2626', category: 'healthcare' }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  customAccent = '#2563EB',
  onAccentChange,
  customBg = '#FFFFFF',
  onBgChange
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const getCategoryIcon = (category: ResumeTemplate['category']) => {
    switch (category) {
      case 'modern': return <Zap className="w-4 h-4" />;
      case 'classic': return <Briefcase className="w-4 h-4" />;
      case 'creative': return <Sparkles className="w-4 h-4" />;
      case 'minimal': return <Target className="w-4 h-4" />;
      default: return <LayoutTemplate className="w-4 h-4" />;
    }
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 90) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 85) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const selectedTemplateData = RESUME_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5" />
          Advanced Template System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            {/* Current Selection */}
            {selectedTemplateData && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      {getCategoryIcon(selectedTemplateData.category)}
                      {selectedTemplateData.name}
                    </h3>
                    <Badge className={`${getATSScoreColor(selectedTemplateData.atsScore)} border`}>
                      ATS: {selectedTemplateData.atsScore}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedTemplateData.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplateData.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RESUME_TEMPLATES.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => onTemplateChange(template.id)}
                  onMouseEnter={() => setPreviewTemplate(template.id)}
                  onMouseLeave={() => setPreviewTemplate(null)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedTemplate === template.id && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                        <Badge className={`${getATSScoreColor(template.atsScore)} border text-xs`}>
                          {template.atsScore}%
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.features.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {template.category}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template.id);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Template Recommendations */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  ATS Recommendations
                </h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• <strong>Classic Professional</strong> - Highest ATS compatibility (98%)</p>
                  <p>• <strong>Modern Tech</strong> - Best for technical roles (95%)</p>
                  <p>• <strong>Minimal Clean</strong> - Excellent readability (92%)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customization" className="space-y-4">
            {/* Color Customization */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Palette className="w-4 h-4" />
                  Color Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Accent Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                          customAccent === color.value 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onAccentChange?.(color.value)}
                        title={color.name}
                      >
                        <div 
                          className="w-full h-6 rounded"
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="text-xs mt-1 text-center text-muted-foreground">
                          {color.name.split(' ')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Custom Colors</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accent-color" className="text-xs">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent-color"
                          type="color"
                          value={customAccent}
                          onChange={(e) => onAccentChange?.(e.target.value)}
                          className="w-12 h-8 p-1 border rounded"
                        />
                        <Input
                          type="text"
                          value={customAccent}
                          onChange={(e) => onAccentChange?.(e.target.value)}
                          placeholder="#2563EB"
                          className="flex-1 text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bg-color" className="text-xs">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bg-color"
                          type="color"
                          value={customBg}
                          onChange={(e) => onBgChange?.(e.target.value)}
                          className="w-12 h-8 p-1 border rounded"
                        />
                        <Input
                          type="text"
                          value={customBg}
                          onChange={(e) => onBgChange?.(e.target.value)}
                          placeholder="#FFFFFF"
                          className="flex-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Preview */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Color Preview</Label>
                  <div 
                    className="p-4 rounded-lg border-2"
                    style={{ 
                      backgroundColor: customBg,
                      borderColor: customAccent + '40'
                    }}
                  >
                    <div className="space-y-2">
                      <h3 
                        className="font-bold text-lg"
                        style={{ color: customAccent }}
                      >
                        Your Name
                      </h3>
                      <p className="text-sm text-gray-600">Software Engineer</p>
                      <div 
                        className="h-1 w-16 rounded"
                        style={{ backgroundColor: customAccent }}
                      />
                      <p className="text-xs text-gray-500">
                        This is how your resume colors will look
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Features */}
            {selectedTemplateData && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Template Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTemplateData.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;