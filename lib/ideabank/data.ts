import type { Idea } from "./types";

/**
 * Demonstration content for the Ideabank frontend. These are illustrative
 * examples, not real student submissions — no student names, schools, or
 * validated outcomes are implied. See app/share for how a real idea would
 * be documented through the guided form.
 */
export const IDEAS: Idea[] = [
  {
    id: "1",
    slug: "school-tap-water-saver",
    title: "School Tap Water Saver",
    summary: "A simple lever attachment that stops taps in the school washroom from being left running.",
    category: "Water & Sanitation",
    tags: ["water", "school life", "low-cost"],
    stage: "Prototyping",
    problem:
      "Taps in the washroom block are routinely left running between recess periods, with no one nearby to notice until a teacher happens to pass by.",
    affectedUsers: "Students and staff who share the washroom block, and the school's water bill.",
    context: "Observed over two weeks near the primary-wing washroom, mostly between the first and second recess.",
    proposedSolution:
      "A spring-loaded lever fitted over the existing tap handle that needs continuous light pressure to stay open, so it closes on its own when let go.",
    materials: [
      { name: "Tap-handle lever bracket", costRupees: 60 },
      { name: "Small tension spring", costRupees: 15 },
      { name: "Rubber grip sleeve", costRupees: 10 },
    ],
    estimatedCost: 85,
    prototypeSteps: [
      "Measured the standard tap handle across three washrooms to find a common bracket size.",
      "Built a cardboard mock-up of the lever to check the pressure needed felt natural for younger students.",
      "Swapped the mock-up for a bent-wire prototype with a scavenged spring.",
    ],
    testingNotes:
      "Ten test uses by classmates: two found the spring tension too stiff for smaller hands, which is being adjusted for the next version.",
    improvements: null,
    image: "water-tap",
    createdAt: "2026-06-02",
  },
  {
    id: "2",
    slug: "frost-alert-for-water-pipes",
    title: "Frost Alert for Water Pipes",
    summary: "A low-cost sensor that warns a hostel caretaker before exposed pipes freeze overnight.",
    category: "Water & Sanitation",
    tags: ["water", "winter", "sensors"],
    stage: "Ideating",
    problem:
      "Exposed water pipes along the hostel's outer wall have cracked twice in the last two winters after overnight temperatures dropped sharply.",
    affectedUsers: "Hostel students and the caretaker responsible for the water supply.",
    context: "Hill-region hostel where morning temperatures in January regularly fall near freezing.",
    proposedSolution:
      "A basic temperature sensor near the exposed pipe run that lights an indicator in the caretaker's room once it nears freezing, so the tap can be left dripping overnight.",
    materials: [
      { name: "Temperature sensor module", costRupees: 120 },
      { name: "Indicator LED and wiring", costRupees: 40 },
    ],
    estimatedCost: 160,
    prototypeSteps: [
      "Logged outdoor temperature by hand at 6 a.m. for a week to confirm the risk window.",
      "Sketched the circuit and identified an affordable sensor module.",
    ],
    testingNotes: null,
    improvements: null,
    image: "frost-pipe",
    createdAt: "2026-05-20",
  },
  {
    id: "3",
    slug: "safer-blind-road-bends",
    title: "Safer Blind Road Bends",
    summary: "A convex mirror and painted marker placement guide for the sharp bend outside the school gate.",
    category: "Community & Safety",
    tags: ["road safety", "community", "visibility"],
    stage: "Tested",
    problem:
      "The road bend just outside the school gate has no visibility around the corner, and two near-miss incidents were reported by parents this term.",
    affectedUsers: "Students walking or cycling to school, and vehicles turning onto the main road.",
    context: "Morning and afternoon school-gate traffic, observed over three days at drop-off and pick-up times.",
    proposedSolution:
      "A convex mirror mounted at the bend, paired with a bright painted marker on the wall so approaching cyclists know to slow down before the blind spot.",
    materials: [
      { name: "Convex traffic mirror", costRupees: 450 },
      { name: "Mounting pole and clamps", costRupees: 200 },
      { name: "Reflective paint", costRupees: 150 },
    ],
    estimatedCost: 800,
    prototypeSteps: [
      "Mapped sightlines at the bend with chalk marks from different approach angles.",
      "Tested a hand-held mirror at the proposed height to confirm the angle actually covers the blind spot.",
      "Proposed placement to the school administration with a simple diagram.",
    ],
    testingNotes:
      "After installation, five cyclists were observed slowing down noticeably earlier at the bend compared to the pre-mirror baseline count.",
    improvements:
      "Next version adds a second smaller mirror for the pedestrian side, which the first version didn't cover well.",
    image: "road-bend",
    createdAt: "2026-04-11",
  },
  {
    id: "4",
    slug: "classroom-ventilation-indicator",
    title: "Classroom Ventilation Indicator",
    summary: "A simple colour-changing card that shows when a classroom needs its windows opened.",
    category: "School & Learning",
    tags: ["classroom", "air quality", "low-cost"],
    stage: "Prototyping",
    problem:
      "By the third period, classrooms with windows kept shut for the fan noise feel noticeably stuffy, but there's no easy way to notice this early.",
    affectedUsers: "Students and teachers in enclosed classrooms during long back-to-back periods.",
    context: "Mid-morning periods in classrooms without cross-ventilation, most noticeable in the block furthest from the corridor breeze.",
    proposedSolution:
      "A humidity-sensitive card taped near the blackboard that visibly changes colour once the room's air gets stale, as a quiet reminder to open a window.",
    materials: [
      { name: "Humidity-sensitive indicator strips", costRupees: 30 },
      { name: "Laminated card backing", costRupees: 10 },
    ],
    estimatedCost: 40,
    prototypeSteps: [
      "Tried three different indicator strip types to see which changed colour reliably indoors.",
      "Placed the first card in one classroom for a week and logged colour changes against period timings.",
    ],
    testingNotes: null,
    improvements: null,
    image: "classroom-air",
    createdAt: "2026-06-18",
  },
  {
    id: "5",
    slug: "low-cost-apple-sorting-aid",
    title: "Low-Cost Apple Sorting Aid",
    summary: "A gravity-fed wooden chute that sorts apples into two size grades for a family orchard.",
    category: "Agriculture & Food",
    tags: ["agriculture", "post-harvest", "family business"],
    stage: "Prototyping",
    problem:
      "Sorting apples by size by hand after harvest takes a family several extra hours each day during peak season.",
    affectedUsers: "A family running a small orchard, sorting fruit before it goes to the local market.",
    context: "Harvest season in an apple-growing hill district, observed during a weekend visit to a relative's orchard.",
    proposedSolution:
      "A wooden chute with a narrowing gap partway down, so smaller apples fall through first and larger ones continue to a second collection tray.",
    materials: [
      { name: "Plywood sheet", costRupees: 350 },
      { name: "Wooden battens for the frame", costRupees: 150 },
      { name: "Cloth-lined collection trays", costRupees: 100 },
    ],
    estimatedCost: 600,
    prototypeSteps: [
      "Built a small cardboard version to test the gap width against a sample of apples of different sizes.",
      "Scaled the design up to plywood once the gap width sorted correctly nine times out of ten.",
    ],
    testingNotes:
      "Sorted a 40-apple sample: 36 landed in the correct size tray, three borderline apples need a slightly wider gap.",
    improvements: null,
    image: "apple-sorter",
    createdAt: "2026-05-05",
  },
  {
    id: "6",
    slug: "bird-sound-observation-station",
    title: "Bird Sound Observation Station",
    summary: "A notebook-and-recording station by the school pond to log which birds visit and when.",
    category: "Environment & Climate",
    tags: ["biodiversity", "observation", "school life"],
    stage: "Observed",
    problem:
      "Students had no easy way to notice how bird activity around the school pond changes across the year, so it went unrecorded.",
    affectedUsers: "The school's environment club and any student curious about the pond's ecosystem.",
    context: "The school pond area during early morning and late afternoon, when bird activity is highest.",
    proposedSolution:
      "A weatherproof logbook and a basic phone-recorder station where students on duty note bird calls and sightings each week.",
    materials: [
      { name: "Weatherproof logbook", costRupees: 80 },
      { name: "Laminated identification chart", costRupees: 50 },
    ],
    estimatedCost: 130,
    prototypeSteps: [],
    testingNotes: null,
    improvements: null,
    image: "bird-station",
    createdAt: "2026-07-01",
  },
  {
    id: "7",
    slug: "wheelchair-ramp-slope-gauge",
    title: "Wheelchair Ramp Slope Gauge",
    summary: "A pocket-sized gauge to quickly check whether a temporary ramp is within a safe slope.",
    category: "Accessibility & Inclusion",
    tags: ["accessibility", "ramps", "quick-check"],
    stage: "Ideating",
    problem:
      "Temporary ramps set up for school events are often too steep, but no one on the setup team has an easy way to check the slope.",
    affectedUsers: "Students and visitors using wheelchairs or crutches during school events.",
    context: "Annual day and sports day setups, where ramps are built quickly from available planks.",
    proposedSolution:
      "A small printed protractor-and-string gauge that setup volunteers can hold against the ramp to read the slope angle in seconds.",
    materials: [
      { name: "Laminated protractor card", costRupees: 25 },
      { name: "String and small weight", costRupees: 10 },
    ],
    estimatedCost: 35,
    prototypeSteps: [
      "Researched the commonly recommended maximum ramp slope for wheelchair access.",
      "Sketched a simple string-and-weight gauge design that needs no batteries.",
    ],
    testingNotes: null,
    improvements: null,
    image: "ramp-gauge",
    createdAt: "2026-06-25",
  },
  {
    id: "8",
    slug: "shared-tiffin-cooling-rack",
    title: "Shared Tiffin Cooling Rack",
    summary: "A ventilated rack that keeps lunch tiffins from going soggy in a crowded, un-refrigerated lunchroom.",
    category: "School & Learning",
    tags: ["lunchroom", "food", "low-cost"],
    stage: "Tested",
    problem:
      "Tiffins stacked together in the lunchroom trolley trap steam, leaving food soggy by the time students eat.",
    affectedUsers: "Students who bring lunch from home and store it in the shared lunchroom trolley.",
    context: "The lunchroom storage trolley between morning drop-off and the lunch period.",
    proposedSolution:
      "A slatted wooden rack insert for the existing trolley that keeps tiffins spaced apart so steam can escape instead of collecting.",
    materials: [
      { name: "Wooden slats", costRupees: 200 },
      { name: "Corner brackets", costRupees: 60 },
    ],
    estimatedCost: 260,
    prototypeSteps: [
      "Measured the trolley shelves to design a rack that fits without modification.",
      "Built a single-shelf version first to test spacing before making the full rack.",
    ],
    testingNotes:
      "Over one week, students using the rack reported food arriving noticeably less soggy than the previous stacked arrangement.",
    improvements:
      "The next version will round the slat edges after a few students mentioned catching tiffin straps on them.",
    image: "tiffin-rack",
    createdAt: "2026-03-14",
  },
  {
    id: "9",
    slug: "drip-line-from-waste-bottles",
    title: "Drip Line from Waste Bottles",
    summary: "A low-cost drip irrigation line for the school kitchen garden, built from used plastic bottles.",
    category: "Agriculture & Food",
    tags: ["water", "gardening", "reuse"],
    stage: "Prototyping",
    problem:
      "The school kitchen garden dries out quickly in summer and hand-watering with a can is inconsistent across beds.",
    affectedUsers: "The gardening club and whoever is on watering duty each week.",
    context: "The kitchen garden beds during the dry pre-monsoon months.",
    proposedSolution:
      "A gravity-fed drip line made from a row of punctured plastic bottles connected by tubing, releasing water slowly along each bed.",
    materials: [
      { name: "Used 1-litre bottles (collected)", costRupees: 0 },
      { name: "Flexible tubing", costRupees: 120 },
      { name: "Tubing connectors", costRupees: 40 },
    ],
    estimatedCost: 160,
    prototypeSteps: [
      "Tested puncture hole sizes on a single bottle to find a drip rate that didn't empty too fast.",
      "Connected three bottles along one bed as a first working section.",
    ],
    testingNotes: null,
    improvements: null,
    image: "drip-line",
    createdAt: "2026-05-28",
  },
  {
    id: "10",
    slug: "corridor-noise-traffic-light",
    title: "Corridor Noise Traffic Light",
    summary: "A red-amber-green light that gives classes a visible cue about corridor noise levels between periods.",
    category: "School & Learning",
    tags: ["classroom", "noise", "behaviour"],
    stage: "Ideating",
    problem:
      "Corridor noise between periods spills into classes that are still finishing a lesson, and there's no shared signal for when it's too loud.",
    affectedUsers: "Teachers and students in classrooms nearest the main corridor junction.",
    context: "The five-minute gaps between periods, near the corridor junction outside three classrooms.",
    proposedSolution:
      "A simple sound-level indicator mounted in the corridor that lights amber and then red as noise rises, giving students a visible, non-verbal cue.",
    materials: [
      { name: "Sound sensor module", costRupees: 150 },
      { name: "Three-colour LED indicator", costRupees: 50 },
    ],
    estimatedCost: 200,
    prototypeSteps: [
      "Recorded corridor noise levels across a week to set rough thresholds for amber and red.",
    ],
    testingNotes: null,
    improvements: null,
    image: "noise-light",
    createdAt: "2026-07-08",
  },
  {
    id: "11",
    slug: "rainwater-first-flush-diverter",
    title: "Rainwater First-Flush Diverter",
    summary: "A simple pipe fitting that discards the dirty first rainfall of the season before it reaches the storage tank.",
    category: "Water & Sanitation",
    tags: ["water", "monsoon", "harvesting"],
    stage: "Tested",
    problem:
      "The school's rainwater tank collected visibly dusty water at the start of each monsoon, from roof dust washed off in the first rain.",
    affectedUsers: "Whoever uses the harvested water, and the tank cleaning schedule.",
    context: "The roof downpipe feeding the rainwater storage tank, checked at the start of the monsoon season.",
    proposedSolution:
      "A T-shaped pipe fitting with a removable chamber that catches and holds back the first few litres of each rainfall before clean water flows to the tank.",
    materials: [
      { name: "PVC T-fitting and pipe", costRupees: 250 },
      { name: "Removable end cap", costRupees: 60 },
    ],
    estimatedCost: 310,
    prototypeSteps: [
      "Measured roof area to estimate how much first-flush volume to divert.",
      "Built a small-scale version on a test pipe before fitting it to the real downpipe.",
    ],
    testingNotes:
      "Across two rainfalls, water reaching the tank after the diverter was visibly clearer than the previous season's samples.",
    improvements: "A finer mesh at the inlet is planned after some leaf debris still got through.",
    image: "rain-diverter",
    createdAt: "2026-02-20",
  },
  {
    id: "12",
    slug: "compost-corner-odour-baffle",
    title: "Compost Corner Odour Baffle",
    summary: "A layered cover for the school's compost bin that cuts down odour without slowing decomposition.",
    category: "Environment & Climate",
    tags: ["composting", "waste", "low-cost"],
    stage: "Prototyping",
    problem:
      "The compost corner near the canteen developed a strong smell during humid weeks, leading to complaints from nearby classrooms.",
    affectedUsers: "Classrooms near the compost corner and the canteen staff who manage kitchen waste.",
    context: "The compost bin area, most noticeable during humid weeks after kitchen waste additions.",
    proposedSolution:
      "A removable layered cover of dry leaves and jute matting placed over fresh waste additions, reducing smell while still allowing airflow.",
    materials: [
      { name: "Jute matting", costRupees: 90 },
      { name: "Wooden frame for the cover", costRupees: 120 },
    ],
    estimatedCost: 210,
    prototypeSteps: [
      "Compared smell levels with and without a dry-leaf layer over three days each.",
      "Built a lightweight frame so the cover can be lifted off easily for adding waste.",
    ],
    testingNotes: null,
    improvements: null,
    image: "compost-baffle",
    createdAt: "2026-06-10",
  },
];

export function getIdeaBySlug(slug: string): Idea | undefined {
  return IDEAS.find((idea) => idea.slug === slug);
}

export function getRelatedIdeas(idea: Idea, limit = 3): Idea[] {
  return IDEAS.filter(
    (other) => other.id !== idea.id && other.category === idea.category
  ).slice(0, limit);
}

export const FEATURED_IDEA_SLUGS = [
  "school-tap-water-saver",
  "frost-alert-for-water-pipes",
  "safer-blind-road-bends",
  "classroom-ventilation-indicator",
  "low-cost-apple-sorting-aid",
  "bird-sound-observation-station",
];

export const FEATURED_STORY_SLUG = "safer-blind-road-bends";
