import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  LayoutTemplate, 
  Star, 
  Filter, 
  Search, 
  Palette, 
  Settings, 
  CheckCircle,
  Eye,
  Download,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { ResumeTemplate } from '@/types/ats';

interface AdvancedTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  customAccent?: string;
  onAccentChange?: (color: string) => void;
  customBg?: string;
  onBgChange?: (color: string) => void;
  atsScore?: number;
}

interface TemplateCustomization {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  sectionSpacing: number;
  borderRadius: number;
  showIcons: boolean;
  compactMode: boolean;
  headerStyle: 'centered' | 'left' | 'split';
  sectionDividers: boolean;
}

const ENHANCED_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design with gradient header and modern typography',
    atsScore: 95,
    category: 'modern',
    features: ['ATS Optimized', 'Clean Layout', 'Modern Typography', 'Gradient Header', 'Customizable Colors'],
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
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    description: 'Modern design with creative elements for design and creative roles',
    atsScore: 88,
    category: 'creative',
    features: ['Creative Layout', 'Visual Elements', 'Modern Typography', 'Portfolio Ready'],
    preview: '/templates/creative-preview.png'
  },
  {
    id: 'executive',
    name: 'Executive Premium',
    description: 'Premium design for senior-level positions and executives',
    atsScore: 94,
    category: 'classic',
    features: ['Executive Style', 'Premium Look', 'Professional', 'Leadership Focused'],
    preview: '/templates/executive-preview.png'
  },
  {
    id: 'tech',
    name: 'Tech Specialist',
    description: 'Optimized for technical roles with emphasis on skills and projects',
    atsScore: 96,
    category: 'modern',
    features: ['Tech Optimized', 'Skills Focused', 'Project Showcase', 'Developer Friendly'],
    preview: '/templates/tech-preview.png'
  }
];

const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter', category: 'Modern' },
  { value: 'roboto', label: 'Roboto', category: 'Clean' },
  { value: 'open-sans', label: 'Open Sans', category: 'Friendly' },
  { value: 'lato', label: 'Lato', category: 'Professional' },
  { value: 'source-sans', label: 'Source Sans Pro', category: 'Technical' },
  { value: 'nunito', label: 'Nunito', category: 'Modern' },
  { value: 'poppins', label: 'Poppins', category: 'Trendy' },
  { value: 'montserrat', label: 'Montserrat', category: 'Elegant' }
];

const COLOR_PRESETS = [
  { name: 'Professional Blue', primary: '#2563EB', secondary: '#EFF6FF' },
  { name: 'Corporate Gray', primary: '#374151', secondary: '#F9FAFB' },
  { name: 'Success Green', primary: '#059669', secondary: '#ECFDF5' },
  { name: 'Creative Purple', primary: '#7C3AED', secondary: '#F3E8FF' },
  { name: 'Warm Orange', primary: '#EA580C', secondary: '#FFF7ED' },
  { name: 'Tech Teal', primary: '#0D9488', secondary: '#F0FDFA' },
  { name: 'Executive Navy', primary: '#1E40AF', secondary: '#EFF6FF' },
  { name: 'Modern Pink', primary: '#DB2777', secondary: '#FDF2F8' }
];

