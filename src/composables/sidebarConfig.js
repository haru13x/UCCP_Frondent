import {
  Dashboard,
  People,
  Rule,
  Settings,
  Groups,
  EditDocument,
  Report,
  DocumentScanner,
  ListAlt,
  EventNote,
} from "@mui/icons-material";
import { List } from "@mui/material";

export const sidebarConfig = [
  {
    label: "Dashboard",
    icon: Dashboard,
    path: "/dashboard",
    rule: "view_dashboard",
  },
  {
    label: "Lists",
    icon: ListAlt,
    path: "/list",
    // rule: "view_events",
  },
    {
    label: "My Events",
    icon: EventNote,
    path: "/my-list",
    // rule: "view_my_events",
  },
  {
    label: "Events",
    icon: Groups,
    path: "/events",
    rule: "view_events",
  },
  {
    label: "Report",
    icon: DocumentScanner,
    path: "/",
    rule: "view_report",
  },
  {
    label: "Users",
    icon: People,
    path: "/users",
    rule: "view_users",
  },
  {
    label: "Settings",
    icon: Settings,
    rule: null,
    children: [

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
