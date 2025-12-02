export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  contactInfo: string;
  website?: string;
  availability: string;
  tags: string[];
}

export const RESOURCE_CATEGORIES = [
  "Crisis Support",
  "Mental Health",
  "Peer Support",
  "Self-Esteem",
  "Community",
] as const;

export const RESOURCES: Resource[] = [
  // Crisis Support
  {
    id: "lifeline",
    title: "Lifeline",
    description: "24/7 crisis support and suicide prevention services. Talk to a trained counsellor anytime you need support.",
    category: "Crisis Support",
    contactInfo: "13 11 14",
    website: "https://www.lifeline.org.au",
    availability: "24/7",
    tags: ["Crisis Support", "Mental Health"],
  },
  {
    id: "beyond-blue",
    title: "Beyond Blue",
    description: "Support for anxiety, depression and suicide prevention. Access mental health information and support services.",
    category: "Crisis Support",
    contactInfo: "1300 22 4636",
    website: "https://www.beyondblue.org.au",
    availability: "24/7",
    tags: ["Crisis Support", "Mental Health"],
  },
  {
    id: "mensline",
    title: "MensLine Australia",
    description: "Professional telephone and online support, information and referral service for men with family and relationship concerns.",
    category: "Mental Health",
    contactInfo: "1300 78 99 78",
    website: "https://mensline.org.au",
    availability: "24/7",
    tags: ["Mental Health", "Community"],
  },

  // Youth Mental Health
  {
    id: "headspace",
    title: "Headspace",
    description: "Mental health support for young people aged 12-25. Access counselling, support groups and online resources.",
    category: "Mental Health",
    contactInfo: "1800 650 890",
    website: "https://headspace.org.au",
    availability: "9am-1am AEST, 7 days",
    tags: ["Mental Health", "Community"],
  },
  {
    id: "reachout",
    title: "ReachOut",
    description: "Online mental health resources for young people. Access articles, forums, and practical tools for wellbeing.",
    category: "Mental Health",
    contactInfo: "Online only",
    website: "https://au.reachout.com",
    availability: "24/7 online",
    tags: ["Mental Health", "Self-Esteem"],
  },

  // Peer Support Forums
  {
    id: "incelexit",
    title: "r/IncelExit",
    description: "Supportive community for people seeking to leave incel ideology. Focus on personal growth and healthy relationships.",
    category: "Peer Support",
    contactInfo: "reddit.com/r/IncelExit",
    website: "https://reddit.com/r/IncelExit",
    availability: "24/7 online",
    tags: ["Peer Support", "Self-Esteem", "Community"],
  },
  {
    id: "menslib",
    title: "r/MensLib",
    description: "Community examining men's issues through an intersectional lens. Discussing masculinity, mental health, and relationships.",
    category: "Peer Support",
    contactInfo: "reddit.com/r/MensLib",
    website: "https://reddit.com/r/MensLib",
    availability: "24/7 online",
    tags: ["Peer Support", "Community"],
  },

  // Self-Esteem Resources
  {
    id: "this-way-up",
    title: "This Way Up",
    description: "Online mental health courses developed by clinical psychologists. CBT-based programs for anxiety, depression and more.",
    category: "Self-Esteem",
    contactInfo: "Online courses",
    website: "https://thiswayup.org.au",
    availability: "24/7 online",
    tags: ["Self-Esteem", "Mental Health"],
  },
  {
    id: "mindhealthconnect",
    title: "Head to Health",
    description: "Australian Government mental health gateway. Find trusted apps, programs, online forums and phone services.",
    category: "Mental Health",
    contactInfo: "Online directory",
    website: "https://headtohealth.gov.au",
    availability: "24/7 online",
    tags: ["Mental Health", "Self-Esteem"],
  },

  // Community Support
  {
    id: "mens-sheds",
    title: "Australian Men's Shed Association",
    description: "Community spaces where men connect, converse and create. Find a local shed to join and build friendships.",
    category: "Community",
    contactInfo: "Find a local shed",
    website: "https://mensshed.org",
    availability: "Varies by location",
    tags: ["Community"],
  },
  {
    id: "qlife",
    title: "QLife",
    description: "Anonymous and free LGBTI peer support and referral for people wanting to talk about sexuality, identity, gender, bodies, feelings or relationships.",
    category: "Peer Support",
    contactInfo: "1800 184 527",
    website: "https://qlife.org.au",
    availability: "3pm-midnight, 7 days",
    tags: ["Peer Support", "Community"],
  },
  {
    id: "sane-australia",
    title: "SANE Australia",
    description: "Support for complex mental health issues. Access forums, counselling, and information about mental health conditions.",
    category: "Mental Health",
    contactInfo: "1800 187 263",
    website: "https://www.sane.org",
    availability: "10am-10pm AEST, 7 days",
    tags: ["Mental Health", "Peer Support"],
  },
];
