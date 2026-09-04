type RoadmapGenerationPrompt = {
  title: string;
  description: string;
  skillLevel: string;
  timeCommitment: string;
  targetRole?: string;
  preferredLearningStyle?: string;
  focusAreas: string[];
  deadline?: string;
};

/** Builds the same curriculum-only contract used by the roadmap edge function. */
export const generateAIPrompt = (params: RoadmapGenerationPrompt): string => {
  const focus = params.focusAreas.length > 0 ? params.focusAreas.join(", ") : params.title;
  return [
    `Create a month-by-month learning roadmap for "${params.title}".`,
    `Objective: ${params.description || `Learn ${params.title}`}.`,
    `Skill level: ${params.skillLevel}. Weekly time: ${params.timeCommitment}.`,
    `Learning style: ${params.preferredLearningStyle || "mixed"}.`,
    `Focus areas: ${focus}.`,
    params.targetRole ? `Target role: ${params.targetRole}.` : "",
    params.deadline ? `Target completion date: ${params.deadline}.` : "",
    "Return curriculum guidance only. Do not recommend or include resources, URLs, providers, books, courses, videos, or whereToLearn entries.",
  ].filter(Boolean).join("\n");
};

function extract(prompt: string, label: string, fallback: string): string {
  const match = prompt.match(new RegExp(`${label}: (.*?)(?:\\n|$)`));
  return match?.[1]?.replace(/\.$/, "") || fallback;
}

/** Offline preview fallback: mirrors the month-based shape without resource suggestions. */
export const generateMockRoadmap = (prompt: string) => {
  const title = prompt.match(/roadmap for "(.*?)"/i)?.[1] || "Personalized Learning Roadmap";
  const skillLevel = extract(prompt, "Skill level", "beginner");
  const time = extract(prompt, "Weekly time", "5-10 hours");
  const focus = extract(prompt, "Focus areas", title).split(", ").filter(Boolean);
  const months = time.includes("2-5") ? 4 : time.includes("15+") ? 3 : 4;
  const subject = focus[0] || title;

  const steps = Array.from({ length: months }, (_, index) => {
    const month = index + 1;
    const theme = month === 1 ? `Foundations of ${subject}`
      : month === months ? `${subject} capstone and mastery` : `Applied ${subject} practice`;
    return {
      month,
      title: `Month ${month}: ${theme}`,
      description: `Build the ${theme.toLowerCase()} needed to progress from ${skillLevel} level toward ${title}.`,
      duration: "1 month",
      estimatedHours: time.includes("2-5") ? 15 : 30,
      whatToLearn: [`Core ${subject} concepts`, "Key terminology and patterns", "A focused practical technique"],
      howToLearn: ["Study one concept at a time, retrieve it from memory, then apply it in a small exercise.", "Review mistakes weekly and increase task difficulty after each successful checkpoint."],
      whyToLearn: `These skills create the foundation for the next stage of ${title}.`,
      whereToLearn: [],
      topics: [`Core ${subject} concepts`, "Practical application", "Review and reflection"],
      learningObjectives: [`Explain the main ${subject} concepts in your own words`, `Complete a practical ${subject} deliverable`],
      prerequisites: month === 1 ? [] : [`Month ${month - 1} concepts`],
      milestones: [
        { title: "Week 1: Understand the model", description: "Summarize the key ideas and pass a self-test.", estimatedHours: 6 },
        { title: "Week 2: Guided practice", description: "Complete a worked example without copying the solution.", estimatedHours: 8 },
        { title: "Week 4: Monthly deliverable", description: "Produce a small artifact and explain the decisions behind it.", estimatedHours: 10 },
      ],
      tasks: [{ title: "Monthly practice project", description: `Create a focused ${subject} artifact with measurable acceptance criteria.`, difficulty: skillLevel }],
      commonPitfalls: ["Consuming content without retrieval practice: close the material and recall the idea.", "Increasing scope too early: keep the monthly deliverable narrow and testable."],
      assessmentCriteria: ["Can explain the concept without notes", "Can complete the monthly deliverable independently"],
      realWorldExamples: [`Apply ${subject} to a realistic problem related to ${title}.`],
    };
  });

  return { title, description: extract(prompt, "Objective", `Learn ${title}`), estimatedDuration: `${months} months`, steps };
};

export const callAIGenerator = async (prompt: string): Promise<any> => generateMockRoadmap(prompt);