const AdvancedTemplateSelector: React.FC<AdvancedTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  customAccent = '',
  onAccentChange,
  customBg = '',
  onBgChange,
  atsScore
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'ats' | 'category'>('ats');
  const [customization, setCustomization] = useState<TemplateCustomization>({
    fontFamily: 'inter',
    fontSize: 14,
    lineHeight: 1.5,
    sectionSpacing: 24,
    borderRadius: 8,
    showIcons: true,
    compactMode: false,
    headerStyle: 'centered',
    sectionDividers: true
  });

  const filteredAndSortedTemplates = ENHANCED_TEMPLATES
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'ats':
          return b.atsScore - a.atsScore;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const getATSRecommendation = (templateScore: number) => {
    if (!atsScore) return null;
    
    const improvement = templateScore - atsScore;
    if (improvement > 5) {
      return { type: 'positive', message: `+${improvement} ATS score improvement` };
    } else if (improvement < -5) {
      return { type: 'negative', message: `${improvement} ATS score change` };
    }
    return null;
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    onAccentChange?.(preset.primary);
    onBgChange?.(preset.secondary);
  };

  const generateRandomColors = () => {
    const hue = Math.floor(Math.random() * 360);
    const primary = `hsl(${hue}, 70%, 50%)`;
    const secondary = `hsl(${hue}, 30%, 95%)`;
    onAccentChange?.(primary);
    onBgChange?.(secondary);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5" />
          Advanced Template System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ats">ATS Score</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedTemplates.map((template) => {
                const atsRecommendation = getATSRecommendation(template.atsScore);
                
                return (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-primary border-primary shadow-md' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => onTemplateChange(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                        <div className="text-gray-400 text-sm">Preview</div>
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-5 h-5 text-primary bg-white rounded-full" />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm">{template.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            {template.atsScore}%
                          </Badge>
                        </div>
                        
                        {atsRecommendation && (
                          <Badge 
                            variant={atsRecommendation.type === 'positive' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {atsRecommendation.message}
                          </Badge>
                        )}
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="customization" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Typography */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Typography
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label>Font Family</Label>
                    <Select 
                      value={customization.fontFamily} 
                      onValueChange={(value) => setCustomization(prev => ({ ...prev, fontFamily: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{font.label}</span>
                              <Badge variant="outline" className="text-xs ml-2">
                                {font.category}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Font Size: {customization.fontSize}px</Label>
                    <Slider
                      value={[customization.fontSize]}
                      onValueChange={([value]) => setCustomization(prev => ({ ...prev, fontSize: value }))}
                      min={10}
                      max={18}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Line Height: {customization.lineHeight}</Label>
                    <Slider
                      value={[customization.lineHeight]}
                      onValueChange={([value]) => setCustomization(prev => ({ ...prev, lineHeight: value }))}
                      min={1.2}
                      max={2.0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Layout */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4" />
                  Layout
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label>Header Style</Label>
                    <Select 
                      value={customization.headerStyle} 
                      onValueChange={(value) => setCustomization(prev => ({ ...prev, headerStyle: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="centered">Centered</SelectItem>
                        <SelectItem value="left">Left Aligned</SelectItem>
                        <SelectItem value="split">Split Layout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Section Spacing: {customization.sectionSpacing}px</Label>
                    <Slider
                      value={[customization.sectionSpacing]}
                      onValueChange={([value]) => setCustomization(prev => ({ ...prev, sectionSpacing: value }))}
                      min={12}
                      max={48}
                      step={4}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Border Radius: {customization.borderRadius}px</Label>
                    <Slider
                      value={[customization.borderRadius]}
                      onValueChange={([value]) => setCustomization(prev => ({ ...prev, borderRadius: value }))}
                      min={0}
                      max={16}
                      step={2}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Show Section Icons</Label>
                    <Switch
                      checked={customization.showIcons}
                      onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, showIcons: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Compact Mode</Label>
                    <Switch
                      checked={customization.compactMode}
                      onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, compactMode: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Section Dividers</Label>
                    <Switch
                      checked={customization.sectionDividers}
                      onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, sectionDividers: checked }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color Customization
                </h3>
                <Button variant="outline" size="sm" onClick={generateRandomColors}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Random Colors
                </Button>
              </div>
              
              {/* Color Presets */}
              <div>
                <Label className="mb-3 block">Color Presets</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {COLOR_PRESETS.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => applyColorPreset(preset)}
                    >
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="text-xs text-center">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Custom Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={customAccent}
                      onChange={(e) => onAccentChange?.(e.target.value)}
                      placeholder="#2563EB"
                      className="font-mono"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: customAccent || '#2563EB' }}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <input
                          type="color"
                          value={customAccent || '#2563EB'}
                          onChange={(e) => onAccentChange?.(e.target.value)}
                          className="w-full h-32 cursor-pointer border rounded"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div>
                  <Label>Background Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={customBg}
                      onChange={(e) => onBgChange?.(e.target.value)}
                      placeholder="#FFFFFF"
                      className="font-mono"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: customBg || '#FFFFFF' }}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <input
                          type="color"
                          value={customBg || '#FFFFFF'}
                          onChange={(e) => onBgChange?.(e.target.value)}
                          className="w-full h-32 cursor-pointer border rounded"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedTemplateSelector;