export type CompanyPreset = {
  id: string;
  name: string;
  description: string;
};

export type RolePreset = {
  id: string;
  title: string;
  description: string;
};

// HOW TO ADD A PRESET:
// Copy one object in the array, give it a unique id, then edit the name/title and description.
// The dropdowns update automatically. Do not add a "Custom" entry here.
//
// DESIGN NOTE: Company descriptions should contain only basic, factual company information
// that is appropriate for a job applicant, such as what the company does, its major products
// or services, and the areas of technology/business it operates in.
// Do not include company culture, values, interview style, hiring process, or interview tips.
//
// Role descriptions are company-agnostic. Any company can pair with any role (3x3 = 9 combos).

export const COMPANY_PRESETS: CompanyPreset[] = [
  {
    id: "google",
    name: "Google",
    description: [
      "Google is a technology company and part of Alphabet. It develops products and services that help people find information, communicate, work, and access digital content.",
      "Its major products and services include Google Search, YouTube, Android, Chrome, Google Maps, Google Workspace, Google Cloud, and Google Play.",
      "Google also works across areas including artificial intelligence, machine learning, cloud computing, advertising, hardware, cybersecurity, and other technology research and development.",
    ].join("\n\n"),
  },
  {
    id: "amazon",
    name: "Amazon",
    description: [
      "Amazon is a global technology and commerce company that provides products and services to consumers, businesses, sellers, and developers.",
      "Its businesses include Amazon's online stores and marketplace, Amazon Web Services (AWS), Prime, advertising, logistics and fulfillment, digital content, devices, and entertainment services.",
      "Amazon Web Services provides cloud computing, storage, databases, machine learning, analytics, security, and other infrastructure and technology services to organizations around the world.",
    ].join("\n\n"),
  },
  {
    id: "meta",
    name: "Meta",
    description: [
      "Meta is a technology company that develops products and services for connecting people and communities through digital platforms.",
      "Its family of products includes Facebook, Instagram, WhatsApp, Messenger, and Threads, which provide services for communication, social networking, content sharing, and messaging.",
      "Meta also develops technologies in areas such as artificial intelligence, virtual and augmented reality through Reality Labs, wearable devices, and large-scale computing infrastructure.",
    ].join("\n\n"),
  },
];

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    description: [
      "Design, build, test and maintain scalable, reliable software systems that serve millions of users.",
      "Responsibilities:",
      "- Write clean, well-tested, maintainable code in languages such as Python, Java, C++, Go or TypeScript.",
      "- Participate in system design and architecture discussions, and weigh tradeoffs in scalability, latency, reliability and cost.",
      "- Own features end to end, from design doc to launch, monitoring and on-call support.",
      "- Review code, mentor teammates and collaborate with product managers, designers and other engineers.",
      "- Debug and resolve production issues, and improve performance and operational excellence.",
      "",
      "Qualifications:",
      "- BS/MS in Computer Science or equivalent practical experience.",
      "- Strong foundation in data structures, algorithms, operating systems and distributed systems.",
      "- Experience building and shipping production services or applications.",
      "- Familiarity with databases, APIs, cloud infrastructure, CI/CD and testing practices.",
      "- Clear communication and the ability to work independently in ambiguous situations.",
    ].join("\n"),
  },
  {
    id: "product-manager",
    title: "Product Manager",
    description: [
      "Define the vision, strategy and roadmap for a product or feature area, and lead cross-functional teams to deliver it.",
      "Responsibilities:",
      "- Identify customer problems and market opportunities through user research, data analysis and competitive insights.",
      "- Write clear product requirements and prioritize the roadmap against business goals and engineering constraints.",
      "- Partner closely with engineering, design, data science, marketing and legal to ship products on time.",
      "- Define success metrics, run experiments (A/B tests) and use data to make and defend decisions.",
      "- Communicate strategy, progress and tradeoffs to stakeholders and executives.",
      "",
      "Qualifications:",
      "- Several years of experience in product management or a related field, with a record of shipping successful products.",
      "- Strong analytical skills and comfort with metrics, SQL or dashboards.",
      "- Technical fluency to engage credibly with engineers on architecture and tradeoffs.",
      "- Excellent written and verbal communication, and the ability to influence without authority.",
      "- Sound product sense and strong customer empathy.",
    ].join("\n"),
  },
  {
    id: "data-scientist",
    title: "Data Scientist / Machine Learning Engineer",
    description: [
      "Use statistics, experimentation and machine learning to turn large-scale data into product decisions and intelligent features.",
      "Responsibilities:",
      "- Define metrics, design and analyze experiments, and quantify the impact of product changes.",
      "- Build, train, evaluate and deploy machine learning models (for example ranking, recommendation, forecasting or classification) to production.",
      "- Develop data pipelines and features, and work with large datasets using SQL, Python and distributed tools such as Spark.",
      "- Translate ambiguous business questions into analytical plans, and present findings and recommendations to non-technical stakeholders.",
      "- Monitor model performance, detect drift and iterate on quality, fairness and efficiency.",
      "",
      "Qualifications:",
      "- MS/PhD in Computer Science, Statistics, Mathematics or a related field, or equivalent industry experience.",
      "- Strong grounding in probability, statistics, causal inference and experimental design.",
      "- Hands-on experience with ML frameworks such as PyTorch, TensorFlow or scikit-learn, and with productionizing models.",
      "- Proficiency in Python and SQL, with experience in data modeling and large-scale data processing.",
      "- Ability to communicate complex technical results clearly and tie them to business impact.",
    ].join("\n"),
  },
];
