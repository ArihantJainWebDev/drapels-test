import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutTemplate, Star, Filter, Search, Palette, Settings, CheckCircle } from 'lucide-react';
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
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design with gradient header and modern typography',
    atsScore: 95,
    category: 'modern',
    features: ['ATS Optimized', 'Clean Layout', 'Modern Typography', 'Gradient Header'],
    preview: '/templates/modern-preview.png'
  },
  {
    id: 'classic',
    name: 'Classic Traditional',
    description: 'Traditional format preferred by conservative industries',
    atsScore: 98,
    category: 'classic',
    features: ['Highest ATS Score', 'Traditional Layout', 'Conservative Design', 'Industry Standard'],
    preview: '/templates/classic-preview.png'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Minimalist design focusing on content over decoration',
    atsScore: 92,
    category: 'minimal',
    features: ['Content Focused', 'Clean Lines', 'Minimal Design', 'Easy to Read'],
    preview: '/templates/minimal-preview.png'
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  customAccent = '',
  onAccentChange,
  customBg = '',
  onBgChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = RESUME_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5" />
          Resume Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTemplate === template.id 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => onTemplateChange(template.id)}
              >
                <CardContent className="p-4">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative">
                    <div className="text-gray-400 text-sm">Preview</div>
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-primary bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      <Badge variant="outline">
                        <Star className="w-3 h-3 mr-1" />
                        {template.atsScore}%
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;