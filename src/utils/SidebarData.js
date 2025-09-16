import IconsData from "../components/IconsData";

export const SidebarData = {
  Profilebox: {
    user_name: "User Name",
    profile_img: "",
    link: "",
  },
  Mainmenu: [
    {
      icon: IconsData["overall-dashbaord"],
      label: "Overall Dashboard",
      link: "",
    },
    {
      icon: IconsData["robot-face"],
      label: "Robots",
      link: "",
    },
    {
      icon: IconsData["alert-bell"],
      label: "Alerts",
      link: "",
    },
    {
      icon: IconsData.logs,
      label: "Robot Logs",
      link: "",
    },
  ],
  Settings: [
    {
      icon: IconsData.info,
      label: "Help/Support",
      link: "",
    },
    {
      icon: IconsData.settings,
      label: "Settings",
      link: "",
    },
  ],
};
