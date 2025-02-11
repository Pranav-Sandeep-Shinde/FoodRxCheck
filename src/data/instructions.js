

export const instructions = [
  {
    id: 'contact-lens',
    title: 'Contact Lens Care',
    category: 'Eye Care',
    shortDescription: 'Essential guidelines for contact lens handling and maintenance',
    fullInstructions: `
      1. Always wash your hands thoroughly before handling contact lenses
      2. Clean lenses with appropriate solution daily
      3. Never use tap water to clean lenses
      4. Replace lens case every 3 months
      5. Don't sleep with contact lenses unless specifically approved
      6. Remove lenses immediately if you experience discomfort
    `,
    image: 'https://images.unsplash.com/photo-1587463272361-565200f82b33?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'shake-liquids',
    title: 'Medical Liquid Administration',
    category: 'Medication',
    shortDescription: 'Proper handling of liquid medications',
    fullInstructions: `
      1. Check expiration date before use
      2. Shake the bottle well for 10-15 seconds
      3. Measure dosage accurately using provided tools
      4. Store at recommended temperature
      5. Keep away from direct sunlight
      6. Record administration time and dosage
    `,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1999'
  },
  {
    id: 'warfarin-green-vegetables',
    title: 'Warfarin & Green Vegetables',
    category: 'Drug-Food Interaction',
    shortDescription: 'Important interaction between warfarin and vitamin K-rich foods',
    fullInstructions: `
      1. Monitor intake of green leafy vegetables
      2. Maintain consistent vitamin K consumption
      3. Avoid sudden changes in diet
      4. Report significant dietary changes to healthcare provider
      5. Keep a food diary
      6. Regular INR monitoring is essential
    `,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=2084',
    severity: 'high',
    interactionType: ['anticoagulant', 'dietary']
  },
  {
    id: 'grapefruit-statins',
    title: 'Grapefruit & Statins',
    category: 'Drug-Food Interaction',
    shortDescription: 'Interaction between grapefruit and cholesterol medications',
    fullInstructions: `
      1. Avoid grapefruit and grapefruit juice
      2. Check labels for grapefruit ingredients
      3. Consult healthcare provider about alternatives
      4. Monitor for side effects
      5. Take medication at scheduled times
      6. Report any unusual symptoms
    `,
    image: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&q=80&w=2070',
    severity: 'medium',
    interactionType: ['metabolism', 'dietary']
  },
  {
    id: 'dairy-antibiotics',
    title: 'Dairy Products & Antibiotics',
    category: 'Drug-Food Interaction',
    shortDescription: 'Impact of dairy products on antibiotic absorption',
    fullInstructions: `
      1. Take antibiotics 2 hours before or after dairy
      2. Avoid calcium-fortified foods during treatment
      3. Complete full course of antibiotics
      4. Keep track of timing between meals and medication
      5. Stay hydrated during treatment
      6. Report any digestive issues to healthcare provider
    `,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=2070',
    severity: 'medium',
    interactionType: ['absorption', 'dietary']
  }
];