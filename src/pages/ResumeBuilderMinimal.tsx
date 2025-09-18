'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutTemplate, Target, Eye } from 'lucide-react';
import TemplateSelector from '@/components/resume/TemplateSelectorSimple';
import ExportOptions from '@/components/resume/ExportOptions';
import SkillIntegration from '@/components/resume/SkillIntegration';
import RealTimeATSAnalysis from '@/components/resume/RealTimeATSAnalysis';

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
}

const defaultData: ResumeData = {
  fullName: "Your Name",
  title: "Job Title",
  email: "you@example.com",
  phone: "+1 234 567 8901",
  location: "City, Country",
  website: "https://yourportfolio.com",
  summary: "Brief professional summary highlighting your strengths and what you bring to the role.",
  skills: "JavaScript, TypeScript, React, Node.js, REST APIs, SQL, Git",
  experience: [
    {
      id: "1",
      role: "Software Engineer",
      company: "Company Inc.",
      start: "Jan 2023",
      end: "Present",
      description: "Built and maintained web apps. Drove performance improvements and led feature delivery.",
    },
  ],
  education: [
    {
      id: "1",
      school: "University Name",
      degree: "B.S. in Computer Science",
      start: "2019",
      end: "2023",
    },
  ],
};

const ResumeBuilderMinimal = () => {
  // const [data, setData] = useState<ResumeData>(defaultData);
  const [template, setTemplate] = useState<string>("modern");
  const [customAccent, setCustomAccent] = useState<string>("");
  const [customBg, setCustomBg] = useState<string>("");
  const [atsScore, setATSScore] = useState<number>(0);
  const [targetRole, setTargetRole] = useState<string>("");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <LayoutTemplate className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold">Resume Builder (Enhanced)</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Panel - Editor and Tools */}
        <div className="xl:col-span-2 space-y-6">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            
            {/* <TabsContent value="editor">
              <div className="bg-card border rounded-xl p-6 space-y-6">
                <section>
                  <h2 className="text-lg font-semibold mb-3">Basics</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input 
                      placeholder="Full name" 
                      value={data.fullName} 
                      onChange={e => setData(d => ({...d, fullName: e.target.value}))} 
                    />
                    <Input 
                      placeholder="Title" 
                      value={data.title} 
                      onChange={e => setData(d => ({...d, title: e.target.value}))} 
                    />
                    <Input 
                      placeholder="Email" 
                      value={data.email} 
                      onChange={e => setData(d => ({...d, email: e.target.value}))} 
                    />
                    <Input 
                      placeholder="Phone" 
                      value={data.phone} 
                      onChange={e => setData(d => ({...d, phone: e.target.value}))} 
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">Summary</h2>
                  <Textarea 
                    rows={4} 
                    value={data.summary} 
                    onChange={e => setData(d => ({...d, summary: e.target.value}))} 
                  />
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">Skills</h2>
                  <Input 
                    value={data.skills} 
                    onChange={e => setData(d => ({...d, skills: e.target.value}))} 
                  />
                </section>
              </div>
            </TabsContent> */}
            
            <TabsContent value="templates">
              <TemplateSelector
                selectedTemplate={template}
                onTemplateChange={setTemplate}
                customAccent={customAccent}
                onAccentChange={setCustomAccent}
                customBg={customBg}
                onBgChange={setCustomBg}
              />
            </TabsContent>
            
            {/* <TabsContent value="skills">
              <SkillIntegration
                currentSkills={data.skills}
                onSkillsChange={(skills) => setData(d => ({ ...d, skills }))}
                targetRole={targetRole}
              />
            </TabsContent>
            
            <TabsContent value="export">
              <ExportOptions
                resumeData={data}
                printAreaRef={{ current: null }}
                atsScore={atsScore}
              /> */}
            {/* </TabsContent> */}
          </Tabs>
        </div>

        {/* Right Panel - Preview and ATS Analysis */}
        <div className="xl:col-span-1 space-y-6">
          {/* ATS Analysis */}
          {/* <RealTimeATSAnalysis
            resumeData={data}
            targetRole={targetRole}
            onScoreChange={setATSScore}
          /> */}

          {/* Target Role Input */}
          <div className="bg-card border rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Target Role
            </h3>
            <Input
              placeholder="e.g. Frontend Developer, Data Scientist"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          {/* Preview Placeholder */}
          <div className="bg-card border rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Resume Preview
            </h3>
            <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-sm">Preview will appear here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderMinimal;