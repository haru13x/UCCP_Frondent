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
  QrCode,
  PeopleOutlineSharp,
  Man,
  ManageAccounts,
  ManageHistory,
  ManageAccountsOutlined,
  AccountBoxTwoTone,
  ManageAccountsRounded,
  LocationCity,
  AccountCircleOutlined,
  GroupAddTwoTone,
  GroupOffTwoTone,
  GroupRounded,
  RuleFolderRounded,
} from "@mui/icons-material";
import { List } from "@mui/material";

export const sidebarConfig = [
  {
    label: "Dashboards",
    icon: Dashboard,
    path: "/dashboard",
    rule: "view_dashboard",
  },
  {
    label: "Events",
    icon: ListAlt,
    path: "/list",
    rule: "view_event_list",
  },
  {
    label: "My Events",
    icon: EventNote,
    path: "/my-list",
    rule: "view_my_events",
  },

  {
    label: "Management",
    icon: ManageHistory,
    rule: null,
    children: [

      //  {
      //   label: "Organizer Event",
      //   icon: ManageAccountsOutlined,
      //   path: "/organizer",
      //   // rule: "view_events",
      // },
      {
        label: "Events",
        icon: Groups,
        path: "/events",
        rule: "view_events",
      },

      // {
      //   label: "Report",
      //   icon: DocumentScanner,
      //   path: "/",
      //   rule: "view_report",
      // },
      {
        label: "User's Request",
        icon: PeopleOutlineSharp,
        path: "/request-registration",
        rule: "view_user_request",
      },
      {
        label: "Users",
        icon: People,
        path: "/users",
        rule: "view_users",
      }]
  },
  {
    label: "Settings",
    icon: Settings,
    rule: null,
    children: [

      {
        label: "Roles",
        icon: RuleFolderRounded,
        path: "/settings/role",
        rule: "view_roles",
      },
      {
        label: "Account Group",
        icon: GroupRounded,
        path: "/settings/accountGroup",

      },
       {
        label: "Account Type",
        icon: ManageAccountsRounded,
        path: "/settings/accountType",

      },
      {
        label: "Church Location",
        icon: LocationCity,
        path: "/settings/rules",

      },
    ],
  },
];
