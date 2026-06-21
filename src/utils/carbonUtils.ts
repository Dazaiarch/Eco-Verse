import { LogEntry, Quest, Badge, SimulatorState, TangibleEquivalent } from '../types';

// Standard conversion metrics
// 1 kg CO2 saved is equivalent to:
// - ~0.046 trees planted/year (since a tree absorbs ~21.77 kg/year)
// - ~0.3 sq meters of Arctic ice saved (scientific proxy: approx 3 sq meters of summer sea ice saved per metric ton of CO2)
// - ~2.5 km of standard vehicle drive (0.4 kg CO2 per km)
// - ~10 hours of home bulb power (0.1 kg CO2 per hour)
export function getTangibleEquivalents(kgSaved: number): TangibleEquivalent[] {
  const absoluteKg = Math.max(0, kgSaved);
  return [
    {
      label: "Trees Planted Equivalent",
      value: parseFloat((absoluteKg / 21.77).toFixed(1)),
      unit: "trees / year",
      emoji: "🌳",
      colorClass: "text-[#00e676]"
    },
    {
      label: "Glacier Sea Ice Saved",
      value: parseFloat((absoluteKg * 0.3).toFixed(1)),
      unit: "sq meters",
      emoji: "🧊",
      colorClass: "text-[#00e5ff]"
    },
    {
      label: "Avoided Drive Length",
      value: parseFloat((absoluteKg * 2.5).toFixed(0)),
      unit: "km drive avoided",
      emoji: "🚗",
      colorClass: "text-amber-400"
    },
    {
      label: "Home Energy Credit",
      value: parseFloat((absoluteKg * 10).toFixed(0)),
      unit: "hours powered",
      emoji: "⚡",
      colorClass: "text-[#ffab00]"
    }
  ];
}

// Simulator equations: calculating hypothetical weekly/annual reductions based on lifestyle choices
export function calculateSimulatorSavings(state: SimulatorState) {
  // 1. Bike days: replacing standard car commute of 15 km/day = 15km * 2 ways * 0.4kg/km = 12 kg CO2 per day
  const bikeSavingsPerDay = 12; 
  const weeklyBikeSavings = state.bikeDays * bikeSavingsPerDay;

  // 2. Veggie days: replacing standard meat meals with vegetarian meals = ~4 kg CO2 savings per day
  const veggieSavingsPerDay = 4;
  const weeklyVeggieSavings = state.veggieDays * veggieSavingsPerDay;

  // 3. LED bulbs: replacing old bulbs saves ~0.15 kg CO2 per day per bulb
  const bulbSavingsPerDay = 0.15;
  const weeklyBulbSavings = state.ledBulbs * bulbSavingsPerDay * 7;

  // 4. Local food: switching to local sourcing saves ~3.5 kg/week in transport emissions
  const weeklyLocalSavings = state.localFood ? 4.5 : 0;

  // 5. Compost Waste: reducing landfill methane saves ~5.0 kg/week
  const weeklyCompostSavings = state.compostWaste ? 5.0 : 0;

  // 6. Solar panels: cleanly offsets home energy by ~25.0 kg/week
  const weeklySolarSavings = state.solarPanels ? 32.0 : 0;

  const totalWeeklySavings = weeklyBikeSavings + weeklyVeggieSavings + weeklyBulbSavings + weeklyLocalSavings + weeklyCompostSavings + weeklySolarSavings;
  const totalAnnualSavings = totalWeeklySavings * 52;
  
  // Cost savings estimate: approximate financial incentives ($0.50 saved per kg CO2 through reduced fuel, meat costs, and utility power bills)
  const totalAnnualMoneySaved = totalAnnualSavings * 0.45;

  return {
    weeklySavings: totalWeeklySavings,
    annualSavings: totalAnnualSavings,
    annualMoneySaved: totalAnnualMoneySaved
  };
}

