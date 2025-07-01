import {
  Dashboard,
  People,
  Rule,
  Settings,
  Groups,
  EditDocument,
} from "@mui/icons-material";

export const sidebarConfig = [
  {
    label: "Dashboard",
    icon: Dashboard,
    path: "/dashboard",
    rule: "view_dashboard",
  },
  {
    label: "Generate Report",
    icon: People,
    path: "/",
    rule: "view_generate",
  },
  {
    label: "Events",
    icon: Groups,
    path: "/events",
    rule: "view_events",
  },
//   {
//     label: "Reports",
//     icon: EditDocument,
//     path: "/report",
//     rule: "report_users",
//   },
  {
    label: "Settings",
    icon: Settings,
    rule: null,
    children: [
      {
        label: "User Management",
        icon: People,
        path: "/users",
        rule: "view_users",
      },
      {
        label: "Roles",
        icon: Rule,
        path: "/settings/role",
        rule: "view_roles",
      },
      {
        label: "Permissions",
        icon: Rule,
        path: "/settings/rules",
        rule: "view_permissions",
      },
    ],
  },
];
