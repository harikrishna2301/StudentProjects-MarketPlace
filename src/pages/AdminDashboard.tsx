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
} from 'lucide-react';

interface AdminDashboardProps {
  initialTab?: 'overview' | 'projects' | 'add' | 'categories' | 'orders' | 'users';
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
    category: 'Java & Spring Boot',
    primaryLanguage: 'Java',
    techStack: 'Spring Boot 3, MySQL 8, Hibernate, REST API',
    price: 1999,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 1,
    academicYear: '2025–2026',
    shortDescription: '',
    overview: '',
    problemStatement: '',
    objectives: 'Implement core modules\nEnsure test coverage\nPrepare IEEE report',
    modules: 'Auth Module, Main Service, Database Connector',
    hardwareReq: 'Intel Core i5, 8 GB RAM, 2 GB SSD',
    softwareReq: 'JDK 17, MySQL 8, Maven',
    commandSetup: 'mvn clean install && mvn spring-boot:run',
  });

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
      fullName: 'Rahul Varma',
      email: 'rahul.student@projectkit.edu',
      phoneNumber: '+91 98451 22890',
      collegeName: 'Vellore Institute of Technology (VIT)',
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

    const techArray = newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean);
    const objArray = newProject.objectives.split('\n').filter(Boolean);
    const modArray = newProject.modules.split(',').map((s) => s.trim()).filter(Boolean);

    addProject({
      title: newProject.title,
      slug: newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProject.category,
      primaryLanguage: newProject.primaryLanguage,
      techStack: techArray.length ? techArray : ['Java', 'MySQL'],
      price: Number(newProject.price),
      originalPrice: Number(newProject.originalPrice),
      rating: 5.0,
      reviewsCount: 1,
      academicYear: newProject.academicYear,
      shortDescription: newProject.shortDescription,
      overview: newProject.overview || newProject.shortDescription,
      problemStatement: newProject.problemStatement || 'Automate manual processes in engineering domains.',
      objectives: objArray.length ? objArray : ['Build scalable solution', 'Produce documentation'],
      features: [
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
      featured: false,
      colorTheme: '#2563EB',
    });

    setFormSuccess('Project kit published successfully!');
    setFormError('');
    setTimeout(() => {
      setFormSuccess('');
      navigate('/admin/projects');
      showToast(`Published "${newProject.title}" to catalog`);
    }, 1200);
  };

  // Handle Edit Project Save
  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    updateProject(editingProject.id, {
      title: editingProject.title,
      category: editingProject.category,
      price: Number(editingProject.price),
      originalPrice: Number(editingProject.originalPrice),
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
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Marketplace Administration Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Welcome, Dr. Anita Sharma
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Curriculum supervisor & project kit catalog manager
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/add-project')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Kit</span>
          </button>
        </div>
      </div>

      {/* Global Success Notification Toast */}
      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl max-w-full overflow-x-auto">
        <button
          onClick={() => navigate('/admin')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => navigate('/admin/projects')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'projects'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Manage Projects ({projects.length})
        </button>
        <button
          onClick={() => navigate('/admin/add-project')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'add'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          + Add Project
        </button>
        <button
          onClick={() => navigate('/admin/categories')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'categories'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => navigate('/admin/orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Orders ({myOrders.length})
        </button>
        <button
          onClick={() => navigate('/admin/users')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'users'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Students ({studentsList.length})
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
                      <td className="py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
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
                    <th className="py-3 px-4 font-semibold">Language</th>
                    <th className="py-3 px-4 font-semibold text-right">Price</th>
                    <th className="py-3 px-4 font-semibold text-center">Downloads</th>
                    <th className="py-3 px-4 font-semibold text-center">Rating</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white max-w-sm truncate">
                            {project.title}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">ID: {project.id}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{project.category}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                          {project.primaryLanguage}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                          ₹{project.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {project.downloadsCount}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-amber-600 dark:text-amber-400 font-semibold">
                          ★ {project.rating}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
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
              Provide project title, technical stack, problem statement, and setup commands.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. AI-Powered Healthcare Diagnostic System"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category / Domain *
                </label>
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
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
                  Primary Language *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.primaryLanguage}
                  onChange={(e) => setNewProject({ ...newProject, primaryLanguage: e.target.value })}
                  placeholder="Java, Python, JavaScript, Solidity"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={newProject.price}
                  onChange={(e) => setNewProject({ ...newProject, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Original Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={newProject.originalPrice}
                  onChange={(e) =>
                    setNewProject({ ...newProject, originalPrice: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                  placeholder="Spring Boot 3, React 18, MySQL 8, JWT, Tailwind"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newProject.shortDescription}
                  onChange={(e) => setNewProject({ ...newProject, shortDescription: e.target.value })}
                  placeholder="2-line summary explaining the core value of this academic capstone."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Setup / Installation Terminal Command
                </label>
                <input
                  type="text"
                  value={newProject.commandSetup}
                  onChange={(e) => setNewProject({ ...newProject, commandSetup: e.target.value })}
                  placeholder="mvn clean install && mvn spring-boot:run"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-900 dark:bg-slate-950 text-blue-400 border border-slate-800 dark:border-slate-800 rounded-xl"
                />
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
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish Project Kit</span>
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

      {/* --- MODAL 1: EDIT PROJECT FORM MODAL --- */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditingProject(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 text-slate-900 dark:text-slate-100 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Project Kit</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">ID: {editingProject.id}</p>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name} className="dark:bg-slate-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Language</label>
                  <input
                    type="text"
                    required
                    value={editingProject.primaryLanguage}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, primaryLanguage: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProject.price}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProject.originalPrice}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.shortDescription}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
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
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-slate-900 dark:text-slate-100 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Project Deletion</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">"{deletingProject.title}"</span>?
                This action will remove the project from the student marketplace catalog.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingProject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                No, Keep Project
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
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
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-5 text-slate-900 dark:text-slate-100 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                  ProjectKit Tax Invoice
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{viewingOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Date of Purchase</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{viewingOrder.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Payment Method</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{viewingOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Invoice Reference</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{viewingOrder.invoiceId}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Fulfillment Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{viewingOrder.status}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-1">
                <div className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold">
                  Purchased Item
                </div>
                <div className="font-bold text-slate-900 dark:text-white">{viewingOrder.projectTitle}</div>
                <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  Category: {viewingOrder.category}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800">
                <span>Amount Paid</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-base">
                  ₹{viewingOrder.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
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
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-slate-900 dark:text-slate-100 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Academic Category</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
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
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCategoryData.name}
                  onChange={(e) =>
                    setNewCategoryData({ ...newCategoryData, name: e.target.value })
                  }
                  placeholder="e.g. Cloud Computing & DevOps"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newCategoryData.description}
                  onChange={(e) =>
                    setNewCategoryData({ ...newCategoryData, description: e.target.value })
                  }
                  placeholder="Short syllabus coverage..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-colors"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
