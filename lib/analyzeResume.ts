export function analyzeResume(content: string) {
    const text = content.toLowerCase();
  
    const skills = [
      "javascript",
      "typescript",
      "react",
      "next.js",
      "node.js",
      "express",
      "mongodb",
      "postgresql",
      "prisma",
      "tailwind",
      "html",
      "css",
      "git",
      "github",
      "api",
      "rest api",
      "authentication",
      "database",
    ];
  
    const sections = [
      "education",
      "experience",
      "projects",
      "skills",
      "certifications",
      "contact",
    ];
  
    const actionWords = [
      "built",
      "developed",
      "created",
      "designed",
      "implemented",
      "improved",
      "optimized",
      "deployed",
    ];
  
    const foundSkills = skills.filter((skill) => text.includes(skill));
    const foundSections = sections.filter((section) => text.includes(section));
    const foundActions = actionWords.filter((word) => text.includes(word));
  
    let score = 25;
  
    score += Math.min(foundSkills.length * 4, 30);
    score += Math.min(foundSections.length * 5, 25);
    score += Math.min(foundActions.length * 3, 15);
  
    if (text.includes("github")) score += 5;
    if (text.includes("linkedin")) score += 5;
    if (content.length > 1200) score += 10;
  
    if (score > 100) score = 100;
  
    return {
      atsScore: score,
  
      summary: `Your resume contains ${foundSkills.length} relevant skills and ${foundSections.length} important resume sections.`,
  
      strengths:
        foundSkills.length > 0
          ? `Strong skill match: ${foundSkills.join(", ")}.`
          : "Your resume has basic information, but skills are not clearly visible.",
  
      weaknesses:
        foundSections.length < 4
          ? "Some important sections are missing. Add Skills, Projects, Education, and Experience sections."
          : "Resume structure is good, but it can be improved with stronger achievements.",
  
      suggestions:
        foundActions.length < 3
          ? "Use more action words like built, developed, implemented, optimized, and deployed. Add numbers and project results."
          : "Add measurable achievements, live project links, GitHub links, and role-specific keywords.",
    };
  }