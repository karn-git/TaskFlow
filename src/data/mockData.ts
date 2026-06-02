import { User, Project, Task, Comment, StatusColumn, PriorityOption } from '../types';

export const INITIAL_CURRENT_USER: User = {
  id: "user_001",
  name: "Maya Chen",
  role: "Project Manager",
  email: "maya@example.com",
  avatarUrl: "MC"
};

export const INITIAL_TEAM_MEMBERS: User[] = [
  {
    id: "user_001",
    name: "Maya Chen",
    role: "Project Manager",
    email: "maya@example.com",
    avatarUrl: "MC"
  },
  {
    id: "user_002",
    name: "Leo Martinez",
    role: "Frontend Developer",
    email: "leo@example.com",
    avatarUrl: "LM"
  },
  {
    id: "user_003",
    name: "Aisha Khan",
    role: "UX Designer",
    email: "aisha@example.com",
    avatarUrl: "AK"
  },
  {
    id: "user_004",
    name: "Noah Smith",
    role: "QA Specialist",
    email: "noah@example.com",
    avatarUrl: "NS"
  },
  {
    id: "user_005",
    name: "Sofia Lee",
    role: "Product Analyst",
    email: "sofia@example.com",
    avatarUrl: "SL"
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "project_001",
    name: "Website Redesign",
    description: "Refresh the company website with improved navigation, visual design, and responsive layouts.",
    status: "active",
    progress: 62,
    memberIds: ["user_001", "user_002", "user_003"],
    createdAt: "2026-05-01",
    updatedAt: "2026-06-01"
  },
  {
    id: "project_002",
    name: "Mobile App Launch",
    description: "Prepare the mobile app interface, onboarding flow, QA review, and launch checklist.",
    status: "active",
    progress: 38,
    memberIds: ["user_001", "user_003", "user_004", "user_005"],
    createdAt: "2026-05-10",
    updatedAt: "2026-05-31"
  },
  {
    id: "project_003",
    name: "Customer Feedback Portal",
    description: "Prototype a frontend portal for collecting, categorizing, and reviewing customer feedback.",
    status: "planning",
    progress: 15,
    memberIds: ["user_001", "user_002", "user_005"],
    createdAt: "2026-05-20",
    updatedAt: "2026-06-02"
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "task_001",
    projectId: "project_001",
    title: "Create homepage wireframe",
    description: "Design low-fidelity wireframes for the redesigned homepage.",
    status: "done",
    priority: "high",
    assigneeId: "user_003",
    dueDate: "2026-05-28",
    tags: ["design", "wireframe"],
    checklist: [
      {
        id: "check_001",
        label: "Define content hierarchy",
        completed: true
      },
      {
        id: "check_002",
        label: "Create desktop layout",
        completed: true
      },
      {
        id: "check_003",
        label: "Create mobile layout",
        completed: true
      }
    ],
    commentIds: ["comment_001", "comment_002"],
    createdAt: "2026-05-15",
    updatedAt: "2026-05-27"
  },
  {
    id: "task_002",
    projectId: "project_001",
    title: "Build responsive navigation bar",
    description: "Implement a responsive top navigation component with desktop and mobile states.",
    status: "in_progress",
    priority: "medium",
    assigneeId: "user_002",
    dueDate: "2026-06-05",
    tags: ["frontend", "responsive"],
    checklist: [
      {
        id: "check_004",
        label: "Desktop navigation",
        completed: true
      },
      {
        id: "check_005",
        label: "Mobile drawer",
        completed: false
      },
      {
        id: "check_006",
        label: "Keyboard accessibility",
        completed: false
      }
    ],
    commentIds: ["comment_003"],
    createdAt: "2026-05-22",
    updatedAt: "2026-06-01"
  },
  {
    id: "task_003",
    projectId: "project_001",
    title: "Review visual design system",
    description: "Review color, typography, spacing, and component consistency for the redesign.",
    status: "review",
    priority: "high",
    assigneeId: "user_001",
    dueDate: "2026-06-04",
    tags: ["design-system", "review"],
    checklist: [
      {
        id: "check_007",
        label: "Review typography",
        completed: true
      },
      {
        id: "check_008",
        label: "Review colors",
        completed: false
      }
    ],
    commentIds: [],
    createdAt: "2026-05-25",
    updatedAt: "2026-06-01"
  },
  {
    id: "task_004",
    projectId: "project_002",
    title: "Design onboarding screens",
    description: "Create onboarding screen mockups for first-time mobile app users.",
    status: "to_do",
    priority: "medium",
    assigneeId: "user_003",
    dueDate: "2026-06-10",
    tags: ["mobile", "ux"],
    checklist: [
      {
        id: "check_009",
        label: "Welcome screen",
        completed: false
      },
      {
        id: "check_010",
        label: "Feature introduction screen",
        completed: false
      },
      {
        id: "check_011",
        label: "Completion screen",
        completed: false
      }
    ],
    commentIds: ["comment_004"],
    createdAt: "2026-05-26",
    updatedAt: "2026-05-30"
  },
  {
    id: "task_005",
    projectId: "project_002",
    title: "Prepare QA checklist",
    description: "Create a frontend QA checklist for mobile layouts, forms, and navigation flows.",
    status: "backlog",
    priority: "low",
    assigneeId: "user_004",
    dueDate: "2026-06-14",
    tags: ["qa", "checklist"],
    checklist: [],
    commentIds: [],
    createdAt: "2026-05-27",
    updatedAt: "2026-05-27"
  },
  {
    id: "task_006",
    projectId: "project_003",
    title: "Define feedback categories",
    description: "Create placeholder categories for feedback classification in the prototype.",
    status: "in_progress",
    priority: "medium",
    assigneeId: "user_005",
    dueDate: "2026-06-07",
    tags: ["research", "feedback"],
    checklist: [
      {
        id: "check_012",
        label: "Collect sample feedback types",
        completed: true
      },
      {
        id: "check_013",
        label: "Group into categories",
        completed: false
      }
    ],
    commentIds: ["comment_005"],
    createdAt: "2026-05-28",
    updatedAt: "2026-06-02"
  },
  {
    id: "task_007",
    projectId: "project_003",
    title: "Prototype feedback card UI",
    description: "Design reusable feedback card components for the customer feedback portal.",
    status: "to_do",
    priority: "high",
    assigneeId: "user_002",
    dueDate: "2026-06-06",
    tags: ["frontend", "prototype"],
    checklist: [],
    commentIds: [],
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01"
  },
  {
    id: "task_008",
    projectId: "project_002",
    title: "Review mobile launch content",
    description: "Review placeholder copy for launch screens and empty states.",
    status: "done",
    priority: "low",
    assigneeId: "user_005",
    dueDate: "2026-05-30",
    tags: ["content", "mobile"],
    checklist: [
      {
        id: "check_014",
        label: "Review onboarding copy",
        completed: true
      },
      {
        id: "check_015",
        label: "Review empty states",
        completed: true
      }
    ],
    commentIds: [],
    createdAt: "2026-05-23",
    updatedAt: "2026-05-30"
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "comment_001",
    taskId: "task_001",
    authorId: "user_001",
    message: "The homepage structure looks clear. Please add one more section for customer testimonials.",
    createdAt: "2026-05-24T10:15:00"
  },
  {
    id: "comment_002",
    taskId: "task_001",
    authorId: "user_003",
    message: "Added the testimonial section to the final wireframe.",
    createdAt: "2026-05-26T14:40:00"
  },
  {
    id: "comment_003",
    taskId: "task_002",
    authorId: "user_002",
    message: "Desktop navigation is complete. Working on the mobile drawer next.",
    createdAt: "2026-06-01T09:30:00"
  },
  {
    id: "comment_004",
    taskId: "task_004",
    authorId: "user_003",
    message: "I will prepare three onboarding variations for review.",
    createdAt: "2026-05-30T16:05:00"
  },
  {
    id: "comment_005",
    taskId: "task_006",
    authorId: "user_005",
    message: "Initial categories include bug report, feature request, usability issue, and general feedback.",
    createdAt: "2026-06-02T11:20:00"
  }
];

export const STATUS_COLUMNS: StatusColumn[] = [
  { id: "backlog", label: "Backlog" },
  { id: "to_do", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" }
];

export const PRIORITIES: PriorityOption[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" }
];
