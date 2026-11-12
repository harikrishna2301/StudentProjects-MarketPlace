import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  ShieldCheck,
  Award,
  BookCheck,
  Server,
  Layers,
  HelpCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SEOHead
        title="About ProjectKit — Academic Technology Marketplace for Engineering Students"
        description="Learn how ProjectKit empowers engineering students with verified, runnable capstone project kits, clean architectures, and IEEE academic documentation."
        canonicalPath="/about"
      />
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Academic Capstone Excellence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empowering Engineering Students to Build & Defend Great Projects
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          ProjectKit is a dedicated academic marketplace engineered specifically for B.Tech final-year and pre-final year engineering students.
        </p>
      </div>

      {/* Mission & Problem Solved */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">The Problem with Academic Projects</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Every year, thousands of engineering students struggle with fragmented GitHub repositories, broken Maven/npm dependencies, missing database seeds, and poorly formatted documentation that fails strict university review guidelines.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            External university examiners repeatedly grill students on architecture, ER diagrams, and concurrency questions that generic online tutorials completely fail to explain.
          </p>
        </div>

        <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-white">The ProjectKit Standard</h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            We provide full-turnkey academic kits. Every single kit undergoes strict verification: clean compilation on standard runtimes (Java 17, Node 18, Python 3.10), normalized 3NF MySQL schemas, and comprehensive IEEE 830 documentation.
          </p>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Plus, our specialized Viva Voce cheat sheets equip students with model answers to the 60+ most frequently posed questions by external evaluation committees.
          </p>
        </div>
      </div>

      {/* Backend Architecture Readiness */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white p-8 sm:p-10 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Enterprise Java & Spring Boot Roadmap</h3>
            <p className="text-xs text-slate-400">
              Future-proof REST API architecture designed for seamless Spring Boot 3 integration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 dark:bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="font-semibold text-blue-400">Java 17 & Spring Boot 3</div>
            <p className="text-slate-400">
              Clean REST controllers, Spring Security 6, and JWT authentication lifecycle.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 dark:bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="font-semibold text-emerald-400">MySQL 8 Relational Schema</div>
            <p className="text-slate-400">
              Hibernate JPA entity mapping with transaction isolation and indexing.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 dark:bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="font-semibold text-purple-400">Axios API Client Ready</div>
            <p className="text-slate-400">
              Pre-configured interceptors, Bearer token injection, and error retry handlers.
            </p>
          </div>
        </div>
      </div>

      {/* What each kit contains */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">What Every Academic Kit Includes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">80+ Page IEEE Thesis</div>
              <p className="mt-0.5">Complete literature survey, proposed architecture, testing methodologies, and references in Word & PDF.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">UML & Architecture Diagrams</div>
              <p className="mt-0.5">Class diagrams, Use Case diagrams, Sequence diagrams, and ER models in high-resolution PNG & StarUML.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Viva Voce Q&A Cheat Sheet</div>
              <p className="mt-0.5">60+ examiner questions with precise technical explanations to defend your project with 100% confidence.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Verified Database Scripts</div>
              <p className="mt-0.5">Normalized MySQL/PostgreSQL schema scripts pre-populated with realistic dummy rows for your live demo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
        >
          <span>Explore Final Year Kits Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
