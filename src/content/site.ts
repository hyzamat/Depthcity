/**
 * All site copy lives here so new details can be added without touching layout code.
 * Facts follow the DEPTH CITY 1.0.0 build (2026-10-11): store listing text, CardRenames.cs (no real landmark
 * names), NationConfig.cs (9 rivals), LevelLadder.cs (125 levels) and the catalogue (178 building cards, 11 tabs).
 */
export const site = {
  name: "DEPTH CITY",
  /** store title: "DEPTH CITY: Build & Defend" */
  tagline: "Build & Defend",
  /** the line under the wordmark on the title screen */
  motto: "BUILD • EXPAND • DEFEND • CONQUER",
  description:
    "DEPTH CITY is an open-world city building game with a real economy, a living world and a war to win. Build your island city, step into it as the Mayor and walk, drive and fly through the streets you built, and defend it when rival nations come from the sea. Coming soon to Android, iPhone, iPad and Windows PC.",
  status: "Version 1.0 · Coming soon to Android, iOS & Windows",
  company: "HIZARC",
  supportEmail: "hizarcgames@hizarc.com",
  androidPackage: "com.hizarc.depthcity",
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

/**
 * Search: the game's name is searched as "DEPTH CITY", "Depth City" and "depthcity" (the domain), so all three
 * spellings appear in the title/description, the structured data and the visible footer line. The genre people
 * search for — "city building game", "open world city building game" — leads the title and description.
 */
export const seo = {
  url: "https://depthcity.hizarc.com",
  title: "DEPTH CITY – Open-World City Building Game | Android, iOS & PC",
  description:
    "DEPTH CITY (DepthCity) is an open-world city building game for Android, iOS and PC: build a city, walk it as the Mayor in avatar mode and defend it in war.",
  alternateNames: ["DepthCity", "Depth City", "DEPTH CITY: Build & Defend"],
  /** one line on what the game is, reused by the visible footer line and llms.txt */
  genreLine: "an open-world city building game with an avatar Mayor mode and war, for Android, iPhone, iPad and Windows PC",
  keywords: [
    "DEPTH CITY", "DepthCity", "Depth City game", "Depth City: Build & Defend", "HIZARC", "HIZARC Games",
    "city building game", "open world city building game", "open-world city builder", "best city building game",
    "city builder with war", "city building game with avatar", "city builder where you can walk around",
    "city builder Android", "city builder iOS", "city builder PC", "offline city builder", "city builder no ads",
    "island city builder", "Mayor simulator", "strategy", "simulation", "Android", "iOS", "Windows",
  ],
  /** the studio — the same identity hizarc.com publishes, so search engines join the game to the company */
  studio: {
    id: "https://hizarc.com/#organization",
    name: "HIZARC Games",
    url: "https://hizarc.com/",
    logo: "https://hizarc.com/logo-600.png",
    place: "Kozhikode (Calicut), Kerala, India",
  },
  /** Google Search Console → "HTML tag" verification code (the content="…" value). Leave empty until you have it. */
  googleSiteVerification: "",
  /** Bing Webmaster Tools → "HTML Meta Tag" verification code (optional). */
  bingSiteVerification: "",
};

/**
 * Visitor stats: Umami Cloud (free Hobby plan). Cookie-free, so no consent banner; the dashboard shows visitors, pages,
 * referrers, devices, countries, regions and cities. Paste the Website ID from cloud.umami.is → Settings → Websites.
 * Leave empty to load no script at all.
 */
export const analytics = {
  umamiWebsiteId: "",
  /** only visits on these hosts are counted, so local and LAN previews stay out of the numbers */
  domains: "depthcity.hizarc.com",
};

export const hero = {
  image: "hero-skyline",
  alt: "DEPTH CITY skyline at noon — the Skyreach Tower rising over an island city",
  position: "50% 45%",
  pitch:
    "Turn an empty island into a glittering metropolis, then keep it alive. Run its economy, walk its streets as the Mayor, and defend it when rival nations come from the sea.",
};

export const stats = [
  { value: 170, suffix: "+", label: "Buildings", hint: "Across 11 categories, from power plants to a billion-dollar games studio" },
  { value: 125, suffix: "", label: "City levels", hint: "From a bare island to the last mega projects" },
  { value: 9, suffix: "", label: "Rival nations", hint: "Each with a treasury, an army and a mood" },
  { value: 7, suffix: "", label: "Disasters", hint: "Start them yourself, or let them find you" },
];

/** The store listing's six promises, in its own words where possible. */
export const pillars = [
  {
    title: "Build your city",
    body: "Draw streets, one-way roads, boardwalks, railways, an elevated metro and subways. Drag out zones and watch them fill. Place 170+ buildings across 11 categories, and climb 125 city levels.",
    accent: "sky",
  },
  {
    title: "Run the economy",
    body: "Set taxes, pass policies and research new technology. Income follows real demand and costs grow with your city. Overspend and you face austerity, debt and creditors at the door.",
    accent: "gold",
  },
  {
    title: "Defend your island",
    body: "Nine rival nations are watching. Arm your city and their invasions land on your beaches. Build defences and missile shields, scramble jets — then raid them back.",
    accent: "ember",
  },
  {
    title: "Live as the Mayor",
    body: "Step out of the map and walk your own streets. Drive your cars, walk into shops and homes, find love, hold a wedding, and take the family out.",
    accent: "rose",
  },
  {
    title: "A world that lives",
    body: "Day and night, spring blossom, monsoon rain, autumn leaves and winter snow. Traffic, trains, airliners, farms, a zoo and wildlife. Fireworks, concerts, parades — and seven kinds of disaster.",
    accent: "aurora",
  },
  {
    title: "Play your way",
    body: "Play offline, any time, with no ads and no in-app purchases. Portrait or landscape, on phone, tablet or PC. Share your city with friends using a City ID.",
    accent: "teal",
  },
];

/** Real gameplay, recorded on the game's own screen (public/media/play/<clip>.mp4 + .webp poster, 720×1280). */
export const gameplay: { clip: string; title: string; body: string }[] = [
  { clip: "play-build", title: "Build anything", body: "Open Build, pick a card and drop it. Construction crews take it from there." },
  { clip: "play-roads", title: "Draw your roads", body: "Drag a street across the lot, zone the blocks beside it, and the houses come." },
  { clip: "play-nature", title: "Paint nature", body: "Brush forests, lawns and beaches across the island. Wild animals find them." },
  { clip: "play-policies", title: "Enact policies", body: "Spend policy points on 21 policies, from Low-Interest Loans to a Four-Day Work Week." },
  { clip: "play-concert", title: "Throw a concert", body: "Eight city events, from a farmers market to a stadium concert and a fireworks show." },
];

/** The Army screen, shown as a phone in the War section. */
export const armyClip = { clip: "play-army", title: "Raise an army", body: "Recruit soldiers, commandos and special forces, set army pay, and deploy helicopters, fighter jets and the B2 bomber." };

export const warFeatures = [
  {
    title: "Nine rival nations",
    body: "Each one is an island on the world map, ranked by military might, with its own treasury, oil, minerals, weapons and an army that rebuilds. They trade, take sides and go to war with each other.",
  },
  {
    title: "They come from the sea",
    body: "Arm your city and you are on the world stage. Invaders land on your beaches with helicopters and jets overhead. An Intelligence Agency buys you days of warning to sandbag, hire mercenaries and pick a standing order.",
  },
  {
    title: "Shields up",
    body: "Radar, air defence and missile defence batteries, and a Technology Tower whose sky shield vaporises any enemy aircraft that enters it. Your air base scrambles its own interceptors.",
  },
  {
    title: "Raid them back",
    body: "Open the world map, tap a rival and land troops on their sand. Send in named jets and bombers, fire a missile — or a nuke. Bring down their Town Hall and half their city and they surrender: make them your colony.",
  },
];

/**
 * Cinematic reels — real footage recorded in the game (public/media/cine/<clip>-{1080,1440,tall}.mp4 + posters).
 * `clip` is the file base name; chapters play in scroll order.
 */
export type ReelChapter = { clip: string; label: string; title: string; body: string };

export const seasonsReel: ReelChapter[] = [
  {
    clip: "season-spring",
    label: "Spring",
    title: "The trees come out in blossom.",
    body: "Ten days of pink and white along every avenue, with light showers in between. The farms are planting, so food runs slow.",
  },
  {
    clip: "season-summer",
    label: "Fair weather",
    title: "Long sunny days at the lagoon.",
    body: "Most of the year is fair: sunbathers on the sand, parasols on the beach, bungalows over a turquoise pool. Twice a year the monsoon rolls in, with a storm on its middle day.",
  },
  {
    clip: "season-autumn",
    label: "Autumn",
    title: "Then the whole island turns gold.",
    body: "Forests go orange, red and yellow and the leaves start to fall. Harvest time: the farms bring in double food.",
  },
  {
    clip: "season-winter",
    label: "Winter",
    title: "Snow on every roof.",
    body: "Snow settles on rooftops, trees and roads, snowplows clear the streets, and the Ice Festival opens for the last days of the year.",
  },
];

export const mayorReel: ReelChapter[] = [
  {
    clip: "mayor-walk",
    label: "On foot",
    title: "Step out of the map and walk your own streets.",
    body: "Drag the Mayor onto the city — a rooftop, a mountain, even the roof of a moving train — and walk. The city you built is solid all around you.",
  },
  {
    clip: "mayor-mansion",
    label: "Home",
    title: "The Mayor has a mansion.",
    body: "Build the Mayor Mansion or buy any house in town, then walk in through the front door. Shops, homes and the Town Hall have interiors too.",
  },
  {
    clip: "mayor-wedding",
    label: "The wedding",
    title: "Find love. Hold the wedding on the plaza.",
    body: "Propose on the street, and if your honour is high enough the answer is yes. Then a balloon arch, a red carpet and a cheering crowd outside the mansion.",
  },
  {
    clip: "mayor-metro",
    label: "Ride the city",
    title: "Drive it, fly it, or ride on top of it.",
    body: "Take your cars out, fly planes and helicopters, or hop onto a moving metro and watch the skyline slide by. Then take the family out for the day.",
  },
];

export const wildReel: ReelChapter[] = [
  {
    clip: "wild-zoo",
    label: "Classic Zoo Park",
    title: "A whole zoo, alive in the middle of town.",
    body: "Elephants, camels, zebras, penguins, a crocodile — nineteen animals in their own enclosures, every one of them moving.",
  },
  {
    clip: "wild-close",
    label: "Up close",
    title: "Zoom all the way in. They're still moving.",
    body: "The tiger in its cage, the elephants by the wall, a buffalo standing in its pool — each one idling on its own loop.",
  },
  {
    clip: "wild-winter",
    label: "All year round",
    title: "Snow on the pens. Nobody stops.",
    body: "Beyond the zoo, leave land wild and animals move in on their own: deer, bears, boars and wolves in the forests; cattle, goats, chickens and rabbits in the meadows.",
  },
];

export const showReel: ReelChapter[] = [
  {
    clip: "party-tower",
    label: "Special Event",
    title: "Light up the Skyreach Tower.",
    body: "Start the Special Event and night falls over the city. The tower's LED skin runs through every colour and a record-breaking fireworks show climbs to the spire.",
  },
  {
    clip: "party-led",
    label: "The tower show",
    title: "Gold, crimson, cyan — all the way to the top.",
    body: "Patterns race up the facade while searchlights sweep the sky and shells burst around the tower, with the whole lit city below.",
  },
  {
    clip: "party-concert",
    label: "Stadium Concert",
    title: "A stadium full of people, on its feet.",
    body: "Put on a concert at the Football Stadium: a stage, lasers, a giant screen and a crowd with its hands in the air.",
  },
  {
    clip: "party-parade",
    label: "Parade",
    title: "Bands, floats and giant balloons.",
    body: "Send a parade through downtown — marchers, banners and a teddy bear the size of a house floating above the junction.",
  },
  {
    clip: "party-market",
    label: "Farmers Market",
    title: "Stalls, bunting, and a street full of shoppers.",
    body: "Close a street for a farmers market. Block parties, a marathon and the winter Ice Festival are in the Events window too.",
  },
];

export const disasterReel: ReelChapter[] = [
  {
    clip: "disaster-tornado",
    label: "Tornado",
    title: "It tears a path straight through town.",
    body: "A funnel drops out of a clear sky and walks across the farmland, flinging debris as it goes.",
  },
  {
    clip: "disaster-fire",
    label: "Fire",
    title: "One spark, and the Mega Mall goes up.",
    body: "Flames climb the facade and jump to the next building, lighting up the whole block at night. Build a Fire Force before you need it.",
  },
  {
    clip: "disaster-volcano",
    label: "Volcano",
    title: "And sometimes the ground opens up.",
    body: "A volcano shoulders up out of open land beside the city, throws lava bombs, and lights the whole skyline at dusk before it sinks back down.",
  },
];

export const battleReel: ReelChapter[] = [
  {
    clip: "war-landing",
    label: "The landing",
    title: "They come ashore on your beaches.",
    body: "The siren sounds, the camera punches to the coast, and a wave of infantry charges up the sand with helicopters and jets overhead.",
  },
  {
    clip: "war-bomber",
    label: "Air power",
    title: "Bombers in over the beach.",
    body: "Seven named aircraft, from attack helicopters to the B2 bomber, built at your Weapons Factory. Send them on raids — and watch the sky when theirs come back.",
  },
  {
    clip: "war-streets",
    label: "Street fighting",
    title: "Your army takes the corners.",
    body: "Squads sprint the crossings and kneel to fire. The Mayor can step into the street and fight alongside them.",
  },
  {
    clip: "war-defence",
    label: "Missile defence",
    title: "Launchers up. Every missile counts.",
    body: "Air defence and missile defence batteries track what comes in, and the Technology Tower's dome vaporises enemy aircraft and diverts missiles aimed inside it.",
  },
  {
    clip: "war-siege",
    label: "The Town Hall",
    title: "If the Town Hall falls, you pay.",
    body: "Raiders go for the richest blocks and the crowd closes on the seat of government. Lose it and your city becomes their colony, paying tribute until you take it back.",
  },
];

/**
 * Bento gallery on a 4-column grid (2 on phones). `span`: "big" = 2×2, "wide" = 2×1, omitted = 1×1.
 * The order is chosen so the grid packs with no holes at both column counts.
 */
export const gallery: { src: string; caption: string; span?: "big" | "wide" }[] = [
  { src: "lm-skydeck", caption: "Skydeck Towers in autumn", span: "big" },
  { src: "lm-megamall-night", caption: "Mega Mall, after dark" },
  { src: "lm-parliament-winter", caption: "Parliament under snow" },
  { src: "lm-airliner", caption: "Airliners over the coast", span: "wide" },
  { src: "lm-lagoon-resort", caption: "Lagoon Beach Resort" },
  { src: "lm-samurai-castle", caption: "Samurai Castle at night" },
  { src: "lm-sakura-tower", caption: "Sakura Tower at dusk", span: "big" },
  { src: "lm-amusement", caption: "Amusement Park" },
  { src: "lm-horizon-museum", caption: "Horizon Museum" },
  { src: "lm-shipping-dock", caption: "Shipping Dock in winter" },
  { src: "lm-stadium-autumn", caption: "Football Stadium" },
  { src: "lm-financial-center", caption: "Financial Center" },
];

/**
 * Questions people (and AI assistants) ask about the game. Shown as the FAQ section, published as FAQPage
 * structured data and in /llms.txt — so every answer must stay true to the current build. Keep each answer
 * self-contained: search engines and chat assistants quote them one at a time.
 */
export const faq: { q: string; a: string }[] = [
  {
    q: "What is DEPTH CITY?",
    a: "DEPTH CITY (also written DepthCity) is an open-world city building game by HIZARC Games for Android, iPhone, iPad and Windows PC. You build an island city from bare land, run its economy, step into it as the Mayor to walk, drive and fly through the streets you built, and defend it when rival nations invade from the sea.",
  },
  {
    q: "Is DEPTH CITY an open-world city building game?",
    a: "Yes. You build from above like a classic city builder, then drop the Mayor anywhere in the city — a street, a rooftop, a mountain, even the roof of a moving train — and explore it freely on foot, by car, by helicopter or by plane. Shops, homes, the Town Hall and the Mayor Mansion have interiors you can walk into.",
  },
  {
    q: "What is the best city building game with an avatar mode and war?",
    a: "DEPTH CITY is built for exactly that mix. It is a full city builder (170+ buildings in 11 categories, 125 city levels, taxes, policies and research), an avatar game where you live as the Mayor — walk, drive, fly, find love and hold a wedding — and a war game against nine rival nations with invasions, air defence, jets, bombers and missiles. It is coming to Android, iOS and PC.",
  },
  {
    q: "Which platforms is DEPTH CITY on?",
    a: "DEPTH CITY 1.0 is built for Android phones and tablets, iPhone, iPad and Windows PC. It plays in portrait or landscape, and it plays offline.",
  },
  {
    q: "When is DEPTH CITY coming out?",
    a: "Version 1.0 is finished and coming soon. Leave your email on depthcity.hizarc.com to hear about the closed test, the Google Play and App Store pages and the launch.",
  },
  {
    q: "How does war work in DEPTH CITY?",
    a: "Nine rival nations share the world map, each with its own treasury, resources and army. Once you arm your city, invaders land on your beaches with helicopters and jets overhead. You defend with radar, air defence and missile defence batteries and a Technology Tower shield, then raid them back with troops, named jets and bombers, missiles or a nuke. Bring down their Town Hall and half their city and they surrender as your colony.",
  },
  {
    q: "Can I walk around my own city?",
    a: "Yes — that is the Mayor mode. Walk your own streets, drive your cars, fly planes and helicopters, ride the metro, walk into shops and homes, buy a house or build the Mayor Mansion, propose, hold a wedding on the plaza and take the family out. The Mayor can even fight alongside your army during an invasion.",
  },
  {
    q: "Does DEPTH CITY have ads or in-app purchases?",
    a: "No. DEPTH CITY has no ads and no in-app purchases, and it plays fully offline. You can share your city with friends using a City ID.",
  },
  {
    q: "What else is in the game?",
    a: "Day and night, four seasons with spring blossom, monsoon rain, autumn leaves and winter snow, traffic, trains, ships and airliners, a zoo with nineteen animals and wildlife in the forests, eight city events from a farmers market to a stadium concert and a fireworks show, and seven kinds of disaster including tornadoes, fires and a volcano.",
  },
  {
    q: "Who makes DEPTH CITY?",
    a: "DEPTH CITY is made by Shainal Badusha, a solo developer and IT engineer, at HIZARC Games in Kozhikode (Calicut), Kerala, India. It is built in Unity.",
  },
];
