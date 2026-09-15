import { ChevronDown } from "lucide-react";

const RESOURCES = [
  {
    title: "Run a problem-observation activity",
    summary: "A 30-minute walk that turns noticing into a written list of real problems.",
    steps: [
      "Pick a familiar space: the school corridor, canteen, garden, or the walk to the gate.",
      "Give each student a small notebook and five minutes of silent walking — no talking, just noting anything that seems inconvenient, wasteful, or unsafe.",
      "Back in class, have each student read out one observation in a single sentence: what they saw, who it affects, and when it happens.",
      "Group similar observations on the board. The clusters that come up more than once are usually worth exploring first.",
    ],
  },
  {
    title: "Help students document an idea",
    summary: "Four short prompts that turn a rough idea into something shareable.",
    steps: [
      "Problem: what did you notice, and who does it affect? One or two sentences, no solution yet.",
      "Approach: what's your first idea for addressing it, in plain language a classmate could follow?",
      "Materials: list what it would take to build a first version, and roughly what it would cost.",
      "Open question: what's the one thing you're least sure will work? Naming it early makes testing easier later.",
    ],
  },
  {
    title: "Use a prototype reflection checklist",
    summary: "Six questions to ask after a first version exists, before calling it finished.",
    steps: [
      "What does this version actually do, compared to what you originally imagined?",
      "Who tried it, and what did you watch them do (not just what they said)?",
      "What broke, stuck, or confused someone during testing?",
      "What would you change first if you built a second version?",
      "What's still just an assumption, not something you've actually checked?",
      "What's the smallest next test that would tell you if you're on the right track?",
    ],
  },
];

/** Native <details>/<summary> keeps this keyboard-operable with no extra JS. */
export function TeacherResourcePanels() {
  return (
    <div className="flex flex-col gap-4">
      {RESOURCES.map((resource) => (
        <details
          key={resource.title}
          className="group rounded-[20px] border border-[#DED8D3] bg-white p-5 open:border-[#4282A4] sm:p-6"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block text-lg font-semibold text-[#111111]">{resource.title}</span>
              <span className="mt-1 block text-sm text-[#3D3D3D]">{resource.summary}</span>
            </span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-[#4282A4] transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <ol className="mt-4 flex flex-col gap-2.5 border-t border-[#DED8D3] pt-4">
            {resource.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[#3D3D3D]">
                <span className="font-semibold text-[#15425B]">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </details>
      ))}
    </div>
  );
}
