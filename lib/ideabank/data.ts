import type { Problem } from "./types";

/**
 * The Problem Bank: real-flavoured example problems across sectors, meant
 * to give a student somewhere to start noticing and thinking. These are
 * demonstration prompts, not finished ideas or other students' work — no
 * solutions, stages, or costs are attached here. Once a student picks a
 * problem (or notices their own), they document and track their actual
 * idea through the Share an Idea flow / dashboard, not in this catalog.
 */
export const PROBLEMS: Problem[] = [
  {
    id: "1",
    slug: "taps-left-running-in-the-school-washroom",
    title: "Taps Left Running in the School Washroom",
    summary: "Washroom taps are routinely left running between recess periods, with no one nearby to notice.",
    category: "Water & Sanitation",
    tags: ["water", "school life", "waste"],
    problem:
      "Taps in the washroom block are routinely left running between recess periods, with no one nearby to notice until a teacher happens to pass by.",
    affectedUsers: "Students and staff who share the washroom block, and the school's water bill.",
    context: "Observed over two weeks near the primary-wing washroom, mostly between the first and second recess.",
    promptQuestions: [
      "Is it forgetfulness, a broken handle, or something about how the tap is designed?",
      "Would a fix need to change student behaviour, or just the tap itself?",
      "How would you notice a running tap without someone having to watch for it?",
    ],
    image: "water-tap",
    createdAt: "2026-06-02",
  },
  {
    id: "2",
    slug: "exposed-pipes-freezing-overnight",
    title: "Exposed Pipes Freezing Overnight",
    summary: "Exposed water pipes along a hostel wall have cracked twice in the last two winters.",
    category: "Water & Sanitation",
    tags: ["water", "winter", "maintenance"],
    problem:
      "Exposed water pipes along the hostel's outer wall have cracked twice in the last two winters after overnight temperatures dropped sharply.",
    affectedUsers: "Hostel students and the caretaker responsible for the water supply.",
    context: "Hill-region hostel where morning temperatures in January regularly fall near freezing.",
    promptQuestions: [
      "What actually causes the crack — ice forming, or pressure building up somewhere specific?",
      "Could the caretaker be warned in time to act, rather than finding out after it's cracked?",
      "Is insulation, warning, or re-routing the pipe the more realistic first experiment?",
    ],
    image: "frost-pipe",
    createdAt: "2026-05-20",
  },
  {
    id: "3",
    slug: "a-blind-bend-outside-the-school-gate",
    title: "A Blind Bend Outside the School Gate",
    summary: "A sharp road bend outside the school gate has no visibility around the corner.",
    category: "Community & Safety",
    tags: ["road safety", "community", "visibility"],
    problem:
      "The road bend just outside the school gate has no visibility around the corner, and two near-miss incidents were reported by parents this term.",
    affectedUsers: "Students walking or cycling to school, and vehicles turning onto the main road.",
    context: "Morning and afternoon school-gate traffic, observed over three days at drop-off and pick-up times.",
    promptQuestions: [
      "Whose attention actually needs to be caught — the pedestrian, the driver, or both?",
      "What's already at that corner that a fix would need to work around?",
      "Could you test whether people even slow down differently with a low-cost prototype, before asking for anything permanent?",
    ],
    image: "road-bend",
    createdAt: "2026-04-11",
  },
  {
    id: "4",
    slug: "classrooms-that-get-stuffy-by-midday",
    title: "Classrooms That Get Stuffy by Midday",
    summary: "Classrooms with windows kept shut for the fan noise feel stuffy by the third period.",
    category: "School & Learning",
    tags: ["classroom", "air quality"],
    problem:
      "By the third period, classrooms with windows kept shut for the fan noise feel noticeably stuffy, but there's no easy way to notice this early.",
    affectedUsers: "Students and teachers in enclosed classrooms during long back-to-back periods.",
    context: "Mid-morning periods in classrooms without cross-ventilation, most noticeable in the block furthest from the corridor breeze.",
    promptQuestions: [
      "Is the actual problem the air itself, or that nobody notices until it's already uncomfortable?",
      "What would a signal for 'time to open a window' need to look or sound like in a classroom?",
      "Could a very simple, no-power indicator work as well as an electronic one here?",
    ],
    image: "classroom-air",
    createdAt: "2026-06-18",
  },
  {
    id: "5",
    slug: "sorting-a-fruit-harvest-by-hand-takes-hours",
    title: "Sorting a Fruit Harvest by Hand Takes Hours",
    summary: "Sorting apples by size by hand after harvest takes a family several extra hours each day.",
    category: "Agriculture & Food",
    tags: ["agriculture", "post-harvest"],
    problem:
      "Sorting apples by size by hand after harvest takes a family several extra hours each day during peak season.",
    affectedUsers: "A family running a small orchard, sorting fruit before it goes to the local market.",
    context: "Harvest season in an apple-growing hill district.",
    promptQuestions: [
      "What's the actual bottleneck — the sorting decision, or the physical handling of each fruit?",
      "Could gravity or a simple gap do the sorting instead of a person checking each one?",
      "How would you test a rough version without risking a real harvest?",
    ],
    image: "apple-sorter",
    createdAt: "2026-05-05",
  },
  {
    id: "6",
    slug: "no-one-is-tracking-which-birds-visit-the-pond",
    title: "No One's Tracking Which Birds Visit the Pond",
    summary: "Bird activity around the school pond changes across the year, but nothing is recorded.",
    category: "Environment & Climate",
    tags: ["biodiversity", "observation"],
    problem:
      "Students had no easy way to notice how bird activity around the school pond changes across the year, so it went unrecorded.",
    affectedUsers: "The school's environment club and any student curious about the pond's ecosystem.",
    context: "The school pond area during early morning and late afternoon, when bird activity is highest.",
    promptQuestions: [
      "Who would actually keep a record going every week, and what makes that easy or hard for them?",
      "What's the simplest way to record a sighting that still gives you useful data later?",
      "Would a phone recording, a written note, or something else give the most reliable record?",
    ],
    image: "bird-station",
    createdAt: "2026-07-01",
  },
  {
    id: "7",
    slug: "event-ramps-set-up-without-checking-the-slope",
    title: "Event Ramps Set Up Without Checking the Slope",
    summary: "Temporary ramps built quickly for school events are often too steep for wheelchair access.",
    category: "Accessibility & Inclusion",
    tags: ["accessibility", "ramps"],
    problem:
      "Temporary ramps set up for school events are often too steep, but no one on the setup team has an easy way to check the slope.",
    affectedUsers: "Students and visitors using wheelchairs or crutches during school events.",
    context: "Annual day and sports day setups, where ramps are built quickly from available planks.",
    promptQuestions: [
      "What's the actual safe slope limit, and who on the setup team needs to know it?",
      "Could the check happen in seconds, using tools already lying around?",
      "How would you make the check something people actually remember to do under time pressure?",
    ],
    image: "ramp-gauge",
    createdAt: "2026-06-25",
  },
  {
    id: "8",
    slug: "lunch-tiffins-go-soggy-in-the-shared-trolley",
    title: "Lunch Tiffins Go Soggy in the Shared Trolley",
    summary: "Tiffins stacked together in the lunchroom trolley trap steam, leaving food soggy.",
    category: "School & Learning",
    tags: ["lunchroom", "food"],
    problem:
      "Tiffins stacked together in the lunchroom trolley trap steam, leaving food soggy by the time students eat.",
    affectedUsers: "Students who bring lunch from home and store it in the shared lunchroom trolley.",
    context: "The lunchroom storage trolley between morning drop-off and the lunch period.",
    promptQuestions: [
      "Is the problem the stacking, the trapped steam, or both?",
      "What would need to change about the trolley itself versus how tiffins are placed in it?",
      "How would you know if a fix actually worked, beyond someone saying food 'seems better'?",
    ],
    image: "tiffin-rack",
    createdAt: "2026-03-14",
  },
  {
    id: "9",
    slug: "the-kitchen-garden-dries-out-between-waterings",
    title: "The Kitchen Garden Dries Out Between Waterings",
    summary: "The school kitchen garden dries out quickly in summer and hand-watering is inconsistent.",
    category: "Agriculture & Food",
    tags: ["water", "gardening"],
    problem:
      "The school kitchen garden dries out quickly in summer and hand-watering with a can is inconsistent across beds.",
    affectedUsers: "The gardening club and whoever is on watering duty each week.",
    context: "The kitchen garden beds during the dry pre-monsoon months.",
    promptQuestions: [
      "Is the inconsistency about how much water each bed gets, or how often?",
      "What materials are already lying around that could carry water slowly and evenly?",
      "How would you measure whether one bed is actually getting drier than another?",
    ],
    image: "drip-line",
    createdAt: "2026-05-28",
  },
  {
    id: "10",
    slug: "corridor-noise-spills-into-classes-still-in-session",
    title: "Corridor Noise Spills Into Classes Still in Session",
    summary: "Corridor noise between periods spills into classes that are still finishing a lesson.",
    category: "School & Learning",
    tags: ["classroom", "noise"],
    problem:
      "Corridor noise between periods spills into classes that are still finishing a lesson, and there's no shared signal for when it's too loud.",
    affectedUsers: "Teachers and students in classrooms nearest the main corridor junction.",
    context: "The five-minute gaps between periods, near the corridor junction outside three classrooms.",
    promptQuestions: [
      "Is this a noise problem, or a 'nobody realises class isn't over yet' problem?",
      "What would a fair, visible threshold for 'too loud' actually look like?",
      "Would students respond better to a rule, or to something they can see changing in real time?",
    ],
    image: "noise-light",
    createdAt: "2026-07-08",
  },
  {
    id: "11",
    slug: "first-monsoon-rain-washes-roof-dust-into-the-tank",
    title: "The First Monsoon Rain Washes Roof Dust Into the Tank",
    summary: "The school's rainwater tank collects visibly dusty water at the start of each monsoon.",
    category: "Water & Sanitation",
    tags: ["water", "monsoon", "harvesting"],
    problem:
      "The school's rainwater tank collected visibly dusty water at the start of each monsoon, from roof dust washed off in the first rain.",
    affectedUsers: "Whoever uses the harvested water, and the tank cleaning schedule.",
    context: "The roof downpipe feeding the rainwater storage tank, checked at the start of the monsoon season.",
    promptQuestions: [
      "How much of the 'first flush' actually needs to be diverted before the water runs clean?",
      "Could the diverted water be put to some other use instead of wasted?",
      "How would you test this on a small scale before touching the real downpipe?",
    ],
    image: "rain-diverter",
    createdAt: "2026-02-20",
  },
  {
    id: "12",
    slug: "the-compost-corner-smells-during-humid-weeks",
    title: "The Compost Corner Smells During Humid Weeks",
    summary: "The school's compost corner develops a strong smell during humid weeks.",
    category: "Environment & Climate",
    tags: ["composting", "waste"],
    problem:
      "The compost corner near the canteen developed a strong smell during humid weeks, leading to complaints from nearby classrooms.",
    affectedUsers: "Classrooms near the compost corner and the canteen staff who manage kitchen waste.",
    context: "The compost bin area, most noticeable during humid weeks after kitchen waste additions.",
    promptQuestions: [
      "Is the smell from the waste itself, trapped gas, or how often it's turned?",
      "What's already available on-site (leaves, sawdust, mats) that could help without buying anything?",
      "How would you compare smell 'before and after' in a way that's more than just opinion?",
    ],
    image: "compost-baffle",
    createdAt: "2026-06-10",
  },
];

export function getProblemBySlug(slug: string): Problem | undefined {
  return PROBLEMS.find((problem) => problem.slug === slug);
}

export function getRelatedProblems(problem: Problem, limit = 3): Problem[] {
  return PROBLEMS.filter(
    (other) => other.id !== problem.id && other.category === problem.category
  ).slice(0, limit);
}

export const FEATURED_PROBLEM_SLUGS = [
  "taps-left-running-in-the-school-washroom",
  "exposed-pipes-freezing-overnight",
  "a-blind-bend-outside-the-school-gate",
  "classrooms-that-get-stuffy-by-midday",
  "sorting-a-fruit-harvest-by-hand-takes-hours",
  "no-one-is-tracking-which-birds-visit-the-pond",
];

export const FEATURED_STORY_SLUG = "a-blind-bend-outside-the-school-gate";
