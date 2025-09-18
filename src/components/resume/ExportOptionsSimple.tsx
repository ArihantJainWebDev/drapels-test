import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

interface ExportOptionsProps {
  resumeData: any;
  printAreaRef: any;
  atsScore?: number;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ atsScore }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Export options component - ATS Score: {atsScore}</p>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;