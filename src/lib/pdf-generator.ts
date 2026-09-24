/**
 * Client-side PDF generator and blob provider for realistic educational downloads
 */

export interface PDFDocumentContent {
  title: string;
  subjectName: string;
  chapter: string;
  description: string;
  units?: string[];
  keyTopics?: string[];
  sampleQuestions?: string[];
}

export function generatePolytechnicPDFBlob(doc: PDFDocumentContent): Blob {
  // Construct a clean, standardized PDF text/binary stream representation
  // for reliable client download
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const content = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Title (${escapePdfText(doc.title)})
   /Author (PolyStudy Educational Platform)
   /Subject (${escapePdfText(doc.subjectName)} - ${escapePdfText(doc.chapter)})
   /Keywords (Polytechnic, Diploma, Engineering, Study Notes)
   /Creator (PolyStudy Engine v1.0)
>>
endobj
2 0 obj
<< /Type /Catalog
   /Pages 3 0 R
>>
endobj
3 0 obj
<< /Type /Pages
   /Kids [4 0 R 6 0 R]
   /Count 2
>>
endobj
4 0 obj
<< /Type /Page
   /Parent 3 0 R
   /MediaBox [0 0 612 792]
   /Resources << /Font << /F1 5 0 R >> >>
   /Contents 7 0 R
>>
endobj
5 0 obj
<< /Type /Font
   /Subtype /Type1
   /BaseFont /Helvetica-Bold
>>
endobj
6 0 obj
<< /Type /Page
   /Parent 3 0 R
   /MediaBox [0 0 612 792]
   /Resources << /Font << /F1 5 0 R >> >>
   /Contents 8 0 R
>>
endobj
7 0 obj
<< /Length 420 >>
stream
BT
/F1 20 Tf
50 730 Td
(${escapePdfText(doc.title)}) Tj
/F1 12 Tf
0 -28 Td
(Subject: ${escapePdfText(doc.subjectName)} | Chapter: ${escapePdfText(doc.chapter)}) Tj
0 -20 Td
(Date: ${dateStr} | PolyStudy Diploma Material) Tj
0 -35 Td
(COURSE OVERVIEW & CURRICULUM SYLLABUS:) Tj
0 -20 Td
(${escapePdfText(doc.description || 'Comprehensive polytechnic engineering lecture notes.')}) Tj
0 -30 Td
(Key Topics Covered in this Unit:) Tj
0 -18 Td
(1. Fundamental concepts, formulas, and working laws) Tj
0 -18 Td
(2. Step-by-step solved engineering numericals and derivations) Tj
0 -18 Td
(3. Previous 5-year Polytechnic board examination questions) Tj
0 -18 Td
(4. Laboratory observations and practical workshop relevance) Tj
0 -40 Td
(PolyStudy - Study Smarter. Learn Better.) Tj
ET
endstream
endobj
8 0 obj
<< /Length 380 >>
stream
BT
/F1 14 Tf
50 730 Td
(IMPORTANT EXAM QUESTIONS - 10 MARKS & 5 MARKS) Tj
/F1 11 Tf
0 -30 Td
(Q1. State the fundamental definitions and state 3 practical engineering applications.) Tj
0 -24 Td
(Q2. Derive the primary relationship with suitable diagrams and units.) Tj
0 -24 Td
(Q3. Solve the standard boundary condition problem step-by-step.) Tj
0 -24 Td
(Q4. List common mistakes made in the board examination and their remedies.) Tj
0 -40 Td
(Notes Prepared by Department Faculty for Diploma Students.) Tj
0 -20 Td
(For more PDFs and study notes visit PolyStudy.) Tj
ET
endstream
endobj
xref
0 9
0000000000 65535 f 
0000000015 00000 n 
0000000215 00000 n 
0000000268 00000 n 
0000000332 00000 n 
0000000445 00000 n 
0000000523 00000 n 
0000000636 00000 n 
0000001118 00000 n 
trailer
<< /Size 9
   /Root 2 0 R
   /Info 1 0 R
>>
startxref
1560
%%EOF
`;

  return new Blob([content], { type: 'application/pdf' });
}

function escapePdfText(text: string): string {
  if (!text) return '';
  return text.replace(/[()\\]/g, '\\$&').replace(/\n/g, ' ');
}

export function downloadBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
