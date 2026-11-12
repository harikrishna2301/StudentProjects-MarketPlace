import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { useAuth } from '../context/AuthContext';
import { Project, Category, User, Order } from '../types';
import {
  FolderKanban,
  Users,
  Receipt,
  DollarSign,
  PlusCircle,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Tags,
  Building,
  GraduationCap,
  ShieldCheck,
  RotateCcw,
  Eye,
  Filter,
  Check,
  Download,
  AlertTriangle,
  FileText,
  UploadCloud,
  FileArchive,
  Video,
  Globe,
  Image as ImageIcon,
  Presentation as PresentationIcon,
  Lock,
  Unlock,
  CheckCheck,
  Paperclip,
} from 'lucide-react';
import { LegalComplianceAdmin } from '../components/admin/LegalComplianceAdmin';
import { adminService } from '../services/adminService';

interface AdminDashboardProps {
  initialTab?: 'overview' | 'projects' | 'add' | 'categories' | 'orders' | 'users' | 'legal';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'overview' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    projects,
    categories,
    addProject,
    deleteProject,
    updateProject,
    resetToDefaultProjects,
  } = useProjects();
  const { myOrders, user } = useAuth();

  // Determine active tab from URL or prop
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/admin/projects')) return 'projects';
    if (path.includes('/admin/add-project')) return 'add';
    if (path.includes('/admin/categories')) return 'categories';
    if (path.includes('/admin/orders')) return 'orders';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/legal')) return 'legal';
    return initialTab;
  };

  const activeTab = getTabFromPath();

  // Search states for tables
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');

  // Modals state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<any | null>(null);

  // Success toast
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  // Add Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    slug: '',
    category: 'Java & Spring Boot',
    primaryLanguage: 'Java',
    techStack: 'Spring Boot 3, MySQL 8, Hibernate, REST API',
    difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    accessType: 'PAID' as 'PAID' | 'FREE',
    publicationStatus: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    featured: false,
    price: 1999,
    discountPrice: 1499,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 1,
    academicYear: '2025–2026',
    shortDescription: '',
    detailedDescription: '',
    overview: '',
    problemStatement: '',
    features: 'Automated ML classification\nRESTful API integration\nResponsive dashboard',
    objectives: 'Implement core modules\nEnsure test coverage\nPrepare IEEE report',
    modules: 'Auth Module, Main Service, Database Connector',
    hardwareReq: 'Intel Core i5, 8 GB RAM, 2 GB SSD',
    softwareReq: 'JDK 17, MySQL 8, Maven',
    commandSetup: 'mvn clean install && mvn spring-boot:run',
    demoUrl: '',
    demoVideoUrl: '',
  });

  // Resource Files State for Add Project Form
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [sourceZipFile, setSourceZipFile] = useState<{ file: File; name: string; size: string } | null>(null);
  const [presentationFile, setPresentationFile] = useState<{ file: File; name: string; size: string } | null>(null);
  const [docPdfFile, setDocPdfFile] = useState<{ file: File; name: string; size: string } | null>(null);
  const [demoVideoFile, setDemoVideoFile] = useState<{ file: File; name: string; size: string } | null>(null);
  const [demoUrlError, setDemoUrlError] = useState<string>('');

  // Resource Management Modal for Manage Projects Table
  const [resourceModalProject, setResourceModalProject] = useState<Project | null>(null);
  const [resourceUploading, setResourceUploading] = useState<string | null>(null);
  const [resourceSuccess, setResourceSuccess] = useState<string | null>(null);
  const [resourceError, setResourceError] = useState<string | null>(null);

  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // New Category Form State
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: '',
    iconName: 'Globe',
    slug: '',
  });

  // Mock student users list with interactive status toggle
  const [studentsList, setStudentsList] = useState<
    (User & { status: 'Active' | 'Suspended'; purchasesCount: number })[]
  >([
    {
      id: 'usr-101',
      fullName: 'John Doe',
      email: 'john.doe@projectkit.edu',
      phoneNumber: '+91 98451 22890',
      collegeName: 'Metropolitan Institute of Technology',
      role: 'student',
      joinedDate: '2025-08-14',
      status: 'Active',
      purchasesCount: 2,
    },
    {
      id: 'usr-102',
      fullName: 'Sneha Patel',
      email: 'sneha.patel@annauniv.edu',
      phoneNumber: '+91 97890 12345',
      collegeName: 'College of Engineering, Guindy (Anna Univ)',
      role: 'student',
      joinedDate: '2025-09-02',
      status: 'Active',
      purchasesCount: 1,
    },
    {
      id: 'usr-103',
      fullName: 'Karthik Venkat',
      email: 'karthik.v@srmist.edu.in',
      phoneNumber: '+91 91234 56789',
      collegeName: 'SRM Institute of Science & Technology',
      role: 'student',
      joinedDate: '2025-10-11',
      status: 'Active',
      purchasesCount: 3,
    },
    {
      id: 'usr-104',
      fullName: 'Aditya Nambiar',
      email: 'aditya.n@pes.edu',
      phoneNumber: '+91 99887 66554',
      collegeName: 'PES University, Bengaluru',
      role: 'student',
      joinedDate: '2025-11-20',
      status: 'Active',
      purchasesCount: 1,
    },
    {
      id: 'usr-105',
      fullName: 'Pooja Hegde',
      email: 'pooja.h@manipal.edu',
      phoneNumber: '+91 96543 21098',
      collegeName: 'Manipal Institute of Technology (MIT)',
      role: 'student',
      joinedDate: '2026-01-05',
      status: 'Active',
      purchasesCount: 2,
    },
  ]);

  // Aggregated live stats
  const totalRevenue = myOrders.reduce((acc, curr) => acc + curr.amount, 0) + 184500;
  const totalOrdersCount = myOrders.length + 84;
  const totalStudentsCount = 1420;

  // Handle Add Project Submission
  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      setFormError('Please provide a project title.');
      return;
    }
    if (!newProject.shortDescription.trim()) {
      setFormError('Please enter a short description.');
      return;
    }

    const isFree = newProject.accessType === 'FREE';
    const finalPrice = isFree ? 0 : Number(newProject.price);
    const finalOriginalPrice = isFree ? 0 : Number(newProject.originalPrice);

    if (!isFree && finalPrice <= 0) {
      setFormError('Paid projects must have a selling price greater than ₹0.');
      return;
    }

    if (newProject.demoUrl && (newProject.demoUrl.includes('localhost') || newProject.demoUrl.includes('127.0.0.1') || newProject.demoUrl.includes('::1'))) {
      setFormError('Localhost and loopback URLs are not allowed for public live demos. Please use a public URL (e.g. https://demo.projectkit.in).');
      return;
    }

    const techArray = newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean);
    const objArray = newProject.objectives.split('\n').filter(Boolean);
    const modArray = newProject.modules.split(',').map((s) => s.trim()).filter(Boolean);
    const featArray = newProject.features.split('\n').map((s) => s.trim()).filter(Boolean);

    const generatedSlug = newProject.slug.trim()
      ? newProject.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    addProject({
      title: newProject.title,
      slug: generatedSlug,
      category: newProject.category,
      primaryLanguage: newProject.primaryLanguage,
      techStack: techArray.length ? techArray : ['Java', 'MySQL'],
      difficulty: newProject.difficulty,
      isFree,
      accessType: isFree ? 'FREE' : 'PAID',
      publicationStatus: newProject.publicationStatus,
      featured: newProject.featured,
      claimCount: 0,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      rating: 5.0,
      reviewsCount: 1,
      academicYear: newProject.academicYear,
      shortDescription: newProject.shortDescription,
      detailedDescription: newProject.detailedDescription || newProject.shortDescription,
      overview: newProject.overview || newProject.detailedDescription || newProject.shortDescription,
      problemStatement: newProject.problemStatement || 'Automate manual processes in engineering domains.',
      objectives: objArray.length ? objArray : ['Build scalable solution', 'Produce documentation'],
      features: featArray.length
        ? featArray.map((f, i) => ({ title: `Feature ${i + 1}`, description: f }))
        : [
            { title: 'Core Functionality', description: 'Complete working module for capstone.' },
            { title: 'Data Management', description: 'Normalized database CRUD operations.' },
          ],
      modules: modArray.length ? modArray : ['Core Module', 'Database Module'],
      requirements: {
        hardware: newProject.hardwareReq.split(',').map((s) => s.trim()),
        software: newProject.softwareReq.split(',').map((s) => s.trim()),
        dependencies: techArray,
      },
      documentationIncluded: [
        { item: 'IEEE Standard Project Report', format: 'PDF & DOCX (80+ Pages)', description: 'Standard final year thesis.' },
        { item: 'UML Diagrams', format: 'PNG & StarUML', description: 'Class and Sequence diagrams.' },
        { item: 'Database SQL Seed Script', format: 'SQL File', description: 'Ready to import database dump.' },
        { item: 'Viva Voce Q&A Cheat Sheet', format: 'PDF', description: 'Top examiner questions with model answers.' },
      ],
      installationSteps: [
        { step: 1, title: 'Extract Codebase', codeCommand: 'unzip project.zip', description: 'Extract project archive into workspace.' },
        { step: 2, title: 'Execute Application', codeCommand: newProject.commandSetup, description: 'Run application setup commands.' },
      ],
      colorTheme: '#6A2FC8',
      imageUrl: thumbnailPreview || undefined,
      coverImage: thumbnailPreview || undefined,
      screenshots: screenshotPreviews.length > 0 ? screenshotPreviews : undefined,
      demoUrl: newProject.demoUrl || undefined,
      demoVideoUrl: newProject.demoVideoUrl || undefined,
      resources: {
        sourceCodeZip: !!sourceZipFile,
        presentationPpt: !!presentationFile,
        documentationPdf: !!docPdfFile,
        screenshots: screenshotPreviews.length > 0,
        demo: !!(newProject.demoUrl || demoVideoFile),
      },
    });

    const publishedTitle = newProject.title;
    setFormSuccess('Project kit published successfully with all uploaded resource attachments!');
    setFormError('');

    // Reset form state to clean defaults
    setNewProject({
      title: '',
      slug: '',
      category: categories[0]?.name || 'Java & Spring Boot',
      primaryLanguage: 'Java',
      techStack: 'Spring Boot 3, MySQL 8, Hibernate, REST API',
      difficulty: 'Intermediate',
      accessType: 'PAID',
      publicationStatus: 'PUBLISHED',
      featured: false,
      price: 1999,
      discountPrice: 1499,
      originalPrice: 3499,
      rating: 4.9,
      reviewsCount: 1,
      academicYear: '2025–2026',
      shortDescription: '',
      detailedDescription: '',
      overview: '',
      problemStatement: '',
      features: 'Automated ML classification\nRESTful API integration\nResponsive dashboard',
      objectives: 'Implement core modules\nEnsure test coverage\nPrepare IEEE report',
      modules: 'Auth Module, Main Service, Database Connector',
      hardwareReq: 'Intel Core i5, 8 GB RAM, 2 GB SSD',
      softwareReq: 'JDK 17, MySQL 8, Maven',
      commandSetup: 'mvn clean install && mvn spring-boot:run',
      demoUrl: '',
      demoVideoUrl: '',
    });
    setThumbnailPreview('');
    setThumbnailFile(null);
    setScreenshotPreviews([]);
    setScreenshotFiles([]);
    setSourceZipFile(null);
    setPresentationFile(null);
    setDocPdfFile(null);
    setDemoVideoFile(null);

    setTimeout(() => {
      setFormSuccess('');
      navigate('/admin/projects');
      showToast(`Published "${publishedTitle}" to catalog`);
    }, 900);
  };

  // Handle Edit Project Save
  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const isFree = editingProject.accessType === 'FREE' || editingProject.isFree || Number(editingProject.price) === 0;
    const finalPrice = isFree ? 0 : Number(editingProject.price);

    updateProject(editingProject.id, {
      title: editingProject.title,
      category: editingProject.category,
      isFree,
      accessType: isFree ? 'FREE' : 'PAID',
      publicationStatus: editingProject.publicationStatus || 'PUBLISHED',
      price: finalPrice,
      originalPrice: isFree ? 0 : Number(editingProject.originalPrice),
      shortDescription: editingProject.shortDescription,
      primaryLanguage: editingProject.primaryLanguage,
    });

    showToast(`Updated "${editingProject.title}"`);
    setEditingProject(null);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!deletingProject) return;
    deleteProject(deletingProject.id);
    showToast(`Deleted "${deletingProject.title}" from catalog`);
    setDeletingProject(null);
  };

  // Toggle user active/suspended status
  const toggleUserStatus = (userId: string) => {
    setStudentsList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
    showToast('Updated student account status');
  };

  // Filter projects in management table
  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.primaryLanguage.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(projectSearch.toLowerCase());
    const matchCategory =
      projectCategoryFilter === 'All' ||
      p.category.toLowerCase() === projectCategoryFilter.toLowerCase();
    return matchSearch && matchCategory;
  });

  // Filter orders
  const filteredOrders = myOrders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.projectTitle.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.paymentMethod.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  // Filter users
  const filteredUsers = studentsList.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.collegeName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Top Header Banner */}
      <div className="bg-[#0B1329] rounded-2xl p-6 sm:p-8 border border-[#1A2846] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3B82F6] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Marketplace Administration Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
            Welcome, Dr. Anita Sharma
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Curriculum supervisor & project kit catalog manager
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/add-project')}
            className="px-4 py-2 bg-[#6A2FC8] hover:bg-[#5824A8] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Kit</span>
          </button>
        </div>
      </div>

      {/* Global Success Notification Toast */}
      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl max-w-full overflow-x-auto">
        <button
          onClick={() => navigate('/admin')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#6A2FC8] text-white shadow-xs'
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => navigate('/admin/projects')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'projects'
              ? 'bg-[#6A2FC8] text-white shadow-xs'
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
          }`}
        >
          Manage Projects ({projects.length})
        </button>
        <button
          onClick={() => navigate('/admin/add-project')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'add'
              ? 'bg-[#6A2FC8] text-white shadow-xs'
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
          }`}
        >
          + Add Project
        </button>
        <button
          onClick={() => navigate('/admin/categories')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'categories'
              ? 'bg-[#6A2FC8] text-white shadow-xs'
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => navigate('/admin/orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'orders'
              ? 'bg-[#6A2FC8] text-white shadow-xs'
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
          }`}
        >
          Orders ({myOrders.length})
        </button>
        <button
          onClick={() => navigate('/admin/users')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'users'
              ? 'bg-[#6A2FC8] text-white shadow-xs'
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
          }`}
        >
          Students ({studentsList.length})
        </button>
        <button
          onClick={() => navigate('/admin/legal')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'legal'
              ? 'bg-[#6A2FC8] text-white shadow-xs'
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Legal & Compliance</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Statistics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Project Kits</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FolderKanban className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {projects.length}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">100% Verified codebases</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enrolled Students</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {totalStudentsCount.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+18% this semester</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Kit Orders</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {totalOrdersCount}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Average rating 4.9</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gross Marketplace Revenue</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Direct student subscriptions</p>
            </div>
          </div>

          {/* Quick Management Table Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Published Projects</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Catalog items available for student purchase.</p>
              </div>
              <button
                onClick={() => navigate('/admin/projects')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Manage All Projects ({projects.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 font-semibold">Title</th>
                    <th className="py-2.5 font-semibold">Category</th>
                    <th className="py-2.5 font-semibold">Language</th>
                    <th className="py-2.5 font-semibold text-right">Price</th>
                    <th className="py-2.5 font-semibold text-center">Downloads</th>
                    <th className="py-2.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {projects.slice(0, 5).map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-project-title font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {project.title}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{project.category}</td>
                      <td className="py-3 font-mono text-slate-500 dark:text-slate-400">{project.primaryLanguage}</td>
                      <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        ₹{project.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-center font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {project.downloadsCount}
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingProject(project)}
                          className="text-red-500 hover:text-red-700 font-medium text-xs ml-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE PROJECTS (TABLE, SEARCH, EDIT, DELETE CONFIRMATION) */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Project Kits Catalog Management</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Search, inspect, edit pricing, or remove deprecated projects from student store.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <select
                value={projectCategoryFilter}
                onChange={(e) => setProjectCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search project..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
              </div>

              <button
                onClick={() => navigate('/admin/add-project')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Kit</span>
              </button>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-semibold">Project Title & ID</th>
                    <th className="py-3 px-4 font-semibold">Domain</th>
                    <th className="py-3 px-4 font-semibold">Difficulty</th>
                    <th className="py-3 px-4 font-semibold text-right">Price</th>
                    <th className="py-3 px-4 font-semibold text-center">Resources</th>
                    <th className="py-3 px-4 font-semibold text-center">Downloads</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 max-w-sm">
                            <span className="font-project-title font-bold text-slate-900 dark:text-white truncate">
                              {project.title}
                            </span>
                            {project.isFree || project.accessType === 'FREE' || project.price === 0 ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 shrink-0">
                                FREE
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6A2FC8]/20 text-[#6A2FC8] dark:text-[#D1B8FF] font-semibold border border-[#6A2FC8]/30 shrink-0">
                                PAID
                              </span>
                            )}
                            {project.featured && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold border border-purple-500/30">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                            ID: {project.id} · Status: <span className="uppercase text-[10px] font-semibold">{project.publicationStatus || 'PUBLISHED'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{project.category}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                            (project.difficulty || 'Intermediate') === 'Beginner'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : (project.difficulty || 'Intermediate') === 'Intermediate'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20'
                          }`}>
                            {project.difficulty || 'Intermediate'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">
                          {project.isFree || project.accessType === 'FREE' || project.price === 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-black">FREE (₹0)</span>
                          ) : (
                            <span className="text-slate-900 dark:text-white">₹{project.price.toLocaleString('en-IN')}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap max-w-[190px] mx-auto">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              project.resources?.sourceCodeZip !== false ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`} title="Source Code ZIP Archive">
                              ZIP
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              project.resources?.documentationPdf !== false ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`} title="Documentation PDF Report">
                              PDF
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              project.resources?.presentationPpt !== false ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`} title="Presentation PPT Slides">
                              PPT
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30" title="Interface Screenshots Count">
                              {project.screenshots?.length || 4} Img
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              (project.demoUrl || project.demoVideoUrl) ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`} title="Live Demo / Walkthrough Video">
                              Demo
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-600 dark:text-slate-300 text-xs">
                          {project.isFree || project.accessType === 'FREE'
                            ? `${project.claimCount || 0} claims`
                            : `${project.downloadsCount} purchases`}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                          {/* Manage Resources Button */}
                          <button
                            onClick={() => {
                              setResourceModalProject(project);
                              setResourceError(null);
                              setResourceSuccess(null);
                            }}
                            className="p-1.5 text-purple-600 dark:text-[#D1B8FF] hover:text-purple-800 dark:hover:text-white rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50"
                            title="Manage / Upload Project Resources"
                          >
                            <FileArchive className="w-3.5 h-3.5" />
                          </button>

                          {/* View details */}
                          <button
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Inspect Spec"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Project Button */}
                          <button
                            onClick={() => setEditingProject(project)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50"
                            title="Edit Project"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Project Button with Modal */}
                          <button
                            onClick={() => setDeletingProject(project)}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50"
                            title="Delete Kit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No projects match your search or category filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADD PROJECT FORM */}
      {activeTab === 'add' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Academic Project Kit</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Provide project metadata, technical specifications, and attach verifiable deliverables (ZIP, PDF, PPT, and Demo).
            </p>
          </div>

          {formSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleAddProjectSubmit} className="space-y-6">
            {/* Section A: Basic Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6A2FC8] dark:text-[#D1B8FF]" />
                <span>1. Core Project Specifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setNewProject({
                        ...newProject,
                        title: val,
                        slug: newProject.slug && newProject.slug !== autoSlug ? newProject.slug : autoSlug,
                      });
                    }}
                    placeholder="e.g. AI-Powered Healthcare Diagnostic System"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#6A2FC8] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Slug (Auto-generated, editable)
                  </label>
                  <input
                    type="text"
                    value={newProject.slug}
                    onChange={(e) => setNewProject({ ...newProject, slug: e.target.value })}
                    placeholder="ai-powered-healthcare-diagnostic-system"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#6A2FC8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category / Domain *
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#6A2FC8] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    value={newProject.difficulty}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced',
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#6A2FC8] outline-none"
                  >
                    <option value="Beginner">Beginner (Mini Project / Diploma)</option>
                    <option value="Intermediate">Intermediate (Major Capstone / B.Tech)</option>
                    <option value="Advanced">Advanced (M.Tech / Research Level)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Programming Language *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.primaryLanguage}
                    onChange={(e) => setNewProject({ ...newProject, primaryLanguage: e.target.value })}
                    placeholder="Java, Python, TypeScript, Solidity"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#6A2FC8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Publication Status *
                  </label>
                  <select
                    value={newProject.publicationStatus}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        publicationStatus: e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#6A2FC8] outline-none"
                  >
                    <option value="PUBLISHED">Published (Visible to students)</option>
                    <option value="DRAFT">Draft (Admin review only)</option>
                    <option value="ARCHIVED">Archived (Unlisted)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Technologies Used (comma-separated tags) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.techStack}
                    onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                    placeholder="Spring Boot 3, React 18, MySQL 8, Tailwind CSS, Docker"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#6A2FC8] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <input
                      type="checkbox"
                      checked={newProject.featured}
                      onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                      className="w-4 h-4 text-[#6A2FC8] rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Featured Project Kit</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Promote this project on the homepage featured section</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Section B: Pricing & Access */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>2. Access & Commercial Pricing</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Access Entitlement Model *
                  </label>
                  <select
                    value={newProject.accessType}
                    onChange={(e) => {
                      const access = e.target.value as 'PAID' | 'FREE';
                      setNewProject({
                        ...newProject,
                        accessType: access,
                        price: access === 'FREE' ? 0 : 1999,
                        discountPrice: access === 'FREE' ? 0 : 1499,
                        originalPrice: access === 'FREE' ? 0 : 3499,
                      });
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:border-[#6A2FC8] outline-none"
                  >
                    <option value="PAID">Paid Commercial Kit (Razorpay)</option>
                    <option value="FREE">100% Free Academic Kit (Student Claim)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Selling Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    disabled={newProject.accessType === 'FREE'}
                    value={newProject.price}
                    onChange={(e) => setNewProject({ ...newProject, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:border-[#6A2FC8] outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Original Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    disabled={newProject.accessType === 'FREE'}
                    value={newProject.originalPrice}
                    onChange={(e) => setNewProject({ ...newProject, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:border-[#6A2FC8] outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Section C: Descriptions, Features & Requirements */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>3. Descriptions, Features & Requirements</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Short Description (1-2 lines for catalog card) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newProject.shortDescription}
                    onChange={(e) => setNewProject({ ...newProject, shortDescription: e.target.value })}
                    placeholder="Short summary highlighting core capstone value..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl outline-none focus:border-[#6A2FC8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Description & Academic Scope
                  </label>
                  <textarea
                    rows={4}
                    value={newProject.detailedDescription}
                    onChange={(e) => setNewProject({ ...newProject, detailedDescription: e.target.value })}
                    placeholder="Full in-depth project description, system flow, and modules breakdown..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl outline-none focus:border-[#6A2FC8]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Key Features (One feature per line)
                    </label>
                    <textarea
                      rows={3}
                      value={newProject.features}
                      onChange={(e) => setNewProject({ ...newProject, features: e.target.value })}
                      placeholder="Multi-role authentication&#10;Real-time dashboard&#10;Automated report generator"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl outline-none focus:border-[#6A2FC8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Setup / Terminal Command
                    </label>
                    <textarea
                      rows={3}
                      value={newProject.commandSetup}
                      onChange={(e) => setNewProject({ ...newProject, commandSetup: e.target.value })}
                      placeholder="mvn clean install && mvn spring-boot:run"
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-900 text-blue-300 border border-slate-800 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hardware Requirements (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newProject.hardwareReq}
                      onChange={(e) => setNewProject({ ...newProject, hardwareReq: e.target.value })}
                      placeholder="Intel Core i5, 8GB RAM, 10GB SSD space"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl outline-none focus:border-[#6A2FC8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Software Requirements (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newProject.softwareReq}
                      onChange={(e) => setNewProject({ ...newProject, softwareReq: e.target.value })}
                      placeholder="JDK 17, Node.js 18, MySQL 8"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl outline-none focus:border-[#6A2FC8]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section D: Real File Upload Inputs */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#6A2FC8] dark:text-[#D1B8FF]" />
                <span>4. Deliverable Files & Project Resources Upload</span>
              </h3>

              {/* 1. Project Thumbnail */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#6A2FC8] dark:text-[#D1B8FF]" />
                      <span>Project Thumbnail Image (16:9)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload card preview image (.png, .jpg, .webp up to 10MB)
                    </p>
                  </div>
                  {thumbnailFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview('');
                      }}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="w-28 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-28 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-mono">
                      16:9
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setThumbnailFile(file);
                        setThumbnailPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#6A2FC8] file:text-white hover:file:bg-[#5824A8] cursor-pointer"
                  />
                </div>
              </div>

              {/* 2. Project Screenshots (Multiple) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Project Screenshots Gallery (Multiple)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload interface screenshots, architecture diagrams, or ER diagrams
                    </p>
                  </div>
                  {screenshotPreviews.length > 0 && (
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      {screenshotPreviews.length} selected
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length) {
                      setScreenshotFiles((prev) => [...prev, ...files]);
                      const newPreviews = files.map((f) => URL.createObjectURL(f));
                      setScreenshotPreviews((prev) => [...prev, ...newPreviews]);
                    }
                  }}
                  className="text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#6A2FC8] file:text-white hover:file:bg-[#5824A8] cursor-pointer"
                />

                {screenshotPreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {screenshotPreviews.map((src, i) => (
                      <div key={i} className="relative group/shot rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-[16/9]">
                        <img src={src} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotPreviews((prev) => prev.filter((_, idx) => idx !== i));
                            setScreenshotFiles((prev) => prev.filter((_, idx) => idx !== i));
                          }}
                          className="absolute inset-0 bg-red-600/70 text-white flex items-center justify-center opacity-0 group-hover/shot:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Source Code ZIP Upload */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileArchive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Upload Project Source Code (.zip only) *</span>
                  </label>
                  {sourceZipFile && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{sourceZipFile.size}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <input
                    type="file"
                    accept=".zip,application/zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (!file.name.toLowerCase().endsWith('.zip')) {
                          setFormError('Source code package must be a valid .zip archive.');
                          return;
                        }
                        const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                        setSourceZipFile({ file, name: file.name, size: sizeMb });
                        setFormError('');
                      }
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  />
                  {sourceZipFile && (
                    <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">
                      {sourceZipFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* 4. Presentation PPT/PPTX Upload */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <PresentationIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Upload Project Presentation (.ppt, .pptx only)</span>
                  </label>
                  {presentationFile && (
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{presentationFile.size}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <input
                    type="file"
                    accept=".ppt,.pptx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const ext = file.name.split('.').pop()?.toLowerCase();
                        if (ext !== 'ppt' && ext !== 'pptx') {
                          setFormError('Presentation must be a .ppt or .pptx file.');
                          return;
                        }
                        const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                        setPresentationFile({ file, name: file.name, size: sizeMb });
                        setFormError('');
                      }
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                  />
                  {presentationFile && (
                    <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">
                      {presentationFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* 5. Documentation PDF Upload */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Upload Project Documentation (.pdf only)</span>
                  </label>
                  {docPdfFile && (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{docPdfFile.size}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (!file.name.toLowerCase().endsWith('.pdf')) {
                          setFormError('Documentation must be a valid .pdf file.');
                          return;
                        }
                        const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                        setDocPdfFile({ file, name: file.name, size: sizeMb });
                        setFormError('');
                      }
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
                  />
                  {docPdfFile && (
                    <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">
                      {docPdfFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* 6. Demo and Preview (Live URL & Video) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Project Live Demo & Video Preview</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Live Demo URL (Must be a public URL; localhost is rejected)
                  </label>
                  <input
                    type="url"
                    value={newProject.demoUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes('localhost') || val.includes('127.0.0.1') || val.includes('::1')) {
                        setDemoUrlError('Localhost and loopback URLs are not allowed for public live demos.');
                      } else {
                        setDemoUrlError('');
                      }
                      setNewProject({ ...newProject, demoUrl: val });
                    }}
                    placeholder="https://demo.projectkit.in/my-capstone"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl outline-none focus:border-[#6A2FC8]"
                  />
                  {demoUrlError && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{demoUrlError}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Optional Demo Walkthrough Video (.mp4, .webm)
                  </label>
                  <input
                    type="file"
                    accept=".mp4,.webm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const ext = file.name.split('.').pop()?.toLowerCase();
                        if (ext !== 'mp4' && ext !== 'webm') {
                          setFormError('Demo video must be .mp4 or .webm.');
                          return;
                        }
                        const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                        setDemoVideoFile({ file, name: file.name, size: sizeMb });
                        setFormError('');
                      }
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/projects')}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#6A2FC8] hover:bg-[#5824A8] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish Project Kit with Resources</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Academic Project Categories</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Engineering domain classifications, syllabus mappings, and catalog distribution.
              </p>
            </div>

            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
                      {cat.projectCount} kits
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{cat.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>slug: {cat.slug}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-sans">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Management & Fulfillment</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Audit student purchase transactions, payment tokens, and invoice details.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
              </select>

              <div className="relative w-full sm:w-60">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-semibold">Order Number</th>
                    <th className="py-3 px-4 font-semibold">Project Kit Title</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Payment Method</th>
                    <th className="py-3 px-4 font-semibold text-right">Amount</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-300">
                          {order.orderNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                          {order.projectTitle}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono tabular-nums">{order.date}</td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{order.paymentMethod}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                          ₹{order.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-slate-500">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Enrolled Engineering Students</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verify student accounts, review college affiliations, and manage user access states.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, college..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">College / University</th>
                    <th className="py-3 px-4 font-semibold text-center">Kits Owned</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {student.fullName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{student.email}</td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{student.collegeName}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                        {student.purchasesCount}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            student.status === 'Active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => toggleUserStatus(student.id)}
                          className={`text-xs font-medium hover:underline ${
                            student.status === 'Active' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {student.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: LEGAL & COMPLIANCE MANAGEMENT */}
      {activeTab === 'legal' && <LegalComplianceAdmin />}

      {/* --- MODAL 1: EDIT PROJECT FORM MODAL --- */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditingProject(null)}
        >
          <div
            className="bg-white dark:bg-[#0B1329] rounded-2xl max-w-xl w-full border border-slate-200 dark:border-[#1A2846] p-6 sm:p-8 space-y-5 text-slate-900 dark:text-[#F8FAFC] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1A2846]">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Edit Project Kit</h3>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8]">ID: {editingProject.id}</p>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-[#F8FAFC] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name} className="dark:bg-[#0B1329]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">Primary Language</label>
                  <input
                    type="text"
                    required
                    value={editingProject.primaryLanguage}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, primaryLanguage: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                    Access Entitlement
                  </label>
                  <select
                    value={editingProject.accessType || (editingProject.isFree ? 'FREE' : 'PAID')}
                    onChange={(e) => {
                      const access = e.target.value as 'PAID' | 'FREE';
                      setEditingProject({
                        ...editingProject,
                        accessType: access,
                        isFree: access === 'FREE',
                        price: access === 'FREE' ? 0 : (editingProject.price || 1999),
                        originalPrice: access === 'FREE' ? 0 : (editingProject.originalPrice || 3499),
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB]"
                  >
                    <option value="PAID">Paid Commercial Kit</option>
                    <option value="FREE">100% Free Kit (Student Claim)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                    Publication Status
                  </label>
                  <select
                    value={editingProject.publicationStatus || 'PUBLISHED'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        publicationStatus: e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB]"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    disabled={editingProject.accessType === 'FREE' || editingProject.isFree}
                    value={editingProject.price}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    disabled={editingProject.accessType === 'FREE' || editingProject.isFree}
                    value={editingProject.originalPrice}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.shortDescription}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#1A2846] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#080E20] dark:hover:bg-[#101C38] text-slate-700 dark:text-[#CBD5E1] rounded-xl font-semibold transition-colors border border-slate-200 dark:border-[#1A2846]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: DELETE CONFIRMATION DIALOG MODAL --- */}
      {deletingProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingProject(null)}
        >
          <div
            className="bg-white dark:bg-[#0B1329] rounded-2xl max-w-md w-full border border-slate-200 dark:border-[#1A2846] p-6 space-y-4 text-slate-900 dark:text-[#F8FAFC] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Confirm Project Deletion</h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-slate-800 dark:text-[#CBD5E1] font-mono">"{deletingProject.title}"</span>?
                This action will remove the project from the student marketplace catalog.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingProject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#080E20] dark:hover:bg-[#101C38] text-slate-700 dark:text-[#CBD5E1] rounded-xl text-xs font-semibold transition-colors border border-slate-200 dark:border-[#1A2846]"
              >
                No, Keep Project
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: VIEW ORDER INVOICE MODAL --- */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setViewingOrder(null)}
        >
          <div
            className="bg-white dark:bg-[#0B1329] rounded-2xl max-w-lg w-full border border-slate-200 dark:border-[#1A2846] p-6 space-y-5 text-slate-900 dark:text-[#F8FAFC] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1A2846]">
              <div>
                <span className="text-[10px] font-bold text-[#2F4BFF] dark:text-[#5B7BFF] uppercase tracking-wider">
                  ProjectKit Tax Invoice
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA]">{viewingOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-[#E8ECFA] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-[#CBD5E1]">
                <div>
                  <span className="text-slate-400 dark:text-[#9AA6C7] block text-[10px]">Date of Purchase</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-[#CBD5E1]">{viewingOrder.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-[#9AA6C7] block text-[10px]">Payment Method</span>
                  <span className="font-medium text-slate-800 dark:text-[#CBD5E1]">{viewingOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-[#9AA6C7] block text-[10px]">Invoice Reference</span>
                  <span className="font-mono text-slate-800 dark:text-[#CBD5E1]">{viewingOrder.invoiceId}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-[#9AA6C7] block text-[10px]">Fulfillment Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{viewingOrder.status}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#16224A] rounded-xl border border-slate-200 dark:border-[#25335F] space-y-1">
                <div className="text-[10px] text-slate-500 dark:text-[#9AA6C7] uppercase font-semibold">
                  Purchased Item
                </div>
                <div className="font-bold text-slate-900 dark:text-[#E8ECFA]">{viewingOrder.projectTitle}</div>
                <div className="text-slate-500 dark:text-[#9AA6C7] font-mono text-[11px]">
                  Category: {viewingOrder.category}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-[#E8ECFA] border-t border-slate-200 dark:border-[#25335F]">
                <span>Amount Paid</span>
                <span className="text-[#2F4BFF] dark:text-[#5B7BFF] font-mono text-base tabular-nums">
                  ₹{viewingOrder.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#080E20] dark:hover:bg-[#101C38] text-slate-700 dark:text-[#CBD5E1] rounded-xl text-xs font-semibold transition-colors border border-slate-200 dark:border-[#1A2846]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ADD CATEGORY MODAL --- */}
      {showAddCategoryModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAddCategoryModal(false)}
        >
          <div
            className="bg-white dark:bg-[#0B1329] rounded-2xl max-w-md w-full border border-slate-200 dark:border-[#1A2846] p-6 space-y-4 text-slate-900 dark:text-[#F8FAFC] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1A2846]">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Add Academic Category</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-[#F8FAFC] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`Created category "${newCategoryData.name}"`);
                setShowAddCategoryModal(false);
                setNewCategoryData({ name: '', description: '', iconName: 'Globe', slug: '' });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCategoryData.name}
                  onChange={(e) =>
                    setNewCategoryData({ ...newCategoryData, name: e.target.value })
                  }
                  placeholder="e.g. Cloud Computing & DevOps"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newCategoryData.description}
                  onChange={(e) =>
                    setNewCategoryData({ ...newCategoryData, description: e.target.value })
                  }
                  placeholder="Short syllabus coverage..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#1A2846] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#080E20] dark:hover:bg-[#101C38] text-slate-700 dark:text-[#CBD5E1] rounded-xl font-semibold transition-colors border border-slate-200 dark:border-[#1A2846]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: RESOURCE MANAGEMENT MODAL --- */}
      {resourceModalProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setResourceModalProject(null)}
        >
          <div
            className="bg-white dark:bg-[#0B1329] rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-[#1A2846] p-6 space-y-6 text-slate-900 dark:text-[#F8FAFC] shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-[#1A2846]">
              <div>
                <span className="text-[10px] font-bold text-[#6A2FC8] dark:text-[#D1B8FF] uppercase tracking-wider flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Deliverables & Resources Manager</span>
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#E8ECFA] mt-0.5">
                  {resourceModalProject.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono">ID: {resourceModalProject.id}</span>
                  <span>•</span>
                  <span>{resourceModalProject.category}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6A2FC8]/15 text-[#6A2FC8] dark:text-[#D1B8FF]">
                    {resourceModalProject.difficulty || 'Intermediate'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setResourceModalProject(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-[#E8ECFA] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Alerts */}
            {resourceSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{resourceSuccess}</span>
              </div>
            )}
            {resourceError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <span>{resourceError}</span>
              </div>
            )}

            {/* Live Inventory Status Overview */}
            <div className="p-4 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-[#CBD5E1] uppercase tracking-wider">
                Current Deliverable Status
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846]">
                  <FileArchive className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-slate-400">Source ZIP</span>
                    <span className={`font-semibold text-[11px] ${resourceModalProject.resources?.hasSourceCode ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                      {resourceModalProject.resources?.hasSourceCode ? '✓ Available' : 'Pending Upload'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846]">
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-slate-400">Doc PDF</span>
                    <span className={`font-semibold text-[11px] ${resourceModalProject.resources?.hasDocumentation ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                      {resourceModalProject.resources?.hasDocumentation ? '✓ Available' : 'Pending Upload'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846]">
                  <PresentationIcon className="w-4 h-4 text-purple-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-slate-400">PPT Slides</span>
                    <span className={`font-semibold text-[11px] ${resourceModalProject.resources?.hasPresentation ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                      {resourceModalProject.resources?.hasPresentation ? '✓ Available' : 'Pending Upload'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846]">
                  <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-slate-400">Screenshots</span>
                    <span className="font-semibold text-[11px] text-blue-600 dark:text-blue-400">
                      {resourceModalProject.screenshots?.length || 4} Uploaded
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846]">
                  <Video className="w-4 h-4 text-teal-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-slate-400">Demo Video</span>
                    <span className={`font-semibold text-[11px] ${resourceModalProject.resources?.hasDemoVideo || resourceModalProject.demoVideoUrl ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {resourceModalProject.resources?.hasDemoVideo || resourceModalProject.demoVideoUrl ? '✓ Available' : 'Optional'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846]">
                  <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-slate-400">Live Demo</span>
                    <span className={`font-semibold text-[11px] ${resourceModalProject.demoUrl ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {resourceModalProject.demoUrl ? '✓ Configured' : 'Optional'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Resource Uploaders */}
            <div className="space-y-4 text-xs">
              {/* 1. Source Code Package */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-[#E8ECFA] flex items-center gap-2">
                    <FileArchive className="w-4 h-4 text-emerald-600" />
                    <span>Upload Source Code Package (.zip)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Complete working project folder compressed in .zip format (Max 50MB)
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept=".zip,application/zip"
                    disabled={resourceUploading === 'source'}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.name.toLowerCase().endsWith('.zip')) {
                        setResourceError('Source code package must be a valid .zip archive.');
                        return;
                      }
                      setResourceUploading('source');
                      setResourceError(null);
                      try {
                        await adminService.uploadSourceCode(resourceModalProject.id, file);
                        const updatedResources = {
                          ...resourceModalProject.resources,
                          hasSourceCode: true,
                          sourceCodeSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                        };
                        setResourceModalProject({ ...resourceModalProject, resources: updatedResources });
                        updateProject(resourceModalProject.id, { resources: updatedResources });
                        setResourceSuccess(`Successfully uploaded source code package (${file.name})!`);
                      } catch (err: any) {
                        setResourceError(err.message || 'Failed to upload source code.');
                      } finally {
                        setResourceUploading(null);
                      }
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* 2. Project Presentation PPT */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-[#E8ECFA] flex items-center gap-2">
                    <PresentationIcon className="w-4 h-4 text-purple-600" />
                    <span>Upload Presentation Slides (.ppt, .pptx)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Academic defense slides with synopsis & architecture (Max 25MB)
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept=".ppt,.pptx"
                    disabled={resourceUploading === 'presentation'}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const ext = file.name.split('.').pop()?.toLowerCase();
                      if (ext !== 'ppt' && ext !== 'pptx') {
                        setResourceError('Presentation must be a .ppt or .pptx file.');
                        return;
                      }
                      setResourceUploading('presentation');
                      setResourceError(null);
                      try {
                        await adminService.uploadPresentation(resourceModalProject.id, file);
                        const updatedResources = {
                          ...resourceModalProject.resources,
                          hasPresentation: true,
                          presentationSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                        };
                        setResourceModalProject({ ...resourceModalProject, resources: updatedResources });
                        updateProject(resourceModalProject.id, { resources: updatedResources });
                        setResourceSuccess(`Successfully uploaded presentation slides (${file.name})!`);
                      } catch (err: any) {
                        setResourceError(err.message || 'Failed to upload presentation.');
                      } finally {
                        setResourceUploading(null);
                      }
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* 3. Documentation PDF */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-[#E8ECFA] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Upload Documentation Report (.pdf)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Complete SRS, system architecture, database schema, and test reports (Max 20MB)
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    disabled={resourceUploading === 'documentation'}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.name.toLowerCase().endsWith('.pdf')) {
                        setResourceError('Documentation must be a valid .pdf file.');
                        return;
                      }
                      setResourceUploading('documentation');
                      setResourceError(null);
                      try {
                        await adminService.uploadDocumentation(resourceModalProject.id, file);
                        const updatedResources = {
                          ...resourceModalProject.resources,
                          hasDocumentation: true,
                          documentationPages: 45,
                        };
                        setResourceModalProject({ ...resourceModalProject, resources: updatedResources });
                        updateProject(resourceModalProject.id, { resources: updatedResources });
                        setResourceSuccess(`Successfully uploaded documentation PDF (${file.name})!`);
                      } catch (err: any) {
                        setResourceError(err.message || 'Failed to upload documentation.');
                      } finally {
                        setResourceUploading(null);
                      }
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Screenshot Image */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-[#E8ECFA] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>Add Screenshot to Gallery (.png, .jpg, .webp)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    High-resolution interface or diagram capture for the screenshot carousel
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    disabled={resourceUploading === 'screenshot'}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setResourceUploading('screenshot');
                      setResourceError(null);
                      try {
                        await adminService.uploadScreenshot(resourceModalProject.id, file);
                        const newUrl = URL.createObjectURL(file);
                        const currentShots = resourceModalProject.screenshots || [];
                        const updatedShots = [...currentShots, newUrl];
                        setResourceModalProject({ ...resourceModalProject, screenshots: updatedShots });
                        updateProject(resourceModalProject.id, { screenshots: updatedShots });
                        setResourceSuccess(`Successfully added screenshot (${file.name})!`);
                      } catch (err: any) {
                        setResourceError(err.message || 'Failed to upload screenshot.');
                      } finally {
                        setResourceUploading(null);
                      }
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* 5. Demo Video */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-[#E8ECFA] flex items-center gap-2">
                    <Video className="w-4 h-4 text-teal-600" />
                    <span>Upload Walkthrough Video (.mp4, .webm)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Recorded project demonstration showing full runtime execution (Max 100MB)
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept=".mp4,.webm"
                    disabled={resourceUploading === 'video'}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const ext = file.name.split('.').pop()?.toLowerCase();
                      if (ext !== 'mp4' && ext !== 'webm') {
                        setResourceError('Video must be an .mp4 or .webm file.');
                        return;
                      }
                      setResourceUploading('video');
                      setResourceError(null);
                      try {
                        await adminService.uploadDemoVideo(resourceModalProject.id, file);
                        const updatedResources = {
                          ...resourceModalProject.resources,
                          hasDemoVideo: true,
                        };
                        setResourceModalProject({ ...resourceModalProject, resources: updatedResources });
                        updateProject(resourceModalProject.id, { resources: updatedResources });
                        setResourceSuccess(`Successfully uploaded demo walkthrough video!`);
                      } catch (err: any) {
                        setResourceError(err.message || 'Failed to upload video.');
                      } finally {
                        setResourceUploading(null);
                      }
                    }}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* 6. Live Demo URL */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] rounded-xl space-y-2">
                <div className="font-bold text-slate-900 dark:text-[#E8ECFA] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Live Demo URL (Public Link)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    defaultValue={resourceModalProject.demoUrl || ''}
                    id="resourceDemoUrlInput"
                    placeholder="https://preview.projectkit.dev/demo/..."
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-[#0B1329] border border-slate-200 dark:border-[#1A2846] rounded-xl outline-none text-slate-900 dark:text-[#F8FAFC] text-xs focus:border-[#6A2FC8]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('resourceDemoUrlInput') as HTMLInputElement | null;
                      const val = input?.value.trim() || '';
                      if (val && (val.includes('localhost') || val.includes('127.0.0.1') || val.includes('::1'))) {
                        setResourceError('Demo URL must be a public link (localhost/127.0.0.1 not allowed).');
                        return;
                      }
                      updateProject(resourceModalProject.id, { demoUrl: val });
                      setResourceModalProject({ ...resourceModalProject, demoUrl: val });
                      setResourceError(null);
                      setResourceSuccess('Successfully updated Live Demo URL!');
                    }}
                    className="px-3 py-1.5 bg-[#6A2FC8] hover:bg-[#5824A8] text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    Save URL
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-[#1A2846] flex justify-end">
              <button
                type="button"
                onClick={() => setResourceModalProject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#080E20] dark:hover:bg-[#101C38] text-slate-700 dark:text-[#CBD5E1] rounded-xl text-xs font-semibold transition-colors border border-slate-200 dark:border-[#1A2846]"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
