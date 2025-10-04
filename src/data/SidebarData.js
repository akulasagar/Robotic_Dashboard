import IconsData from "../components/IconsData";

export const SidebarData = {
  Profilebox: {
    user_name: "User Name",
    profile_img: "",
    link: "/profile",
  },
  Mainmenu: [
    {
      icon: IconsData["overall-dashbaord"],
      label: "Overall Dashboard",
      link: "/dashboard",
    },
    {
      icon: IconsData["robot-face"],
      label: "Robots",
      link: "/",
    },
    {
      icon: IconsData["alert-bell"],
      label: "Alerts",
      link: "/alerts",
    },
    {
      icon: IconsData.logs,
      label: "Robot Logs",
      link: "/logs",
    },
  ],
  Settings: [
    {
      icon: IconsData.info,
      label: "Help/Support",
      link: "/help_support",
    },
    {
      icon: IconsData.settings,
      label: "Settings",
      link: "/settings",
    },
  ],
};
