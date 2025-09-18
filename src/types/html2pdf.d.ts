declare module 'html2pdf.js' {
    type Html2PdfOptions = {
      margin?: number | [number, number, number, number];
      filename?: string;
      image?: { type?: 'jpeg' | 'png'; quality?: number };
      html2canvas?: any;
      jsPDF?: any;
      pagebreak?: any;
    };
  
    type Html2PdfInstance = {
      set: (options: Html2PdfOptions) => Html2PdfInstance;
      from: (element: HTMLElement | string) => Html2PdfInstance;
      save: () => Promise<void>;
      outputPdf?: () => any;
    };
  
    function html2pdf(): Html2PdfInstance;
  
    export default html2pdf;
  }
