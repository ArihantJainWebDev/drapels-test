import React, { useState } from 'react';
import { Rocket, Building2, Code2, User, Clock, Brain, Plus, X, Loader2, Pen, Route } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getAuth } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export interface RoadmapFormProps {
  onSubmit: (formData: {
    company: string;
    domain: string;
    role: string;
    experience: string;
    timeframe: string;
    focusAreas: string[];
    currentSkills: string[];
  }) => void;
  loading: boolean;
  className?: string;
}

export const RoadmapForm: React.FC<RoadmapFormProps> = ({ onSubmit, loading, className }) => {
  const [formData, setFormData] = useState({
    company: '',
    domain: '',
    role: '',
    experience: 'junior',
    timeframe: '6months',
    focusAreas: [] as string[],
    currentSkills: [] as string[]
  });

  const auth = getAuth();
  const user = auth.currentUser;
  const { toast } = useToast();

  const showNotification = (message: string, type: "default" | "destructive" = "default") => {
    toast({
      title: type === "destructive" ? "Error" : "Success",
      description: message,
      variant: type,
    });
  };

  const [newFocusArea, setNewFocusArea] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-1 years)', icon: '🌱' },
    { value: 'junior', label: 'Junior (1-3 years)', icon: '🌿' },
    { value: 'mid', label: 'Mid Level (3-5 years)', icon: '🌳' },
    { value: 'senior', label: 'Senior (5+ years)', icon: '🏆' },
    { value: 'lead', label: 'Lead/Principal (8+ years)', icon: '👑' }
  ];

  const timeframes = [
    { value: '3months', label: '3 Months', description: 'Quick skill boost' },
    { value: '6months', label: '6 Months', description: 'Comprehensive learning' },
    { value: '1year', label: '1 Year', description: 'Career transformation' },
    { value: '2years', label: '2 Years', description: 'Deep expertise' }
  ];

  const domains: (string | { value: string; label: React.ReactNode })[] = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Cloud Computing',
    'Product Management',
    'UI/UX Design',
    { value: 'Custom', label: (
      <div className="flex items-center gap-2">
        <Pen className="h-4 w-4 text-purple-500" />
        <span>Custom</span>
      </div>
    )}
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFocusArea = () => {
    if (newFocusArea.trim() && !formData.focusAreas.includes(newFocusArea.trim())) {
      setFormData(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, newFocusArea.trim()]
      }));
      setNewFocusArea('');
    }
  };

  const removeFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter(a => a !== area)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.currentSkills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        currentSkills: [...prev.currentSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification("Please log in to save and generate your roadmap.", "destructive");
      return;
    }
    if (isFormValid()) {
      try {
        const payload = {
          ...formData,
          domain: formData.domain === 'Custom' ? customDomain.trim() : formData.domain
        };
        await onSubmit(payload);
      } catch (error) {
        showNotification(
          error instanceof Error ? error.message : "Failed to generate roadmap. Please try again.",
          "destructive"
        );
      }
    } else {
      showNotification("Please fill in all required fields and add at least one focus area.", "destructive");
    }
  };

  const isFormValid = () => {
    const domainOk = formData.domain === 'Custom' ? customDomain.trim() : formData.domain.trim();
    return formData.company.trim() &&
      domainOk &&
      formData.role.trim() &&
      formData.focusAreas.length > 0;
  };

  return (
    <>
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="mx-auto max-w-3xl">
            <svg viewBox="0 0 800 160" className="w-full h-36">
              <defs>
                <linearGradient id="roadmapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1EB36B" />
                  <stop offset="50%" stopColor="#A7F3D0" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="60%" stopColor="#1EB36B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1EB36B" stopOpacity="0" />
                </radialGradient>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <path id="roadPath" d="M 20 120 C 160 20, 320 200, 460 80 S 760 80, 780 100" />
              </defs>

              <use href="#roadPath" fill="none" stroke="#E5E7EB" strokeOpacity="0.25" strokeWidth="6" strokeLinecap="round" />
              <use href="#roadPath" fill="none" stroke="url(#roadmapGradient)" strokeWidth="6" strokeLinecap="round" strokeDasharray="14 10" className="animate-roadmap-dash" />
              <use href="#roadPath" fill="none" stroke="url(#roadmapGradient)" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 18" className="animate-roadmap-dash-slow" />

              <g filter="url(#softGlow)">
                <circle r="8" fill="url(#orbGlow)">
                  <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#roadPath" />
                  </animateMotion>
                </circle>
              </g>
            </svg>
            <style>{`
              @keyframes roadmapDash { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -240; } }
              @keyframes roadmapDashSlow { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -120; } }
              .animate-roadmap-dash { animation: roadmapDash 2.2s linear infinite; }
              .animate-roadmap-dash-slow { animation: roadmapDashSlow 4.5s linear infinite; }
            `}</style>
          </div>

          <div className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 pb-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-light mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Route className="h-8 w-8 text-[#1EB36B]" />
                  </motion.div>
                  Generate Your Learning Roadmap
                </h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
                  Create a personalized learning path tailored to your career goals
                </p>
              </motion.div>
            </div>

            <div className="p-8">
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Company Section */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Building2 className="h-4 w-4 text-[#1EB36B]" />
                    </motion.div>
                    Target Company
                  </Label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="e.g., Google"
                      required
                      className="bg-white/50 dark:bg-black/30 border-white/40 dark:border-white/10 backdrop-blur-sm focus:border-[#1EB36B] focus:ring-[#1EB36B]/20"
                    />
                  </motion.div>
                </motion.div>

                {/* Domain Section */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.75 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Code2 className="h-4 w-4 text-[#1EB36B]" />
                    </motion.div>
                    Domain/Field
                  </Label>
                  <div className="space-y-2">
                    <Select
                      value={formData.domain}
                      onValueChange={(value) => handleInputChange('domain', value)}
                    >
                      <SelectTrigger className="bg-white/50 dark:bg-black/30 border-white/40 dark:border-white/10 backdrop-blur-sm focus:border-[#1EB36B] focus:ring-[#1EB36B]/20">
                        <SelectValue placeholder="Select your domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {domains.map((domain) => (
                          <SelectItem
                            key={typeof domain === 'string' ? domain : domain.value}
                            value={typeof domain === 'string' ? domain : domain.value}
                          >
                            {typeof domain === 'string' ? domain : domain.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.domain === 'Custom' && (
                      <Input
                        className="mt-1 bg-white/50 dark:bg-black/30 border-white/40 dark:border-white/10 backdrop-blur-sm focus:border-[#1EB36B] focus:ring-[#1EB36B]/20"
                        placeholder="Enter custom domain"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        autoFocus
                      />
                    )}
                  </div>
                </motion.div>

                {/* Role Section */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <User className="h-4 w-4 text-[#1EB36B]" />
                    </motion.div>
                    Target Role
                  </Label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Input
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      placeholder="e.g., Software Engineer"
                      required
                      className="bg-white/50 dark:bg-black/30 border-white/40 dark:border-white/10 backdrop-blur-sm focus:border-[#1EB36B] focus:ring-[#1EB36B]/20"
                    />
                  </motion.div>
                </motion.div>

                {/* Experience Level */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Brain className="h-4 w-4 text-[#1EB36B]" />
                    </motion.div>
                    Experience Level
                  </Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) => handleInputChange('experience', value)}
                  >
                    <SelectTrigger className="bg-white/50 dark:bg-black/30 border-white/40 dark:border-white/10 backdrop-blur-sm focus:border-[#1EB36B] focus:ring-[#1EB36B]/20">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg leading-none">{level.icon}</span>
                            <span>{level.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Timeframe */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.85 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <Clock className="h-4 w-4 text-[#1EB36B]" />
                    Learning Timeframe
                  </Label>
                  <Select
                    value={formData.timeframe}
                    onValueChange={(value) => handleInputChange('timeframe', value)}
                  >
                    <SelectTrigger className="bg-white/50 dark:bg-black/30 border-white/40 dark:border-white/10 backdrop-blur-sm focus:border-[#1EB36B] focus:ring-[#1EB36B]/20">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{t.label}</span>
                            <span className="text-xs text-muted-foreground">{t.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Focus Areas */}
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">Focus Areas (What you want to learn)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFocusArea}
                      onChange={(e) => setNewFocusArea(e.target.value)}
                      placeholder="e.g., React"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFocusArea())}
                      className="bg-white/50 dark:bg-black/30 border-white/40 dark:border-white/10 backdrop-blur-sm focus:border-[#1EB36B] focus:ring-[#1EB36B]/20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={!newFocusArea.trim()}
                      onClick={addFocusArea}
                      className="bg-white/50 dark:bg-black/30 border-white/40 dark:border-white/10 backdrop-blur-sm hover:bg-[#1EB36B]/10 hover:border-[#1EB36B]/40"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.focusAreas.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.focusAreas.map(area => (
                        <div
                          key={area}
                          className="inline-flex items-center gap-1 bg-[#1EB36B]/10 text-[#1EB36B] border border-[#1EB36B]/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm"
                        >
                          {area}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 hover:bg-transparent"
                            onClick={() => removeFocusArea(area)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      Add at least one focus area to continue
                    </p>
                  )}
                </div>

                {/* Current Skills */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <Brain className="h-4 w-4 text-[#1EB36B]" />
                    Current Skills (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="e.g., JavaScript"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="bg-white/50 dark:bg-black/30 border-white/40 dark:border-white/10 backdrop-blur-sm focus:border-[#1EB36B] focus:ring-[#1EB36B]/20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={!newSkill.trim()}
                      onClick={addSkill}
                      className="bg-white/50 dark:bg-black/30 border-white/40 dark:border-white/10 backdrop-blur-sm hover:bg-[#1EB36B]/10 hover:border-[#1EB36B]/40"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.currentSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.currentSkills.map(skill => (
                        <div
                          key={skill}
                          className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm"
                        >
                          {skill}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 hover:bg-transparent"
                            onClick={() => removeSkill(skill)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Help us tailor the roadmap to your existing knowledge
                  </p>
                </div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button
                      type="submit"
                      className="cursor-can-hover w-full bg-[#1EB36B] hover:bg-[#149056] text-white border-0 h-12 text-lg font-medium rounded-full shadow-xl"
                      disabled={!isFormValid() || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Roadmap...
                        </>
                      ) : (
                        <>
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Rocket className="h-4 w-4 mr-2" />
                          </motion.div>
                          Generate My Roadmap
                          <span className="ml-2 inline-flex items-center gap-1 text-xs">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-sky-500 dark:text-sky-400">
                              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
                            </svg>
                            20
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