// Initial Preset Quests
export const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Veggie Power Day',
    description: 'Log a fully vegetarian or vegan meal today to reduce agricultural footprint.',
    rewardCoins: 25,
    type: 'daily',
    category: 'food',
    completed: false,
    progress: 0,
    target: 1,
    icon: '🥗'
  },
  {
    id: 'q2',
    title: 'Zero-Emission Commuter',
    description: 'Log a walk, run, or bike ride of at least 5 kilometers.',
    rewardCoins: 35,
    type: 'daily',
    category: 'transport',
    completed: false,
    progress: 0,
    target: 1,
    icon: '🚲'
  },
  {
    id: 'q3',
    title: 'Unplugged Champion',
    description: 'Reduce home heating/cooling usage or keep appliances unplugged today.',
    rewardCoins: 30,
    type: 'daily',
    category: 'energy',
    completed: false,
    progress: 0,
    target: 1,
    icon: '🔌'
  },
  {
    id: 'q4',
    title: 'The Eco-Packer Challenge',
    description: 'Log a reusable shopping bag deposit or avoided single-use purchase.',
    rewardCoins: 20,
    type: 'daily',
    category: 'shopping',
    completed: false,
    progress: 0,
    target: 1,
    icon: '🛍️'
  },
  {
    id: 'qw1',
    title: 'Green Commuting Week',
    description: 'Submit 4 or more green commutes or carbon credits in a single week.',
    rewardCoins: 100,
    type: 'weekly',
    category: 'transport',
    completed: false,
    progress: 2,
    target: 4,
    icon: '🚇'
  },
  {
    id: 'qw2',
    title: 'Bite-Sized Climate Action',
    description: 'Register 6 healthy eco logs in your carbon bank account.',
    rewardCoins: 120,
    type: 'weekly',
    category: 'eco_credit',
    completed: false,
    progress: 3,
    target: 6,
    icon: '🌿'
  }
];

// Initial Preset Badges
export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'b1',
    title: 'Seed Sower',
    description: 'Log your first Eco Action credit to kick off your sustainability quest.',
    emoji: '🌱',
    category: 'eco_credit',
    unlocked: true,
    requirementText: 'Log 1 Carbon Credit action',
    currentValue: 1,
    targetValue: 1
  },
  {
    id: 'b2',
    title: 'Forest Guardian',
    description: 'Save a cumulative total of 50 kg of carbon to establish a healthy visual woodland.',
    emoji: '🌲',
    category: 'eco_credit',
    unlocked: false,
    requirementText: 'Saves 50 kg of CO2 in credits',
    currentValue: 18.5,
    targetValue: 50
  },
  {
    id: 'b3',
    title: 'Ocean Protector',
    description: 'Prevent food waste or purchase eco-friendly, locally sourced seafood and grocery.',
    emoji: '🌊',
    category: 'shopping',
    unlocked: false,
    requirementText: 'Avoid 3 high-impact commercial logs',
    currentValue: 1,
    targetValue: 3
  },
  {
    id: 'b4',
    title: 'Solar Pioneer',
    description: 'Signify transition of energy resources or smart conservation levels.',
    emoji: '☀️',
    category: 'energy',
    unlocked: false,
    requirementText: 'Log 5 home-energy saving habits',
    currentValue: 2,
    targetValue: 5
  },
  {
    id: 'b5',
    title: 'Asphalt Nomad',
    description: 'Keep your gas burner garage-bound by biking or walking regularly.',
    emoji: '🚲',
    category: 'transport',
    unlocked: false,
    requirementText: 'Complete 5 green eco-commutes',
    currentValue: 1,
    targetValue: 5
  },
  {
    id: 'b6',
    title: 'Conscious Eater',
    description: 'Transition meal ingredients with low-methane healthy vegetarian diets.',
    emoji: '🍲',
    category: 'food',
    unlocked: false,
    requirementText: 'Log 5 organic or meatless food choices',
    currentValue: 3,
    targetValue: 5
  }
];

// default pre-filled historical transaction log entries to give a high quality visual graph and realistic score
export const INITIAL_LOG_ENTRIES: LogEntry[] = [
  {
    id: 'log1',
    description: 'Glided to work on standard fuel vehicle (15km commute)',
    category: 'transport',
    type: 'spend',
    amount: 6.0,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: 'log2',
    description: 'Biked back from office instead of taxi (15km credit)',
    category: 'transport',
    type: 'credit',
    amount: 6.0,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'log3',
    description: 'Enjoyed double cheeseburger and beef meal',
    category: 'food',
    type: 'spend',
    amount: 7.2,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 'log4',
    description: 'Replaced living room light fixtures with LED Bulbs',
    category: 'energy',
    type: 'credit',
    amount: 3.5,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'log5',
    description: 'Washed clothes with warm utility dryer cycle',
    category: 'energy',
    type: 'spend',
    amount: 4.8,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 'log6',
    description: 'Composted household organic wastes',
    category: 'eco_credit',
    type: 'credit',
    amount: 2.5,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'log7',
    description: 'Purchased commercial imported grocery wrap products',
    category: 'shopping',
    type: 'spend',
    amount: 3.2,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hrs ago
  },
  {
    id: 'log8',
    description: 'Opted for zero plastic tote bag for daily shopping',
    category: 'shopping',
    type: 'credit',
    amount: 1.5,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hrs ago
  },
  {
    id: 'log9',
    description: 'Prepared a pure plant-based green soup dinner',
    category: 'food',
    type: 'credit',
    amount: 5.0,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hr ago
  }
];
