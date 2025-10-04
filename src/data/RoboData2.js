export const RoboData2 = [
  {
    type: "SRV",
    s_no: "SRV-01",
    roboid: "Robot 1",
    image: "/SurvellianceRobo1.png",
    name: "SurvellianceRobot-01",
    status: "Idle",
    battery: "72",
    location: "My Home Appartments",
    health: "50%",
    temperature: "23°c",
    alerts: [
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Battery Low",
        details:
          "Battery level critical. Robot needs immediate charging to prevent shutdown.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Temperature High",
        details:
          "System temperature exceeding safe operational limits. Risk of component damage.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Temperature Low",
        details:
          "System temperature exceeding safe operational limits. Risk of component damage.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Obstacle Detected",
        details: "Obstacle detected in path. Robot stopped to avoid collision.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Software Error",
        details:
          "Runtime exception in navigation module. Robot has entered safe mode..",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Connection Lost",
        details:
          "Communication with robot lost. Last known position may be inaccurate.",
        media: "/AlertImage1.png",
      },

      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Motor Overload",
        details:
          "Motor current draw exceeding safe limits. Possible mechanical obstruction.",
        media: "/AlertImage1.png",
      },
    ],
    avg_speed: "50",
    current_speed: "0",
    signal_strength: "Good",
    events: {
      "Person Detection": [
        { time_date: "2025-09-29T14:32:45Z", image: "/Face.png" },
        { time_date: "2025-09-29T10:16:02Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:45:11Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:30:15Z", image: "/Face2.png" },
        { time_date: "2025-09-29T14:32:45Z", image: "/Face2.png" },
        { time_date: "2025-09-29T10:16:02Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:45:11Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:30:15Z", image: "/Face2.png" },
      ],
      "Face Recognition": [
        { time_date: "2025-09-29T15:12:08Z", image: "/Face2.png" },
        { time_date: "2025-09-29T14:45:30Z", image: "/Face2.png" },
        { time_date: "2025-09-29T12:05:18Z", image: "/Face2.png" },
      ],
      "Car Detection": [
        { time_date: "2025-09-29T16:05:22Z", image: "Face2.png" },
        { time_date: "2025-09-29T13:42:18Z", image: "Face2.png" },
        { time_date: "2025-09-29T12:18:05Z", image: "Face2.png" },
      ],
      "Number Plate Recognition": [
        { time_date: "2025-09-29T16:05:23Z", image: "Face2.png" },
        { time_date: "2025-09-29T15:22:45Z", image: "Face2.png" },
      ],
    },
  },
  {
    type: "SRV",
    s_no: "SRV-02",
    roboid: "Robot 2",
    image: "/SurvellianceRobo2.png",
    name: "SurvellianceRobot-02",
    status: "Patrolling",
    battery: "50",
    location: "My Home Appartments",
    health: "97%",
    temperature: "23°c",
    alerts: [
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Battery Low",
        details:
          "Battery level critical. Robot needs immediate charging to prevent shutdown.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Temperature High",
        details:
          "System temperature exceeding safe operational limits. Risk of component damage.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Temperature Low",
        details:
          "System temperature exceeding safe operational limits. Risk of component damage.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Obstacle Detected",
        details: "Obstacle detected in path. Robot stopped to avoid collision.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Software Error",
        details:
          "Runtime exception in navigation module. Robot has entered safe mode..",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Connection Lost",
        details:
          "Communication with robot lost. Last known position may be inaccurate.",
        media: "/AlertImage1.png",
      },

      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Motor Overload",
        details:
          "Motor current draw exceeding safe limits. Possible mechanical obstruction.",
        media: "/AlertImage1.png",
      },
    ],
    avg_speed: "50",
    current_speed: "37",
    signal_strength: "Good",

    events: {
      "Person Detection": [
        { time_date: "2025-09-29T14:32:45Z", image: "/Face.png" },
        { time_date: "2025-09-29T10:16:02Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:45:11Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:30:15Z", image: "/Face2.png" },
        { time_date: "2025-09-29T14:32:45Z", image: "/Face2.png" },
        { time_date: "2025-09-29T10:16:02Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:45:11Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:30:15Z", image: "/Face2.png" },
      ],
      "Face Recognition": [
        { time_date: "2025-09-29T15:12:08Z", image: "/Face2.png" },
        { time_date: "2025-09-29T14:45:30Z", image: "/Face2.png" },
        { time_date: "2025-09-29T12:05:18Z", image: "/Face2.png" },
      ],
      "Car Detection": [
        { time_date: "2025-09-29T16:05:22Z", image: "Face2.png" },
        { time_date: "2025-09-29T13:42:18Z", image: "Face2.png" },
        { time_date: "2025-09-29T12:18:05Z", image: "Face2.png" },
      ],
      "Number Plate Recognition": [
        { time_date: "2025-09-29T16:05:23Z", image: "Face2.png" },
        { time_date: "2025-09-29T15:22:45Z", image: "Face2.png" },
      ],
    },
  },
  {
    type: "SRV",
    s_no: "SRV-03",
    roboid: "Robot 3",
    image: "/SurvellianceRobo3.png",
    name: "SurvellianceRobot-03",
    status: "Idle",
    battery: "23",
    location: "My Home Appartments",
    health: "70%",
    temperature: "23°c",
    alerts: [
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Obstacle Detected",
        details: "Obstacle detected in path. Robot stopped to avoid collision.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Software Error",
        details:
          "Runtime exception in navigation module. Robot has entered safe mode..",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Connection Lost",
        details:
          "Communication with robot lost. Last known position may be inaccurate.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Battery Low",
        details:
          "Battery level critical. Robot needs immediate charging to prevent shutdown.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Temperature High",
        details:
          "System temperature exceeding safe operational limits. Risk of component damage.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Temperature Low",
        details:
          "System temperature exceeding safe operational limits. Risk of component damage.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Motor Overload",
        details:
          "Motor current draw exceeding safe limits. Possible mechanical obstruction.",
        media: "/AlertImage1.png",
      },
    ],
    avg_speed: "50",
    current_speed: "0",
    signal_strength: "Good",
    events: {
      "Person Detection": [
        { time_date: "2025-09-29T14:32:45Z", image: "/Face.png" },
        { time_date: "2025-09-29T10:16:02Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:45:11Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:30:15Z", image: "/Face2.png" },
        { time_date: "2025-09-29T14:32:45Z", image: "/Face2.png" },
        { time_date: "2025-09-29T10:16:02Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:45:11Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:30:15Z", image: "/Face2.png" },
      ],
      "Face Recognition": [
        { time_date: "2025-09-29T15:12:08Z", image: "/Face2.png" },
        { time_date: "2025-09-29T14:45:30Z", image: "/Face2.png" },
        { time_date: "2025-09-29T12:05:18Z", image: "/Face2.png" },
      ],
      "Car Detection": [
        { time_date: "2025-09-29T16:05:22Z", image: "Face2.png" },
        { time_date: "2025-09-29T13:42:18Z", image: "Face2.png" },
        { time_date: "2025-09-29T12:18:05Z", image: "Face2.png" },
      ],
      "Number Plate Recognition": [
        { time_date: "2025-09-29T16:05:23Z", image: "Face2.png" },
        { time_date: "2025-09-29T15:22:45Z", image: "Face2.png" },
      ],
    },
  },
  {
    type: "SRV",
    s_no: "SRV-04",
    roboid: "Robot 4",
    image: "/SurvellianceRobo4.png",
    name: "SurvellianceRobot-04",
    status: "charging",
    battery: "90",
    location: "My Home Appartments",
    health: "90%",
    temperature: "20°c",
    alerts: [
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Obstacle Detected",
        details: "Obstacle detected in path. Robot stopped to avoid collision.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Software Error",
        details:
          "Runtime exception in navigation module. Robot has entered safe mode..",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Connection Lost",
        details:
          "Communication with robot lost. Last known position may be inaccurate.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Battery Low",
        details:
          "Battery level critical. Robot needs immediate charging to prevent shutdown.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Temperature High",
        details:
          "System temperature exceeding safe operational limits. Risk of component damage.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Temperature Low",
        details:
          "System temperature exceeding safe operational limits. Risk of component damage.",
        media: "/AlertImage1.png",
      },
      {
        time_date: "12-08-2023, 10:30 AM",
        robot_name: "Surveillance Robot-Live",
        alert_type: "Motor Overload",
        details:
          "Motor current draw exceeding safe limits. Possible mechanical obstruction.",
        media: "/AlertImage1.png",
      },
    ],
    avg_speed: "50",
    current_speed: "20",
    signal_strength: "Good",
    events: {
      "Person Detection": [
        { time_date: "2025-09-29T14:32:45Z", image: "/Face.png" },
        { time_date: "2025-09-29T10:16:02Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:45:11Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:30:15Z", image: "/Face2.png" },
        { time_date: "2025-09-29T14:32:45Z", image: "/Face2.png" },
        { time_date: "2025-09-29T10:16:02Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:45:11Z", image: "/Face2.png" },
        { time_date: "2025-09-29T09:30:15Z", image: "/Face2.png" },
      ],
      "Face Recognition": [
        { time_date: "2025-09-29T15:12:08Z", image: "/Face2.png" },
        { time_date: "2025-09-29T14:45:30Z", image: "/Face2.png" },
        { time_date: "2025-09-29T12:05:18Z", image: "/Face2.png" },
      ],
      "Car Detection": [
        { time_date: "2025-09-29T16:05:22Z", image: "Face2.png" },
        { time_date: "2025-09-29T13:42:18Z", image: "Face2.png" },
        { time_date: "2025-09-29T12:18:05Z", image: "Face2.png" },
      ],
      "Number Plate Recognition": [
        { time_date: "2025-09-29T16:05:23Z", image: "Face2.png" },
        { time_date: "2025-09-29T15:22:45Z", image: "Face2.png" },
      ],
    },
  },
];
