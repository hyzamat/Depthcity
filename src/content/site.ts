/**
 * All site copy lives here so new details can be added without touching layout code.
 */
export const site = {
  name: "Depth City",
  tagline: "Build deeper.",
  description:
    "Depth City is a city-building game with real depth — a living island that breathes through day and night, rival nations to outwit or outgun, a secret order in the woods, and a rocket that leaves the tower behind. Made with passion by IT engineer Shainal Badusha.",
  status: "In development · Built in Unity",
  creator: {
    name: "Shainal Badusha",
    role: "IT Engineer · Solo Developer",
    quote:
      "I wanted a city builder that keeps surprising you — the kind where you zoom in at 2 a.m. and find something you were never told about.",
  },
  links: {
    // Fill these in later — buttons stay visible and say "coming soon" until then.
    wishlist: "",
    playStore: "",
    appStore: "",
    youtube: "",
    discord: "",
    twitter: "",
    instagram: "",
    email: "",
  },
};

export const stats = [
  { value: 181, suffix: "", label: "Buildings to unlock", hint: "6 categories, from bakeries to THAAD batteries" },
  { value: 11, suffix: "", label: "Rival nations", hint: "Each with a treasury, an army and a mood" },
  { value: 24, suffix: "h", label: "Living day cycle", hint: "Rose dawns, golden hours, moonlit nights" },
  { value: 1, suffix: "", label: "Secret society", hint: "You were never told about it" },
];

export const pillars = [
  {
    title: "A city that breathes",
    body: "Traffic, pedestrians, metro and rail, ships in the harbour, birds over the bay. Every service you place shows up on the streets — and every outage shows up too.",
    accent: "sky",
  },
  {
    title: "War with consequences",
    body: "Recruit, drill, scramble jets. Raid rival nations for loot — or watch them land on your shore and march on the town hall. Both armies fight in shifts, and the books balance in the same currency.",
    accent: "ember",
  },
  {
    title: "Hidden depth",
    body: "Forest rituals. Back-alley gatherings. A New Year show on the tallest tower. A rocket named after its maker. The deeper you look, the more you find.",
    accent: "aurora",
  },
];

export const warFeatures = [
  { title: "Eleven rival nations", body: "Real landmasses on a relief world map. Treasuries, commodities, standing armies, relations that drift — and a daily tribute once they're conquered." },
  { title: "Intelligence agency", body: "Place one and foreign powers take notice. Intercept the plan, count down the days, fortify — or strike first." },
  { title: "Air raid warning", body: "Red-uniformed infantry, tanks, helicopters and jets cross the border. Your air base scrambles interceptors on its own." },
  { title: "Siege of the town hall", body: "Spearhead, raiders and screen. If the seat of government falls, the city is sacked and the invaders loot half the treasury." },
];

/**
 * Cinematic reels — real footage recorded in the game (public/media/cine/<clip>-{1080,1440,tall}.mp4 + posters).
 * `clip` is the file base name; chapters play in scroll order.
 */
export type ReelChapter = { clip: string; label: string; title: string; body: string };

export const battleReel: ReelChapter[] = [
  {
    clip: "war-city",
    label: "The drop",
    title: "They come in over the rooftops.",
    body: "Drop jets cross the shoreline and the sky fills with canopies — infantry first, then armour on heavy chutes. Before the first boots touch the street, the city is already a battlefield.",
  },
  {
    clip: "war-invaders",
    label: "The assault",
    title: "The enemy army pushes for the town hall.",
    body: "Red-uniformed squads sprint the crossings, drop to a knee and open fire. Spearheads go for the seat of government, raiders for the richest blocks, a screen to pin your army down.",
  },
  {
    clip: "war-gunfire",
    label: "The line holds",
    title: "Your army answers, shot for shot.",
    body: "Your soldiers take the corners, kneel behind the cars and trade fire. Each round is simulated — muzzle flash, a tracer that really flies, sparks where it lands, brass bouncing off the asphalt.",
  },
];

export const showReel: ReelChapter[] = [
  {
    clip: "show-midnight",
    label: "Midnight",
    title: "Three, two, one — the tower goes up.",
    body: "The countdown runs down the facade in seven-segment digits, searchlights lean in over the spire, and at midnight every level of every wing fires at once.",
  },
  {
    clip: "show-waterfall",
    label: "Waterfall",
    title: "Gold pours off every setback.",
    body: "Cascades run down the wings while the LED skin plays a wave of flame from the base to the spire. The camera circles the tower with the whole city lit below.",
  },
  {
    clip: "show-spiral",
    label: "Spiral",
    title: "A helix of purple and cyan.",
    body: "Fans spin up the wings in a barber-pole spiral and shells crown the spire. Look up from the street and the tower fills the sky.",
  },
  {
    clip: "show-finale",
    label: "Finale",
    title: "Everything, then one last hit.",
    body: "The facade flicks through every colour, the whole tower fires together and the sky over the island fills with gold. Then smoke, applause — and dawn.",
  },
];

export const wildReel: ReelChapter[] = [
  {
    clip: "zoo-orbit",
    label: "Big Zoo Park",
    title: "A whole zoo, alive in the middle of town.",
    body: "Elephants, giraffes, lions, tigers, pandas, penguins, hippos, rhinos, zebras — sixteen species in their own enclosures, every one of them animated.",
  },
  {
    clip: "zoo-close",
    label: "Up close",
    title: "Zoom all the way in. They're still moving.",
    body: "Bring the camera down to the paths between the pens: the crocodile in its pool, the penguins on their ice, the elephants by the wall — each one on its own loop.",
  },
  {
    clip: "wild-herd",
    label: "Out in the wild",
    title: "Leave land wild and the animals move in.",
    body: "Forests draw deer, foxes and bears; open meadows get cows, goats and rabbits. Herds wander and graze on their own — and somewhere in the trees, a tiger is waiting for its moment.",
  },
];

/**
 * Bento gallery on a 4-column grid (2 on phones). `span`: "big" = 2×2, "wide" = 2×1, omitted = 1×1.
 * The order is chosen so the grid packs with no holes at both column counts.
 */
export const gallery: { src: string; caption: string; span?: "big" | "wide" }[] = [
  { src: "district-amusement", caption: "Amusement park & the Dome", span: "big" },
  { src: "district-airport", caption: "Future Airport" },
  { src: "district-castle", caption: "Nuclear plant & the old quarter" },
  { src: "eiffel-day", caption: "Eiffel Tower, Stadium & Space Center", span: "wide" },
  { src: "district-beach", caption: "Beach resort on the west shore" },
  { src: "district-army", caption: "Army HQ, air base & Petronas" },
  { src: "downtown-evening", caption: "Downtown at golden hour", span: "big" },
  { src: "district-mountains", caption: "Asian & desert mountains" },
  { src: "downtown-night", caption: "Downtown, moonlit" },
];
