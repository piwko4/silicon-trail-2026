// Silicon Trail 2026 - Game Data
// Classic Oregon Trail DNA with 2026 tech startup twist

export const OCCUPATIONS = [
  { id: 'faang', name: 'Ex-FAANG Engineer', startingCash: 50000, startingMorale: 60, bonus: 'compute' },
  { id: 'founder', name: 'Serial Founder', startingCash: 30000, startingMorale: 80, bonus: 'connections' },
  { id: 'bootcamp', name: 'Bootcamp Grad', startingCash: 10000, startingMorale: 100, bonus: 'hustle' },
  { id: 'corporate', name: 'Corporate Refugee', startingCash: 40000, startingMorale: 50, bonus: 'savings' },
];

export const TEAM_MEMBERS = [
  'Alex', 'Jordan', 'Sam', 'Riley', 'Morgan', 'Casey', 'Quinn', 'Avery',
  'Taylor', 'Blake', 'Drew', 'Reese', 'Skyler', 'Jamie', 'Sage', 'Rowan'
];

export const ROLES = ['CTO', 'Designer', 'Marketer', 'Sales', 'Backend Dev', 'Frontend Dev', 'DevOps', 'Data Scientist'];

export const SUPPLIES = {
  compute: { name: 'Compute Credits', price: 100, emoji: '🖥️' },
  coffee: { name: 'Coffee Supply', price: 20, emoji: '☕' },
  monitors: { name: 'Monitors', price: 200, emoji: '🖥️' },
  snacks: { name: 'Snacks', price: 30, emoji: '🍕' },
  standingDesks: { name: 'Standing Desks', price: 300, emoji: '🪑' },
  whiteboards: { name: 'Whiteboards', price: 50, emoji: '📋' },
};

export const LANDMARKS = [
  { name: 'The Garage', distance: 0, type: 'start', description: 'Where every great startup begins.' },
  { name: 'Seed Round Creek', distance: 100, type: 'river', description: 'Your first funding challenge.' },
  { name: 'Product Hunt Pass', distance: 200, type: 'landmark', description: 'Get noticed or get buried.' },
  { name: 'Y Combinator Springs', distance: 350, type: 'trading', description: 'Network with fellow founders.' },
  { name: 'Series A River', distance: 500, type: 'river', description: 'The real test begins.' },
  { name: 'Scaling Mountains', distance: 650, type: 'landmark', description: 'Infrastructure crumbles here.' },
  { name: 'Pivot Valley', distance: 800, type: 'decision', description: 'Stay the course or change everything?' },
  { name: 'Series B Rapids', distance: 950, type: 'river', description: 'Sharks in these waters.' },
  { name: 'The Plateau of Despair', distance: 1100, type: 'landmark', description: 'Many founders lose hope here.' },
  { name: 'Acquisition Alley', distance: 1250, type: 'trading', description: 'Tempting offers await.' },
  { name: 'IPO Summit', distance: 1400, type: 'end', description: 'The promised land.' },
];

export const EVENTS = {
  positive: [
    { text: "A viral tweet brings 10,000 new users overnight!", effect: { progress: 15, morale: 10 } },
    { text: "Your Show HN post hit #1!", effect: { progress: 20, morale: 15 } },
    { text: "An angel investor slides into your DMs.", effect: { cash: 25000 } },
    { text: "Your competitor just pivoted. Users are migrating to you!", effect: { progress: 10, morale: 10 } },
    { text: "AWS sent you $100k in free credits!", effect: { compute: 1000 } },
    { text: "A FAANG engineer asked to join for equity only.", effect: { teamBonus: true, morale: 10 } },
    { text: "Your product was featured in TechCrunch!", effect: { progress: 25, morale: 20 } },
    { text: "Found a 10x improvement in your algorithm.", effect: { compute: 500, progress: 10 } },
  ],
  negative: [
    { text: "AWS bill came in 4x higher than expected.", effect: { cash: -5000, compute: -200 } },
    { text: "Your best engineer got a LinkedIn message from OpenAI.", effect: { teamRisk: true, morale: -15 } },
    { text: "The model is hallucinating. Users are posting screenshots.", effect: { progress: -10, morale: -20 } },
    { text: "Investor ghosted after 3 meetings.", effect: { morale: -25 } },
    { text: "You've been mass-reported for AI slop.", effect: { progress: -15, morale: -10 } },
    { text: "A rogue commit deleted prod at 2am.", effect: { progress: -20, morale: -15 } },
    { text: "Your demo crashed during the investor pitch.", effect: { morale: -30, cash: -10000 } },
    { text: "Co-founder wants to 'talk about equity split'.", effect: { morale: -20, teamRisk: true } },
    { text: "Hacker News commenters destroyed your Show HN.", effect: { morale: -25 } },
    { text: "Your domain got stolen by a squatter.", effect: { cash: -2000, morale: -10 } },
  ],
  disaster: [
    { text: "DYSENTERY: Your CTO mass laid off themselves from life.", effect: { teamDeath: true }, classic: true },
    { text: "SNAKE BITE: Replied-all to investor with internal Slack rant.", effect: { morale: -50, cash: -20000 } },
    { text: "CHOLERA: The entire team got mass food poisoning at the offsite.", effect: { morale: -40, daysLost: 5 } },
    { text: "BROKEN AXLE: Deployment pipeline completely borked.", effect: { progress: -30, daysLost: 3 } },
    { text: "TYPHOID: Burnout epidemic. Half the team is on leave.", effect: { morale: -60, teamRisk: true } },
    { text: "DROWNED IN RIVER: Your pivot flooded the codebase. Starting over.", effect: { progress: -50 } },
  ],
  hunting: [
    { text: "You pitched 3 VCs at the coffee shop.", results: ['ghosted', 'maybe', 'termsheet'] },
    { text: "Freelance gig opportunity appeared!", results: ['scam', 'lowball', 'decent', 'great'] },
    { text: "Launched a weekend ProductHunt side project.", results: ['buried', 'meh', 'trending', 'viral'] },
  ],
};

