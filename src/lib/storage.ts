import { Subject, PDFMaterial, NoteMaterial, SiteSettings, LegalPage, AdminUser } from '../types';

const STORAGE_KEYS = {
  SUBJECTS: 'polystudy_subjects_v1',
  PDFS: 'polystudy_pdfs_v1',
  NOTES: 'polystudy_notes_v1',
  SETTINGS: 'polystudy_settings_v1',
  LEGAL: 'polystudy_legal_v1',
  ADMIN_SESSION: 'polystudy_admin_session_v1',
};

// Initial Seed Data with real generated images & clean educational content
const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-math-1',
    name: 'Engineering Mathematics',
    slug: 'engineering-mathematics',
    description: 'Matrices, differential calculus, integral calculus, vectors, and differential equations for diploma engineering.',
    image_url: '/src/assets/images/thumb_engineering_math_1790238845271.jpg',
    display_order: 1,
    status: 'published',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-phys-2',
    name: 'Engineering Physics',
    slug: 'engineering-physics',
    description: 'Units & dimensions, motion, optics, acoustics, lasers, fiber optics, and semiconductor physics.',
    image_url: '/src/assets/images/thumb_engineering_physics_1790238857653.jpg',
    display_order: 2,
    status: 'published',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-chem-3',
    name: 'Engineering Chemistry',
    slug: 'engineering-chemistry',
    description: 'Atomic structure, chemical bonding, electrochemistry, water technology, engineering materials, and lubricants.',
    image_url: '/src/assets/images/thumb_eng_chemistry_1790239839384.jpg',
    display_order: 3,
    status: 'published',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-draw-4',
    name: 'Engineering Drawing',
    slug: 'engineering-drawing',
    description: 'Lettering, dimensioning, orthographic projections, isometric views, section of solids, and CAD basics.',
    image_url: '/src/assets/images/thumb_engineering_drawing_1790238871086.jpg',
    display_order: 4,
    status: 'published',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-comm-5',
    name: 'Communication Skills',
    slug: 'communication-skills',
    description: 'English grammar, vocabulary, technical report writing, official correspondence, and professional oral communication.',
    image_url: '/src/assets/images/thumb_comm_skills_1790239867663.jpg',
    display_order: 5,
    status: 'published',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-comp-6',
    name: 'Computer Fundamentals',
    slug: 'computer-fundamentals',
    description: 'Hardware architecture, operating systems, algorithms, flowcharting, and C programming fundamentals.',
    image_url: '/src/assets/images/thumb_computer_fund_1790239853518.jpg',
    display_order: 6,
    status: 'published',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_PDFS: PDFMaterial[] = [
  {
    id: 'pdf-math-1',
    title: 'Matrices – Unit 1',
    slug: 'matrices-unit-1',
    subject_id: 'sub-math-1',
    chapter: 'Unit 1: Matrices & Determinants',
    description: 'Complete concepts of Matrix types, Rank of matrix, Cayley-Hamilton Theorem, Eigen values, and inverse matrix with 20 solved diploma board questions.',
    file_url: 'https://polystudy.edu/files/matrices-unit-1.pdf',
    file_size: '2.4 MB',
    tags: ['Matrices', 'Determinants', 'Eigenvalues', 'Diploma Semester 1'],
    status: 'published',
    is_featured: true,
    download_count: 428,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pdf-math-2',
    title: 'Differential Calculus & Maxima Minima',
    slug: 'differential-calculus-maxima-minima',
    subject_id: 'sub-math-1',
    chapter: 'Unit 2: Differential Calculus',
    description: 'Successive differentiation, Leibnitz theorem, tangent and normal, and practical engineering optimization problems.',
    file_url: 'https://polystudy.edu/files/differential-calculus.pdf',
    file_size: '3.1 MB',
    tags: ['Calculus', 'Derivatives', 'Leibnitz Theorem', 'Maxima Minima'],
    status: 'published',
    is_featured: false,
    download_count: 312,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pdf-phys-1',
    title: 'Engineering Physics – Optics & Laser Waves',
    slug: 'optics-and-laser-waves',
    subject_id: 'sub-phys-2',
    chapter: 'Unit 3: Modern Optics & Lasers',
    description: 'Interference in thin films, diffraction grating, Ruby Laser, He-Ne Laser, and step-by-step fiber optic communication principles.',
    file_url: 'https://polystudy.edu/files/optics-laser-waves.pdf',
    file_size: '1.9 MB',
    tags: ['Optics', 'Laser', 'Fiber Optics', 'Physics'],
    status: 'published',
    is_featured: true,
    download_count: 519,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pdf-draw-1',
    title: 'Isometric & Orthographic Projections Guide',
    slug: 'isometric-orthographic-projections',
    subject_id: 'sub-draw-4',
    chapter: 'Unit 2: Projections of Solids',
    description: 'Standard first-angle and third-angle projections, missing view practice sheets, and step-by-step drawing exam layouts.',
    file_url: 'https://polystudy.edu/files/drawing-projections.pdf',
    file_size: '4.8 MB',
    tags: ['Engineering Drawing', 'Orthographic', 'Isometric', 'Blueprints'],
    status: 'published',
    is_featured: true,
    download_count: 673,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pdf-chem-1',
    title: 'Electrochemistry & Corrosion Control',
    slug: 'electrochemistry-and-corrosion',
    subject_id: 'sub-chem-3',
    chapter: 'Unit 2: Electrochemistry',
    description: 'Galvanic cells, Nernst equation, mechanism of dry and wet corrosion, and cathodic protection methods in industrial engineering.',
    file_url: 'https://polystudy.edu/files/electrochemistry-corrosion.pdf',
    file_size: '2.1 MB',
    tags: ['Chemistry', 'Electrochemistry', 'Corrosion', 'Galvanic Cell'],
    status: 'published',
    is_featured: false,
    download_count: 245,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pdf-comp-1',
    title: 'C Programming & 50 Important Questions',
    slug: 'c-programming-important-questions',
    subject_id: 'sub-comp-6',
    chapter: 'Unit 4: Functions & Pointers',
    description: 'Frequently asked Polytechnic diploma theory and lab exam programming problems with explanations and dry runs.',
    file_url: 'https://polystudy.edu/files/c-programming-50-questions.pdf',
    file_size: '1.7 MB',
    tags: ['C Language', 'Programming', 'Important Questions', 'Pointers'],
    status: 'published',
    is_featured: true,
    download_count: 780,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_NOTES: NoteMaterial[] = [
  {
    id: 'note-math-1',
    title: 'Matrices Quick Formula & Concept Sheet',
    slug: 'matrices-quick-formula-sheet',
    subject_id: 'sub-math-1',
    chapter: 'Unit 1: Matrices',
    description: 'Handcrafted concise summary sheet containing all determinant properties, rank rules, and inverse shortcuts for quick revision before exams.',
    images: [
      {
        id: 'img-1',
        note_id: 'note-math-1',
        image_url: '/src/assets/images/thumb_engineering_math_1790238845271.jpg',
        display_order: 1,
        caption: 'Determinant properties and elementary row transformations'
      },
      {
        id: 'img-2',
        note_id: 'note-math-1',
        image_url: '/src/assets/images/hero_polytechnic_study_1790238832818.jpg',
        display_order: 2,
        caption: 'Eigenvalues & Characteristic Equation step-by-step guide'
      }
    ],
    tags: ['Formula Sheet', 'Revision', 'Matrices'],
    status: 'published',
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'note-phys-1',
    title: 'Laser & Fiber Optics Labeled Diagrams',
    slug: 'laser-fiber-optics-diagrams',
    subject_id: 'sub-phys-2',
    chapter: 'Unit 3: Lasers',
    description: 'Clear labeled ray diagrams for He-Ne laser setup, total internal reflection, numerical aperture, and fiber optic cable construction.',
    images: [
      {
        id: 'img-3',
        note_id: 'note-phys-1',
        image_url: '/src/assets/images/thumb_engineering_physics_1790238857653.jpg',
        display_order: 1,
        caption: 'Laser energy level diagram & stimulated emission mechanism'
      }
    ],
    tags: ['Diagrams', 'Lasers', 'Fiber Optics'],
    status: 'published',
    is_featured: false,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'note-draw-1',
    title: 'Standard Line Types & Title Block Format',
    slug: 'standard-line-types-title-block',
    subject_id: 'sub-draw-4',
    chapter: 'Unit 1: Lines & Lettering',
    description: 'BIS standard line types (continuous thick, hidden dash, center line, cutting plane) and standard A2/A3 drawing sheet layout specifications.',
    images: [
      {
        id: 'img-4',
        note_id: 'note-draw-1',
        image_url: '/src/assets/images/thumb_engineering_drawing_1790238871086.jpg',
        display_order: 1,
        caption: 'BIS Drawing conventions and line types'
      }
    ],
    tags: ['Line Types', 'Title Block', 'Drawing Standards'],
    status: 'published',
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const INITIAL_SETTINGS: SiteSettings = {
  id: 'main',
  site_name: 'PolyStudy',
  tagline: 'Study Smarter. Learn Better.',
  logo_url: '',
  favicon_url: '',
  description: 'Find notes, PDFs, important questions and study material for your diploma engineering studies.',
  contact_email: 'suraj6yadav7g@gmail.com',
  adsense_id: 'ca-pub-1234567890123456',
  analytics_id: 'G-POLYSTUDY99',
  footer_text: 'PolyStudy is dedicated to supporting Polytechnic and Diploma engineering students across all semesters.',
  ads_enabled: true,
  ad_slots: {
    top_banner: true,
    mid_content: true,
    sidebar: true,
    before_footer: true,
  },
  social_links: {
    telegram: 'https://t.me/polystudy_diploma',
    youtube: 'https://youtube.com/@polystudy_engineering',
    github: 'https://github.com/polystudy',
    twitter: 'https://twitter.com/polystudy',
  },
  updated_at: new Date().toISOString(),
};

const INITIAL_LEGAL_PAGES: LegalPage[] = [
  {
    id: 'legal-about',
    page_type: 'about',
    title: 'About PolyStudy',
    content: `Welcome to **PolyStudy** ("Study Smarter. Learn Better.") — your dedicated online repository for Polytechnic and Diploma Engineering study resources.

### Our Mission
Polytechnic education demands rigorous hands-on technical comprehension alongside solid theoretical grounding. Our mission is to make high quality, syllabus-aligned diploma engineering notes, reference PDFs, solved examination questions, and technical blueprints freely accessible to students from every branch.

### What We Provide
- **Subject-Wise Curriculum Notes**: Organized systematically by units and chapters.
- **Downloadable Educational PDFs**: Clean, structured lecture modules ready for mobile and offline revision.
- **Engineering Drawings & Visual Guides**: Crisp projection diagrams, line conventions, and CAD references.
- **Previous Year Question Papers**: Important 10-mark, 5-mark, and 2-mark questions collected from state technical boards.

### Open & Student-First
PolyStudy is designed to be lightweight, modern, and accessible on any device, whether you are revising on your mobile phone on the way to campus or studying on a desktop in the computer lab.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'legal-privacy',
    page_type: 'privacy',
    title: 'Privacy Policy',
    content: `Last Updated: September 2026

At PolyStudy, accessible from https://polystudy.edu, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by PolyStudy and how we use it.

### Information We Collect
We do not require student visitors to create accounts or disclose sensitive personal data to access public educational materials. When you use our contact form, we collect your name and email address solely to respond to your inquiry.

### Log Files & Analytics
PolyStudy follows standard log analysis protocols. This information includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any personally identifiable information.

### Cookies and Web Beacons
Like any other website, PolyStudy uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.

### Google DoubleClick DART Cookie & AdSense
Google is one of our third-party vendors. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.

### Consent
By using our website, you hereby consent to our Privacy Policy and agree to its terms.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'legal-terms',
    page_type: 'terms',
    title: 'Terms and Conditions',
    content: `Last Updated: September 2026

Welcome to PolyStudy! These terms and conditions outline the rules and regulations for the use of PolyStudy's Website, located at https://polystudy.edu.

### 1. Educational Use Only
All study notes, PDFs, formulas, diagrams, and question sets shared on PolyStudy are provided strictly for individual educational revision and reference.

### 2. Intellectual Property Rights
Unless otherwise stated, PolyStudy and/or its licensors own the intellectual property rights for all material on PolyStudy. All intellectual property rights are reserved. You may access this from PolyStudy for your own personal use subjected to restrictions set in these terms and conditions.

### 3. You Must Not:
- Republish material from PolyStudy for commercial resale.
- Sell, rent, or sub-license material from PolyStudy.
- Reproduce, duplicate, or copy material from PolyStudy for unlawful distribution.
- Redistribute content from PolyStudy without proper attribution.

### 4. Disclaimer of Warranties
The materials on PolyStudy's website are provided on an 'as is' basis. PolyStudy makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.`,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'legal-disclaimer',
    page_type: 'disclaimer',
    title: 'Educational Disclaimer',
    content: `Last Updated: September 2026

### General Information
The information provided by PolyStudy ("we", "us", or "our") on https://polystudy.edu is for general educational and informational purposes only. All information on the Site is provided in good faith.

### Curriculum Alignment
While we strive to align our notes with current Polytechnic and Technical Board syllabi, academic curricula may vary across states and technical boards (such as BTE, DTE, MSBTE, SBTE, etc.). Students are advised to cross-reference with their institutional textbooks and official board syllabus guidelines.

### External Links Disclaimer
The Site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.

### Technical Preparation for Advertisements
This website is technically structured to support standard advertisements including Google AdSense. Display of advertisements does not constitute an endorsement of advertised products or services.`,
    updated_at: new Date().toISOString(),
  }
];

// Local store helpers with event dispatching
export const DataStore = {
  getSubjects(): Subject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (data) {
        const parsed: Subject[] = JSON.parse(data);
        // Automatically repair initial default thumbnails if they were pointing to the math placeholder
        let changed = false;
        parsed.forEach((s) => {
          if (s.id === 'sub-chem-3' && s.image_url.includes('thumb_engineering_math')) {
            s.image_url = '/src/assets/images/thumb_eng_chemistry_1790239839384.jpg';
            changed = true;
          } else if (s.id === 'sub-comm-5' && s.image_url.includes('thumb_engineering_math')) {
            s.image_url = '/src/assets/images/thumb_comm_skills_1790239867663.jpg';
            changed = true;
          } else if (s.id === 'sub-comp-6' && s.image_url.includes('thumb_engineering_math')) {
            s.image_url = '/src/assets/images/thumb_computer_fund_1790239853518.jpg';
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    return INITIAL_SUBJECTS;
  },

  saveSubjects(subjects: Subject[]) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    window.dispatchEvent(new CustomEvent('polystudy:subjects_updated'));
  },

  saveSubject(subject: Subject) {
    const list = this.getSubjects();
    const index = list.findIndex((s) => s.id === subject.id);
    if (index >= 0) {
      list[index] = subject;
    } else {
      list.push(subject);
    }
    this.saveSubjects(list);
  },

  deleteSubject(id: string) {
    const list = this.getSubjects().filter((s) => s.id !== id);
    this.saveSubjects(list);
  },

  getPDFs(): PDFMaterial[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PDFS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.PDFS, JSON.stringify(INITIAL_PDFS));
    return INITIAL_PDFS;
  },

  savePDFs(pdfs: PDFMaterial[]) {
    localStorage.setItem(STORAGE_KEYS.PDFS, JSON.stringify(pdfs));
    window.dispatchEvent(new CustomEvent('polystudy:pdfs_updated'));
  },

  savePDF(pdf: PDFMaterial) {
    const list = this.getPDFs();
    const index = list.findIndex((p) => p.id === pdf.id);
    if (index >= 0) {
      list[index] = pdf;
    } else {
      list.unshift(pdf);
    }
    this.savePDFs(list);
  },

  deletePDF(id: string) {
    const list = this.getPDFs().filter((p) => p.id !== id);
    this.savePDFs(list);
  },

  getNotes(): NoteMaterial[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
    return INITIAL_NOTES;
  },

  saveNotes(notes: NoteMaterial[]) {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    window.dispatchEvent(new CustomEvent('polystudy:notes_updated'));
  },

  saveNote(note: NoteMaterial) {
    const list = this.getNotes();
    const index = list.findIndex((n) => n.id === note.id);
    if (index >= 0) {
      list[index] = note;
    } else {
      list.unshift(note);
    }
    this.saveNotes(list);
  },

  deleteNote(id: string) {
    const list = this.getNotes().filter((n) => n.id !== id);
    this.saveNotes(list);
  },

  getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed: SiteSettings = JSON.parse(data);
        if (!parsed.contact_email || parsed.contact_email.includes('polystudy.edu')) {
          parsed.contact_email = 'suraj6yadav7g@gmail.com';
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  },

  saveSettings(settings: SiteSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('polystudy:settings_updated'));
  },

  getLegalPages(): LegalPage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEGAL);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.LEGAL, JSON.stringify(INITIAL_LEGAL_PAGES));
    return INITIAL_LEGAL_PAGES;
  },

  saveLegalPages(pages: LegalPage[]) {
    localStorage.setItem(STORAGE_KEYS.LEGAL, JSON.stringify(pages));
    window.dispatchEvent(new CustomEvent('polystudy:legal_updated'));
  },

  saveLegalPage(page: LegalPage) {
    const list = this.getLegalPages();
    const index = list.findIndex((p) => p.page_type === page.page_type);
    if (index >= 0) {
      list[index] = page;
    } else {
      list.push(page);
    }
    this.saveLegalPages(list);
  },

  getAdminSession(): AdminUser | null {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (session) {
        const parsed: AdminUser = JSON.parse(session);
        if (parsed.email && parsed.email.includes('polystudy.edu')) {
          parsed.email = 'suraj6yadav7g@gmail.com';
          localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  },

  setAdminSession(user: AdminUser | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
    window.dispatchEvent(new CustomEvent('polystudy:auth_updated'));
  },

  clearAdminSession() {
    this.setAdminSession(null);
  },

  resetToDemo() {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.PDFS, JSON.stringify(INITIAL_PDFS));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.LEGAL, JSON.stringify(INITIAL_LEGAL_PAGES));
    window.dispatchEvent(new CustomEvent('polystudy:reset'));
  }
};

/**
 * Slug generator with collision handling
 */
export function generateSlug(title: string, existingSlugs: string[] = []): string {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) slug = 'item-' + Math.random().toString(36).substring(2, 7);

  let uniqueSlug = slug;
  let counter = 1;
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
