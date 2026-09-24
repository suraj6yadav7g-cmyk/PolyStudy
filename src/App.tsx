/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { PDFViewerModal } from './components/PDFViewerModal';
import { ImageLightbox } from './components/ImageLightbox';

// Public Pages
import { HomePage } from './pages/HomePage';
import { SubjectsPage } from './pages/SubjectsPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { PDFsPage } from './pages/PDFsPage';
import { NotesPage } from './pages/NotesPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';

// Admin Pages
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminSubjects } from './admin/AdminSubjects';
import { AdminPDFs } from './admin/AdminPDFs';
import { AdminNotes } from './admin/AdminNotes';
import { AdminSettings } from './admin/AdminSettings';
import { AdminLegal } from './admin/AdminLegal';

// Storage Engine
import { DataStore } from './lib/storage';
import {
  Subject,
  PDFMaterial,
  NoteMaterial,
  SiteSettings,
  LegalPage as LegalPageType,
  AdminUser,
} from './types';

export default function App() {
  // Database State
  const [subjects, setSubjects] = useState<Subject[]>(() => DataStore.getSubjects());
  const [pdfs, setPdfs] = useState<PDFMaterial[]>(() => DataStore.getPDFs());
  const [notes, setNotes] = useState<NoteMaterial[]>(() => DataStore.getNotes());
  const [settings, setSettings] = useState<SiteSettings>(() => DataStore.getSettings());
  const [legalPages, setLegalPages] = useState<LegalPageType[]>(() => DataStore.getLegalPages());
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => DataStore.getAdminSession());

  // Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<PDFMaterial | null>(null);
  const [viewingNote, setViewingNote] = useState<NoteMaterial | null>(null);

  // Synchronize on PopState (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen to Storage Update Events
  useEffect(() => {
    const onSubjectsUpdated = () => setSubjects(DataStore.getSubjects());
    const onPdfsUpdated = () => setPdfs(DataStore.getPDFs());
    const onNotesUpdated = () => setNotes(DataStore.getNotes());
    const onSettingsUpdated = () => setSettings(DataStore.getSettings());
    const onLegalUpdated = () => setLegalPages(DataStore.getLegalPages());

    window.addEventListener('polystudy:subjects_updated', onSubjectsUpdated);
    window.addEventListener('polystudy:pdfs_updated', onPdfsUpdated);
    window.addEventListener('polystudy:notes_updated', onNotesUpdated);
    window.addEventListener('polystudy:settings_updated', onSettingsUpdated);
    window.addEventListener('polystudy:legal_updated', onLegalUpdated);

    return () => {
      window.removeEventListener('polystudy:subjects_updated', onSubjectsUpdated);
      window.removeEventListener('polystudy:pdfs_updated', onPdfsUpdated);
      window.removeEventListener('polystudy:notes_updated', onNotesUpdated);
      window.removeEventListener('polystudy:settings_updated', onSettingsUpdated);
      window.removeEventListener('polystudy:legal_updated', onLegalUpdated);
    };
  }, []);

  // Keyboard shortcut Cmd+K or Ctrl+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check if current path is a direct PDF link: e.g. /pdf/matrices-unit-1
  useEffect(() => {
    if (currentPath.startsWith('/pdf/')) {
      const slug = currentPath.replace('/pdf/', '');
      const found = pdfs.find((p) => p.slug === slug);
      if (found) {
        setViewingPdf(found);
      }
    }
  }, [currentPath, pdfs]);

  // Navigate helper
  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Admin Data Handlers
  const handleSaveSubject = (sub: Subject) => {
    DataStore.saveSubject(sub);
  };

  const handleDeleteSubject = (id: string) => {
    DataStore.deleteSubject(id);
  };

  const handleSavePdf = (pdf: PDFMaterial) => {
    DataStore.savePDF(pdf);
  };

  const handleDeletePdf = (id: string) => {
    DataStore.deletePDF(id);
  };

  const handleSaveNote = (note: NoteMaterial) => {
    DataStore.saveNote(note);
  };

  const handleDeleteNote = (id: string) => {
    DataStore.deleteNote(id);
  };

  const handleSaveSettings = (newSettings: SiteSettings) => {
    DataStore.saveSettings(newSettings);
  };

  const handleSaveLegal = (page: LegalPageType) => {
    DataStore.saveLegalPage(page);
  };

  const handleLogout = () => {
    DataStore.clearAdminSession();
    setAdminUser(null);
    navigate('/');
  };

  // Render Admin Area if route starts with /admin
  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute) {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => {
            setAdminUser(user);
            navigate('/admin');
          }}
          onBackToSite={() => navigate('/')}
        />
      );
    }

    return (
      <AdminLayout
        currentAdminTab={adminTab}
        adminUser={adminUser}
        settings={settings}
        onSelectTab={(tab) => setAdminTab(tab)}
        onLogout={handleLogout}
        onViewPublicSite={() => navigate('/')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            subjects={subjects}
            pdfs={pdfs}
            notes={notes}
            settings={settings}
            onNavigateTab={(tab) => setAdminTab(tab)}
            onOpenAddSubject={() => setAdminTab('subjects')}
            onOpenAddPdf={() => setAdminTab('pdfs')}
            onOpenAddNote={() => setAdminTab('notes')}
            onSelectPdf={(pdf) => setViewingPdf(pdf)}
          />
        )}
        {adminTab === 'subjects' && (
          <AdminSubjects
            subjects={subjects}
            onSaveSubject={handleSaveSubject}
            onDeleteSubject={handleDeleteSubject}
            onViewSubject={(slug) => navigate(`/subjects/${slug}`)}
          />
        )}
        {adminTab === 'pdfs' && (
          <AdminPDFs
            pdfs={pdfs}
            subjects={subjects}
            onSavePdf={handleSavePdf}
            onDeletePdf={handleDeletePdf}
            onPreviewPdf={(pdf) => setViewingPdf(pdf)}
          />
        )}
        {adminTab === 'notes' && (
          <AdminNotes
            notes={notes}
            subjects={subjects}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onPreviewNote={(note) => setViewingNote(note)}
          />
        )}
        {adminTab === 'featured' && (
          <AdminPDFs
            pdfs={pdfs.filter((p) => p.is_featured)}
            subjects={subjects}
            onSavePdf={handleSavePdf}
            onDeletePdf={handleDeletePdf}
            onPreviewPdf={(pdf) => setViewingPdf(pdf)}
          />
        )}
        {adminTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}
        {adminTab === 'legal' && (
          <AdminLegal
            pages={legalPages}
            onSavePage={handleSaveLegal}
          />
        )}

        {/* Global Modals for preview in Admin */}
        {viewingPdf && (
          <PDFViewerModal
            pdf={viewingPdf}
            subject={subjects.find((s) => s.id === viewingPdf.subject_id)}
            settings={settings}
            onClose={() => setViewingPdf(null)}
            onSelectPdf={(pdf) => setViewingPdf(pdf)}
          />
        )}
        {viewingNote && (
          <ImageLightbox
            images={viewingNote.images}
            noteTitle={viewingNote.title}
            onClose={() => setViewingNote(null)}
          />
        )}
      </AdminLayout>
    );
  }

  // Render Public Website Pages
  let pageContent: React.ReactNode = null;

  if (currentPath === '/' || currentPath === '') {
    pageContent = (
      <HomePage
        subjects={subjects}
        pdfs={pdfs}
        notes={notes}
        settings={settings}
        onNavigate={navigate}
        onSelectPdf={(pdf) => setViewingPdf(pdf)}
        onSelectNote={(note) => setViewingNote(note)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    );
  } else if (currentPath === '/subjects') {
    pageContent = (
      <SubjectsPage
        subjects={subjects}
        pdfs={pdfs}
        notes={notes}
        settings={settings}
        onNavigate={navigate}
      />
    );
  } else if (currentPath.startsWith('/subjects/')) {
    const slug = currentPath.replace('/subjects/', '');
    pageContent = (
      <SubjectDetailPage
        slug={slug}
        subjects={subjects}
        pdfs={pdfs}
        notes={notes}
        settings={settings}
        onNavigate={navigate}
        onSelectPdf={(pdf) => setViewingPdf(pdf)}
        onSelectNote={(note) => setViewingNote(note)}
      />
    );
  } else if (currentPath === '/pdfs') {
    pageContent = (
      <PDFsPage
        pdfs={pdfs}
        subjects={subjects}
        settings={settings}
        onSelectPdf={(pdf) => setViewingPdf(pdf)}
        onViewSubject={(slug) => navigate(`/subjects/${slug}`)}
      />
    );
  } else if (currentPath === '/notes') {
    pageContent = (
      <NotesPage
        notes={notes}
        subjects={subjects}
        settings={settings}
        onSelectNote={(note) => setViewingNote(note)}
        onViewSubject={(slug) => navigate(`/subjects/${slug}`)}
      />
    );
  } else if (currentPath === '/about') {
    pageContent = (
      <LegalPage
        pageType="about"
        pages={legalPages}
        settings={settings}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/privacy-policy') {
    pageContent = (
      <LegalPage
        pageType="privacy"
        pages={legalPages}
        settings={settings}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/terms-and-conditions') {
    pageContent = (
      <LegalPage
        pageType="terms"
        pages={legalPages}
        settings={settings}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/disclaimer') {
    pageContent = (
      <LegalPage
        pageType="disclaimer"
        pages={legalPages}
        settings={settings}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/contact') {
    pageContent = <ContactPage settings={settings} />;
  } else {
    // 404 Fallback
    pageContent = (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-slate-900">404</h2>
        <p className="text-sm text-slate-600">
          The requested study resource or curriculum page could not be located.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1">{pageContent}</main>

      {/* Footer */}
      <Footer settings={settings} onNavigate={navigate} />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        subjects={subjects}
        pdfs={pdfs}
        notes={notes}
        onSelectPdf={(pdf) => setViewingPdf(pdf)}
        onSelectSubject={(slug) => navigate(`/subjects/${slug}`)}
        onSelectNote={(note) => setViewingNote(note)}
      />

      {/* High-Fidelity PDF Viewer Modal */}
      {viewingPdf && (
        <PDFViewerModal
          pdf={viewingPdf}
          subject={subjects.find((s) => s.id === viewingPdf.subject_id)}
          relatedPdfs={pdfs.filter(
            (p) =>
              p.subject_id === viewingPdf.subject_id &&
              p.id !== viewingPdf.id &&
              p.status === 'published'
          )}
          settings={settings}
          onClose={() => setViewingPdf(null)}
          onSelectPdf={(pdf) => setViewingPdf(pdf)}
          onViewSubject={(slug) => navigate(`/subjects/${slug}`)}
        />
      )}

      {/* Image Lightbox Gallery for Notes */}
      {viewingNote && (
        <ImageLightbox
          images={viewingNote.images}
          noteTitle={viewingNote.title}
          onClose={() => setViewingNote(null)}
        />
      )}
    </div>
  );
}
