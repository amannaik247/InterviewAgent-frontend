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
// DESIGN NOTE: Company descriptions describe culture, values and interview style only.
// Role descriptions are company-agnostic. Any company can pair with any role (3x3 = 9 combos).

export const COMPANY_PRESETS: CompanyPreset[] = [
  {
    id: "google",
    name: "Google",
    description: [
      "Google (Alphabet) organizes the world's information and builds products used by billions of people, including Search, YouTube, Android, Chrome, Maps, Google Cloud and AI research through Google DeepMind.",
      "Culture: Data-driven, collaborative and intellectually curious. Engineers are expected to think at massive scale, favor simple and elegant solutions, and back decisions with data. Teams value psychological safety, open debate and 'Googleyness': comfort with ambiguity, humility, and doing the right thing for users.",
      "Interview style: Structured, rubric-based interviews scored on four attributes: general cognitive ability, role-related knowledge, leadership, and Googleyness. Expect multiple rounds of whiteboard-style problem solving (algorithms and data structures, with follow-ups on complexity and edge cases), system design for senior levels, and behavioral questions about collaboration and ambiguity. Feedback is reviewed by a hiring committee rather than a single interviewer.",
    ].join("\n\n"),
  },
  {
    id: "amazon",
    name: "Amazon",
    description: [
      "Amazon is one of the world's largest technology companies, spanning e-commerce, AWS cloud infrastructure, Alexa and devices, Prime Video, logistics and advertising. Its stated aim is to be Earth's most customer-centric company.",
      "Culture: Run on 14 Leadership Principles, including Customer Obsession, Ownership, Invent and Simplify, Are Right A Lot, Bias for Action, Dive Deep, Deliver Results, Frugality and Earn Trust. Decisions are made through written narratives (six-page memos instead of slides) and the 'Working Backwards' process, which starts from the customer press release. Teams are small, owned end-to-end ('two-pizza teams'), and expected to operate with high standards and a strong sense of ownership.",
      "Interview style: Heavily behavioral. Every interviewer is assigned specific Leadership Principles and expects detailed STAR-format stories with measurable results and the candidate's own contribution clearly separated from the team's. Technical roles add coding, system design and role-specific rounds. A 'Bar Raiser', an experienced interviewer from outside the hiring team, has strong influence on the final decision.",
    ].join("\n\n"),
  },
  {
    id: "meta",
    name: "Meta",
    description: [
      "Meta builds technologies that help people connect, including Facebook, Instagram, WhatsApp, Messenger and Threads, plus Reality Labs (Quest, Ray-Ban Meta smart glasses) and large-scale AI work such as the Llama models.",
      "Culture: Fast-paced, impact-oriented and engineering-driven. Core values include Move Fast, Be Bold, Focus on Long-Term Impact, Build Awesome Things, Live in the Future, and Be Direct and Respect Your Colleagues. Engineers ship frequently, own problems end-to-end, and are evaluated primarily on measurable impact. Direct, candid feedback is the norm.",
      "Interview style: Rounds are designed to be fast and rigorous. Expect two coding interviews with a strong emphasis on speed and correctness (typically two problems per 40 to 45 minutes), system design or product design for mid and senior levels, and a behavioral round focused on conflict, impact, growth and working in ambiguity. Candidates are expected to think out loud and to quantify their impact.",
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