export const PACE_OPTIONS = [
  { id: 'crunch', name: '😰 Crunch Mode', speed: 3, burnoutRisk: 0.15, description: 'Move fast, break people' },
  { id: 'steady', name: '⚖️ Sustainable', speed: 2, burnoutRisk: 0.05, description: 'Balanced progress' },
  { id: 'grass', name: '🌿 Touch Grass', speed: 1, burnoutRisk: -0.05, description: 'Recovery mode' },
];

export const RATIONS = [
  { id: 'ramen', name: '🍜 Ramen Budget', moraleMod: -5, cashMod: 0.5 },
  { id: 'normal', name: '🥗 Normal', moraleMod: 0, cashMod: 1 },
  { id: 'catered', name: '🍱 Catered Lunches', moraleMod: 5, cashMod: 2 },
];

export const RIVER_CHOICES = [
  { id: 'ford', name: 'Ford the launch (risky, free)', risk: 0.4, cost: 0 },
  { id: 'wait', name: 'Wait for better timing', risk: 0.1, cost: 0, days: 5 },
  { id: 'ferry', name: 'Hire a PR agency ($5000)', risk: 0.1, cost: 5000 },
  { id: 'caulk', name: 'Soft launch and float across', risk: 0.25, cost: 0 },
];

export const TOMBSTONE_EPITAPHS = [
  "Here lies {name}'s startup — 'We should have charged from day one'",
  "RIP {name} — 'Pivoted one too many times'",
  "{name} — 'The tech was ready, the market wasn't'",
  "In memory of {name} — 'Should have taken the acqui-hire'",
  "{name} — 'Died doing what they loved: debugging prod at 3am'",
  "Here lies {name} — 'We were too early'",
  "{name} — 'Mass layoffs got us'",
  "RIP {name} — 'The runway was shorter than it looked'",
  "{name} — 'Our AI was actually just if-statements'",
  "Here lies {name} — 'Investors said we were \"interesting\"'",
];

export const AI_PLAYER_NAMES = [
  'xX_PivotKing_Xx', 'SaaSyDeveloper', 'VCWhisperer', 'Founder_Mode_69',
  'SeriesAchieved', 'DisruptorDave', 'TechDebtCollector', 'BurnRateBetty',
  'ScaleOrDie', 'ProductMarketFitter', 'GrowthHacker9000', 'ExitStrategy',
  'RamenProfitable', 'UnicornHunter', 'BootstrappedBoss', 'AngelEyes',
  'TheRealMVP_rod', 'IterateOrDie', 'Agile_Andrea', 'LeanStartupLarry',
];

export const AI_STARTUP_NAMES = [
  'CloudKitchen.ai', 'PetGPT', 'BlockchainBagels', 'UberForPlumbers',
  'AIaaS.io', 'DisruptSleep', 'Web4Labs', 'QuantumToast', 'NFTDentist',
  'CryptoTherapy', 'MLforCats', 'SaaSyPants', 'PivotTable.ai', 'BurnRate.io',
  'TechDebt.co', 'VaporWare.ai', 'ScaleFailScale', 'GrowthLoop.io',
];
