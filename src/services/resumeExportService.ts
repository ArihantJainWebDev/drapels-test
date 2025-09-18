import { ExportFormat } from "@/types/ats";

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

export const EXPORT_FORMATS: ExportFormat[] = [
  {
    format: "pdf",
    name: "PDF Document",
    description: "High-quality PDF perfect for email and online applications",
    atsOptimized: true,
  },
  {
    format: "docx",
    name: "Word Document",
    description: "Microsoft Word format for easy editing and ATS compatibility",
    atsOptimized: true,
  },
  {
    format: "txt",
    name: "Plain Text",
    description: "Simple text format for maximum ATS compatibility",
    atsOptimized: true,
  },
  {
    format: "json",
    name: "JSON Data",
    description: "Structured data format for developers and integrations",
    atsOptimized: false,
  },
];

class ResumeExportService {
  async exportToPDF(element: HTMLElement, filename: string): Promise<void> {
    try {
      const { default: html2pdf } = await import("html2pdf.js");

      const options: html2pdf.Options = {
        margin: [10, 10, 10, 10],
        filename: `${filename}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          imageTimeout: 0,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["css", "legacy"],
        },
      };

      // await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("PDF export failed:", error);
      throw new Error("Failed to export PDF. Please try again.");
    }
  }

  async exportToWord(resumeData: ResumeData, filename: string): Promise<void> {
    try {
      // Import docx library dynamically
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        HeadingLevel,
        AlignmentType,
        BorderStyle,
      } = await import("docx");

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Header with name and title
              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.fullName,
                    bold: true,
                    size: 32,
                    color: "2563EB",
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.title,
                    size: 24,
                    color: "6B7280",
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),

              // Contact Information
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${resumeData.email} | ${resumeData.phone} | ${resumeData.location}`,
                    size: 20,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),

              // Website
              ...(resumeData.website
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: resumeData.website,
                          size: 20,
                          color: "2563EB",
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 600 },
                    }),
                  ]
                : []),

              // Professional Summary
              new Paragraph({
                children: [
                  new TextRun({
                    text: "PROFESSIONAL SUMMARY",
                    bold: true,
                    size: 24,
                    color: "1F2937",
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
                border: {
                  bottom: {
                    color: "E5E7EB",
                    size: 1,
                    style: BorderStyle.SINGLE,
                  },
                },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.summary,
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              }),

              // Skills
              new Paragraph({
                children: [
                  new TextRun({
                    text: "TECHNICAL SKILLS",
                    bold: true,
                    size: 24,
                    color: "1F2937",
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
                border: {
                  bottom: {
                    color: "E5E7EB",
                    size: 1,
                    style: BorderStyle.SINGLE,
                  },
                },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.skills,
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              }),

              // Experience
              new Paragraph({
                children: [
                  new TextRun({
                    text: "PROFESSIONAL EXPERIENCE",
                    bold: true,
                    size: 24,
                    color: "1F2937",
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
                border: {
                  bottom: {
                    color: "E5E7EB",
                    size: 1,
                    style: BorderStyle.SINGLE,
                  },
                },
              }),

              // Experience entries
              ...resumeData.experience.flatMap((exp) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: exp.role,
                      bold: true,
                      size: 22,
                    }),
                    new TextRun({
                      text: ` | ${exp.company}`,
                      size: 22,
                      color: "6B7280",
                    }),
                  ],
                  spacing: { before: 200, after: 100 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${exp.start} - ${exp.end}`,
                      size: 20,
                      color: "6B7280",
                      italics: true,
                    }),
                  ],
                  spacing: { after: 100 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: exp.description,
                      size: 22,
                    }),
                  ],
                  spacing: { after: 300 },
                }),
              ]),

              // Education
              new Paragraph({
                children: [
                  new TextRun({
                    text: "EDUCATION",
                    bold: true,
                    size: 24,
                    color: "1F2937",
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
                border: {
                  bottom: {
                    color: "E5E7EB",
                    size: 1,
                    style: BorderStyle.SINGLE,
                  },
                },
              }),

              // Education entries
              ...resumeData.education.flatMap((edu) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: edu.degree,
                      bold: true,
                      size: 22,
                    }),
                    new TextRun({
                      text: ` | ${edu.school}`,
                      size: 22,
                      color: "6B7280",
                    }),
                  ],
                  spacing: { before: 200, after: 100 },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${edu.start} - ${edu.end}`,
                      size: 20,
                      color: "6B7280",
                      italics: true,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
              ]),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      const arrayBuffer = Buffer.from(buffer);
      const blob = new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Word export failed:", error);
      throw new Error("Failed to export Word document. Please try again.");
    }
  }

  exportToText(resumeData: ResumeData, filename: string): void {
    try {
      const textContent = this.generatePlainText(resumeData);

      const blob = new Blob([textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Text export failed:", error);
      throw new Error("Failed to export text file. Please try again.");
    }
  }

  exportToJSON(resumeData: ResumeData, filename: string): void {
    try {
      const jsonContent = JSON.stringify(resumeData, null, 2);

      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("JSON export failed:", error);
      throw new Error("Failed to export JSON file. Please try again.");
    }
  }

  private generatePlainText(resumeData: ResumeData): string {
    const sections = [];

    // Header
    sections.push(resumeData.fullName.toUpperCase());
    sections.push(resumeData.title);
    sections.push("");

    // Contact
    sections.push("CONTACT INFORMATION");
    sections.push("-".repeat(50));
    sections.push(`Email: ${resumeData.email}`);
    sections.push(`Phone: ${resumeData.phone}`);
    sections.push(`Location: ${resumeData.location}`);
    if (resumeData.website) {
      sections.push(`Website: ${resumeData.website}`);
    }
    sections.push("");

    // Summary
    sections.push("PROFESSIONAL SUMMARY");
    sections.push("-".repeat(50));
    sections.push(resumeData.summary);
    sections.push("");

    // Skills
    sections.push("TECHNICAL SKILLS");
    sections.push("-".repeat(50));
    sections.push(resumeData.skills);
    sections.push("");

    // Experience
    sections.push("PROFESSIONAL EXPERIENCE");
    sections.push("-".repeat(50));
    resumeData.experience.forEach((exp, index) => {
      if (index > 0) sections.push("");
      sections.push(`${exp.role} | ${exp.company}`);
      sections.push(`${exp.start} - ${exp.end}`);
      sections.push("");
      sections.push(exp.description);
    });
    sections.push("");

    // Education
    sections.push("EDUCATION");
    sections.push("-".repeat(50));
    resumeData.education.forEach((edu, index) => {
      if (index > 0) sections.push("");
      sections.push(`${edu.degree} | ${edu.school}`);
      sections.push(`${edu.start} - ${edu.end}`);
    });

    return sections.join("\n");
  }

  async exportResume(
    format: ExportFormat["format"],
    resumeData: ResumeData,
    element?: HTMLElement,
    filename?: string
  ): Promise<void> {
    const exportFilename = filename || resumeData.fullName || "resume";

    switch (format) {
      case "pdf":
        if (!element) throw new Error("HTML element required for PDF export");
        await this.exportToPDF(element, exportFilename);
        break;
      case "docx":
        await this.exportToWord(resumeData, exportFilename);
        break;
      case "txt":
        this.exportToText(resumeData, exportFilename);
        break;
      case "json":
        this.exportToJSON(resumeData, exportFilename);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
}

export const resumeExportService = new ResumeExportService();
