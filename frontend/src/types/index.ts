export type RoleType = 'TEAM_MEMBER' | 'MANAGER' | 'ADMIN';

export interface Role {
  id: number;
  name: RoleType;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  department?: string | null;
  jobTitle?: string | null;
  roleId: number;
  role: Role;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  color: string;
  isActive: boolean;
  _count?: {
    reports: number;
  };
}

export type ReportStatus = 'DRAFT' | 'SUBMITTED' | 'NEEDS_CORRECTION' | 'APPROVED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface ReportTask {
  id?: number;
  taskName: string;
  priority: TaskPriority;
  plannedPercent: number;
  actualPercent: number;
  status: TaskStatus;
  plannedHours: number;
  spentHours: number;
  deliverable?: string | null;
  orderIndex?: number;
}

export interface ReportNextTask {
  id?: number;
  title: string;
  priority: TaskPriority;
  plannedHours?: number;
  orderIndex?: number;
}

export interface ReportBlocker {
  id?: number;
  description: string;
  impact?: string | null;
  isKeyIssue: boolean;
  orderIndex?: number;
}

export interface ReportAchievement {
  id?: number;
  description: string;
  isKeyAchievement: boolean;
  orderIndex?: number;
}

export interface ReportHour {
  id?: number;
  taskType: string;
  hours: number;
}

export interface ReportLink {
  title: string;
  url: string;
}

export interface ReviewComment {
  id: number;
  reportId: number;
  reviewerId: number;
  reviewer: { id: number; name: string; avatarUrl?: string };
  versionId?: number;
  action: 'REQUEST_CHANGES' | 'APPROVED' | 'COMMENT_ONLY';
  comment: string;
  createdAt: string;
}

export interface ReportVersion {
  id: number;
  reportId: number;
  versionNumber: number;
  snapshotData: any;
  submittedById: number;
  submittedBy?: { id: number; name: string; email: string };
  submittedAt: string;
  comments?: ReviewComment[];
}

export interface Report {
  id: number;
  userId: number;
  user: User;
  projectId: number;
  project: Project;
  weekStart: string;
  weekEnd: string;
  status: ReportStatus;
  summary?: string | null;
  notes?: string | null;
  links?: ReportLink[] | null;
  latestReviewComment?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  tasks: ReportTask[];
  nextTasks: ReportNextTask[];
  blockers: ReportBlocker[];
  achievements: ReportAchievement[];
  hours: ReportHour[];
  versions?: ReportVersion[];
  reviewComments?: ReviewComment[];
  _count?: {
    tasks?: number;
    blockers?: number;
    achievements?: number;
    versions?: number;
    reviewComments?: number;
  };
}

export interface DashboardSummary {
  selectedWeek: string;
  totalTeamMembers: number;
  submittedCount: number;
  complianceRate: number;
  needsCorrectionCount: number;
  openBlockersCount: number;
}

export interface TaskTrend {
  week: string;
  weekStart: string;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

export interface MemberStatusItem {
  member: {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
    department?: string;
  };
  status: ReportStatus | 'NOT_STARTED';
  reportId: number | null;
  projectName: string;
  submittedAt: string | null;
  latestComment: string | null;
}

export interface WorkloadItem {
  name: string;
  color: string;
  taskCount: number;
  spentHours: number;
}

export interface TimeDistributionItem {
  taskType: string;
  hours: number;
}

export interface ActivityItem {
  id: number;
  action: string;
  comment: string;
  createdAt: string;
  reviewerName: string;
  memberName: string;
  reportId: number;
  projectName: string;
}
