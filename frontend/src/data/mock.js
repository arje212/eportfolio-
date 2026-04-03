// Mock data for Computer Engineering Portfolio

export const profileData = {
  name: "Your Name",
  title: "Computer Engineer",
  tagline: "Building innovative solutions through technology and engineering excellence",
  bio: "Passionate Computer Engineer with expertise in CAD design, software development, and hardware systems. Dedicated to creating efficient solutions and continuously expanding technical knowledge through certifications and hands-on projects.",
  email: "your.email@example.com",
  phone: "+1 234 567 8900",
  location: "Your Location",
  profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
  resumeUrl: "/resume.pdf"
};

export const skills = [
  {
    id: 1,
    category: "CAD & Design",
    items: ["SolidWorks", "AutoCAD", "CATIA", "Fusion 360"]
  },
  {
    id: 2,
    category: "Programming",
    items: ["Python", "C++", "Java", "MATLAB", "JavaScript"]
  },
  {
    id: 3,
    category: "Hardware & Systems",
    items: ["Microcontrollers", "Arduino", "Raspberry Pi", "PCB Design"]
  },
  {
    id: 4,
    category: "Software & Tools",
    items: ["Git", "Linux", "ANSYS", "LabVIEW", "MS Office"]
  },
  {
    id: 5,
    category: "Soft Skills",
    items: ["Problem Solving", "Team Collaboration", "Project Management", "Technical Documentation"]
  }
];

export const education = [
  {
    id: 1,
    degree: "Bachelor of Science in Computer Engineering",
    institution: "University Name",
    year: "2018 - 2022",
    description: "Focused on hardware-software integration, embedded systems, and digital design."
  },
  {
    id: 2,
    degree: "Advanced CAD Design Course",
    institution: "Technical Institute",
    year: "2022",
    description: "Specialized training in SolidWorks and advanced 3D modeling techniques."
  }
];

export const certificates = [
  {
    id: 1,
    title: "SolidWorks Professional Certification",
    issuer: "Dassault Systèmes",
    date: "2023",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Python Programming Certificate",
    issuer: "Coursera",
    date: "2023",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Embedded Systems Design",
    issuer: "IEEE",
    date: "2022",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
  },
  {
    id: 4,
    title: "AutoCAD Professional",
    issuer: "Autodesk",
    date: "2022",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=400&fit=crop"
  },
  {
    id: 5,
    title: "Project Management Essentials",
    issuer: "PMI",
    date: "2023",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
  },
  {
    id: 6,
    title: "C++ Advanced Programming",
    issuer: "Udemy",
    date: "2021",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop"
  }
];

export const projects = [
  {
    id: 1,
    title: "Industrial Robot Arm Design",
    category: "Mechanical Design",
    description: "Complete 3D model and assembly of a 6-axis industrial robot arm with kinematic analysis and structural simulations.",
    software: "SolidWorks, ANSYS",
    year: "2023",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
    demoLink: "",  // ← NEW FIELD
    galleryImages: [],  // ← NEW FIELD
    specs: [
      "6 degrees of freedom",
      "Payload capacity: 10kg",
      "Reach: 1200mm",
      "FEA stress analysis completed"
    ]
  },
  {
    id: 2,
    title: "Automotive Gear Assembly",
    category: "Product Design",
    description: "Detailed gear train system for automotive transmission with tolerance analysis and manufacturing drawings.",
    software: "SolidWorks, AutoCAD",
    year: "2023",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "4-speed transmission design",
      "Gear ratio optimization",
      "Complete technical drawings",
      "Material: Hardened steel"
    ]
  },
  {
    id: 3,
    title: "PCB Design for IoT Device",
    category: "Electronics",
    description: "Multi-layer PCB design for IoT sensor node with low-power optimization and wireless connectivity.",
    software: "Eagle CAD, KiCAD",
    year: "2023",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "4-layer PCB design",
      "ESP32 microcontroller",
      "Bluetooth & WiFi enabled",
      "Low power consumption < 100mA"
    ]
  },
  {
    id: 4,
    title: "Hydraulic Press System",
    category: "Mechanical Design",
    description: "Industrial hydraulic press with force analysis, safety mechanisms, and automation control system.",
    software: "SolidWorks, MATLAB",
    year: "2022",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "Force capacity: 50 tons",
      "Automated control system",
      "Safety interlock mechanisms",
      "Hydraulic circuit design"
    ]
  },
  {
    id: 5,
    title: "Drone Frame Design",
    category: "Aerospace",
    description: "Lightweight carbon fiber drone frame with aerodynamic optimization and structural integrity analysis.",
    software: "SolidWorks, CATIA",
    year: "2023",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "Weight: 450g",
      "Quadcopter configuration",
      "Carbon fiber construction",
      "Payload: 2kg"
    ]
  },
  {
    id: 6,
    title: "3D Printer Extruder Assembly",
    category: "Product Design",
    description: "Custom dual-extruder hotend assembly for high-temperature 3D printing with precise thermal management.",
    software: "SolidWorks, Fusion 360",
    year: "2022",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "Dual extrusion capability",
      "Max temp: 300°C",
      "All-metal hotend",
      "0.1mm layer precision"
    ]
  },
  {
    id: 7,
    title: "Conveyor Belt System",
    category: "Industrial Design",
    description: "Automated conveyor belt system with motor selection, drive mechanism, and control interface.",
    software: "SolidWorks, LabVIEW",
    year: "2023",
    image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "Length: 10 meters",
      "Speed: 0.5 m/s",
      "Load capacity: 500kg",
      "Automated control system"
    ]
  },
  {
    id: 8,
    title: "Electric Motor Housing",
    category: "Mechanical Design",
    description: "Precision motor housing with thermal dissipation analysis, mounting features, and weatherproof sealing.",
    software: "SolidWorks, ANSYS",
    year: "2022",
    image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "Aluminum alloy construction",
      "IP65 protection rating",
      "Thermal analysis completed",
      "Vibration dampening"
    ]
  },
  {
    id: 9,
    title: "Robotic Gripper Mechanism",
    category: "Robotics",
    description: "Adaptive robotic gripper with force sensing, multiple grip modes, and servo control integration.",
    software: "SolidWorks, Arduino IDE",
    year: "2023",
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "Grip force: 0-50N",
      "Opening: 0-120mm",
      "Force feedback sensors",
      "3 grip modes"
    ]
  },
  {
    id: 10,
    title: "HVAC Duct Design",
    category: "MEP Engineering",
    description: "Complete HVAC ductwork design for commercial building with airflow simulation and optimization.",
    software: "SolidWorks, AutoCAD MEP",
    year: "2022",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "Building area: 5000 sq ft",
      "CFD analysis completed",
      "Energy efficiency optimized",
      "Noise reduction design"
    ]
  },
  {
    id: 11,
    title: "Automotive Suspension Component",
    category: "Automotive",
    description: "Front suspension control arm with FEA, fatigue analysis, and manufacturing process planning.",
    software: "SolidWorks, CATIA",
    year: "2023",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "Forged aluminum construction",
      "Load capacity: 2000kg",
      "Fatigue life: 1M cycles",
      "Weight optimized"
    ]
  },
  {
    id: 12,
    title: "Smart Home Automation Hub",
    category: "Electronics",
    description: "Central control unit for smart home with wireless connectivity, sensor integration, and mobile app interface.",
    software: "Eagle CAD, Arduino IDE",
    year: "2023",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop",
    demoLink: "",
    galleryImages: [],
    specs: [
      "ESP32 based controller",
      "20+ device support",
      "WiFi & Zigbee protocol",
      "Mobile app integration"
    ]
  }
];