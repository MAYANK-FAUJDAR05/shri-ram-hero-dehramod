import React from 'react';

export interface ColorProfile {
  name: string;
  primaryHex: string;
  secondaryHex?: string;
  finish: 'Gloss' | 'Matte' | 'Metallic' | 'Dual Tone' | 'Pearl' | 'Stealth';
  finishLabel: string;
  description: string;
  glowColor: string;
  overlayColor: string;
  filterCss: string;
  accentBadgeColor: string;
  isLightShade?: boolean;
}

// Pre-defined database of authentic Hero MotoCorp factory paints & dynamic studio lighting profiles
const KNOWN_COLOR_PROFILES: Record<string, Partial<ColorProfile>> = {
  // Reds
  'Sports Red': {
    primaryHex: '#E11D23',
    finish: 'Gloss',
    finishLabel: 'High-Gloss Racing Red',
    description: 'Hero signature pure racing red with multi-layer high-gloss clearcoat.',
    glowColor: 'rgba(225, 29, 35, 0.45)',
    overlayColor: 'rgba(225, 29, 35, 0.28)',
    filterCss: 'saturate(1.2) contrast(1.05)',
    accentBadgeColor: '#E11D23',
  },
  'Candy Blazing Red': {
    primaryHex: '#DC2626',
    secondaryHex: '#991B1B',
    finish: 'Metallic',
    finishLabel: 'Candy Metallic Red',
    description: 'Deep jewel-like candy flake that sparkles intensely in direct sunlight.',
    glowColor: 'rgba(220, 38, 38, 0.5)',
    overlayColor: 'rgba(220, 38, 38, 0.32)',
    filterCss: 'saturate(1.3) contrast(1.1) hue-rotate(-5deg)',
    accentBadgeColor: '#DC2626',
  },
  'Turbo Red': {
    primaryHex: '#EF4444',
    secondaryHex: '#1F2937',
    finish: 'Dual Tone',
    finishLabel: 'Dual-Tone Sport Red',
    description: 'High-intensity dynamic crimson paired with charcoal graphite fairing accents.',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    overlayColor: 'rgba(239, 68, 68, 0.25)',
    filterCss: 'saturate(1.25) contrast(1.08)',
    accentBadgeColor: '#EF4444',
  },
  'Fearless Red': {
    primaryHex: '#B91C1C',
    finish: 'Metallic',
    finishLabel: 'Deep Metallic Crimson',
    description: 'Aggressive roadster crimson engineered for premium presence and luster.',
    glowColor: 'rgba(185, 28, 28, 0.5)',
    overlayColor: 'rgba(185, 28, 28, 0.3)',
    filterCss: 'saturate(1.2) contrast(1.1) brightness(0.95)',
    accentBadgeColor: '#B91C1C',
  },
  'Firestorm Red': {
    primaryHex: '#EA580C',
    secondaryHex: '#DC2626',
    finish: 'Metallic',
    finishLabel: 'Firestorm Orange-Red',
    description: 'High-energy combustion hue with blazing orange-amber undertones.',
    glowColor: 'rgba(234, 88, 12, 0.48)',
    overlayColor: 'rgba(234, 88, 12, 0.28)',
    filterCss: 'saturate(1.35) hue-rotate(15deg) contrast(1.05)',
    accentBadgeColor: '#EA580C',
  },
  'Nobel Red': {
    primaryHex: '#9F1239',
    secondaryHex: '#E11D23',
    finish: 'Gloss',
    finishLabel: 'Executive Burgundy Red',
    description: 'Refined, sophisticated deep wine red delivering a luxury urban presence.',
    glowColor: 'rgba(159, 18, 57, 0.45)',
    overlayColor: 'rgba(159, 18, 57, 0.35)',
    filterCss: 'saturate(1.15) contrast(1.1) hue-rotate(-15deg)',
    accentBadgeColor: '#9F1239',
  },
  'Matte Sports Red': {
    primaryHex: '#DC2626',
    finish: 'Matte',
    finishLabel: 'Anti-Glare Matte Red',
    description: 'Tactile matte finish that eliminates glare while maintaining bold red attitude.',
    glowColor: 'rgba(220, 38, 38, 0.4)',
    overlayColor: 'rgba(220, 38, 38, 0.25)',
    filterCss: 'contrast(0.95) saturate(1.1)',
    accentBadgeColor: '#DC2626',
  },

  // Blacks & Stealth Tones
  'Canvas Black': {
    primaryHex: '#18181B',
    secondaryHex: '#27272A',
    finish: 'Stealth',
    finishLabel: 'Stealth Matte Black',
    description: 'All-black murdered-out finish with satin powder-coated textures.',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    overlayColor: 'rgba(24, 24, 27, 0.4)',
    filterCss: 'grayscale(0.85) contrast(1.25) brightness(0.82)',
    accentBadgeColor: '#27272A',
  },
  'Stealth Black': {
    primaryHex: '#111827',
    secondaryHex: '#374151',
    finish: 'Stealth',
    finishLabel: 'Midnight Stealth Edition',
    description: 'Tactical dark appearance with 3D dark chrome Hero emblem accents.',
    glowColor: 'rgba(255, 255, 255, 0.12)',
    overlayColor: 'rgba(17, 24, 39, 0.45)',
    filterCss: 'grayscale(0.9) contrast(1.3) brightness(0.8)',
    accentBadgeColor: '#374151',
  },
  'Phantom Black': {
    primaryHex: '#0F172A',
    secondaryHex: '#1E293B',
    finish: 'Metallic',
    finishLabel: 'Metallic Phantom Black',
    description: 'Mirror-finish gloss black infused with microscopic silver pearl flakes.',
    glowColor: 'rgba(148, 163, 184, 0.25)',
    overlayColor: 'rgba(15, 23, 42, 0.35)',
    filterCss: 'contrast(1.25) brightness(0.85) saturate(0.5)',
    accentBadgeColor: '#1E293B',
  },
  'Panther Black': {
    primaryHex: '#171717',
    finish: 'Gloss',
    finishLabel: 'Glossy Panther Black',
    description: 'Deep, lustrous piano black reflecting showroom lighting with crisp reflections.',
    glowColor: 'rgba(255, 255, 255, 0.18)',
    overlayColor: 'rgba(23, 23, 23, 0.35)',
    filterCss: 'contrast(1.2) brightness(0.85)',
    accentBadgeColor: '#262626',
  },
  'Stallion Black': {
    primaryHex: '#1C1917',
    secondaryHex: '#44403C',
    finish: 'Metallic',
    finishLabel: 'Stallion Obsidian Black',
    description: 'Heritage dark tone celebrating muscular proportions with metallic depth.',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    overlayColor: 'rgba(28, 25, 23, 0.35)',
    filterCss: 'contrast(1.2) brightness(0.85)',
    accentBadgeColor: '#44403C',
  },
  'Gloss Black': {
    primaryHex: '#0A0A0A',
    finish: 'Gloss',
    finishLabel: 'Deep Gloss Black',
    description: 'Ultra-glossy clearcoat over pure carbon black substrate.',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    overlayColor: 'rgba(10, 10, 10, 0.4)',
    filterCss: 'contrast(1.3) brightness(0.8)',
    accentBadgeColor: '#171717',
  },

  // Dual Tone Blacks
  'Black with Sports Red': {
    primaryHex: '#18181B',
    secondaryHex: '#E11D23',
    finish: 'Dual Tone',
    finishLabel: 'Dual Tone Black & Sports Red',
    description: 'Aggressive onyx black base with racing-inspired red tank graphics and rim decals.',
    glowColor: 'rgba(225, 29, 35, 0.35)',
    overlayColor: 'rgba(225, 29, 35, 0.18)',
    filterCss: 'saturate(1.1) contrast(1.1)',
    accentBadgeColor: '#E11D23',
  },
  'Black with Silver': {
    primaryHex: '#18181B',
    secondaryHex: '#CBD5E1',
    finish: 'Dual Tone',
    finishLabel: 'Dual Tone Black & Silver',
    description: 'Timeless commuter combination with brushed silver graphic pinstripes.',
    glowColor: 'rgba(203, 213, 225, 0.35)',
    overlayColor: 'rgba(203, 213, 225, 0.15)',
    filterCss: 'contrast(1.15) brightness(0.92)',
    accentBadgeColor: '#94A3B8',
  },
  'Black with Purple': {
    primaryHex: '#18181B',
    secondaryHex: '#9333EA',
    finish: 'Dual Tone',
    finishLabel: 'Dual Tone Black & Royal Purple',
    description: 'Distinctive Hero heritage graphic pairing royal violet decals with jet black.',
    glowColor: 'rgba(147, 51, 234, 0.38)',
    overlayColor: 'rgba(147, 51, 234, 0.22)',
    filterCss: 'hue-rotate(250deg) saturate(1.15) contrast(1.1)',
    accentBadgeColor: '#9333EA',
  },
  'Black with Red': {
    primaryHex: '#18181B',
    secondaryHex: '#DC2626',
    finish: 'Dual Tone',
    finishLabel: 'Dual Tone Black & Scarlet Red',
    description: 'Classic high-contrast graphics that enhance muscular fuel tank lines.',
    glowColor: 'rgba(220, 38, 38, 0.35)',
    overlayColor: 'rgba(220, 38, 38, 0.18)',
    filterCss: 'saturate(1.1) contrast(1.1)',
    accentBadgeColor: '#DC2626',
  },
  'Dual Tone Black Red': {
    primaryHex: '#111827',
    secondaryHex: '#E11D23',
    finish: 'Dual Tone',
    finishLabel: 'Factory Dual-Tone Black & Red',
    description: 'Two-tone split fairing scheme matching front fender with side cowls.',
    glowColor: 'rgba(225, 29, 35, 0.38)',
    overlayColor: 'rgba(225, 29, 35, 0.2)',
    filterCss: 'saturate(1.15) contrast(1.12)',
    accentBadgeColor: '#E11D23',
  },
  'Gloss Black Gold': {
    primaryHex: '#18181B',
    secondaryHex: '#F59E0B',
    finish: 'Dual Tone',
    finishLabel: 'Royal Gloss Black & Gold',
    description: 'Prestigious black treatment highlighted by 3D gold insignia and pinstriping.',
    glowColor: 'rgba(245, 158, 11, 0.38)',
    overlayColor: 'rgba(245, 158, 11, 0.18)',
    filterCss: 'sepia(0.2) contrast(1.15) brightness(0.9)',
    accentBadgeColor: '#F59E0B',
  },
  'Black with Force Silver': {
    primaryHex: '#1E293B',
    secondaryHex: '#E2E8F0',
    finish: 'Dual Tone',
    finishLabel: 'Black & Force Silver Metallic',
    description: 'Modern metallic contrast designed for high urban visibility.',
    glowColor: 'rgba(226, 232, 240, 0.3)',
    overlayColor: 'rgba(226, 232, 240, 0.12)',
    filterCss: 'contrast(1.15)',
    accentBadgeColor: '#94A3B8',
  },

  // Blues
  'Nexus Blue': {
    primaryHex: '#1D4ED8',
    secondaryHex: '#60A5FA',
    finish: 'Metallic',
    finishLabel: 'Metallic Nexus Blue',
    description: 'Vibrant cobalt blue with fine aluminum flakes delivering brilliant depth.',
    glowColor: 'rgba(29, 78, 216, 0.45)',
    overlayColor: 'rgba(29, 78, 216, 0.28)',
    filterCss: 'hue-rotate(200deg) saturate(1.3) contrast(1.1)',
    accentBadgeColor: '#2563EB',
  },
  'Matte Nexus Blue': {
    primaryHex: '#1E40AF',
    finish: 'Matte',
    finishLabel: 'Matte Adventure Blue',
    description: 'Rugged outdoor matte blue engineered to resist dust, mud, and trail scratches.',
    glowColor: 'rgba(30, 64, 175, 0.42)',
    overlayColor: 'rgba(30, 64, 175, 0.25)',
    filterCss: 'hue-rotate(205deg) saturate(1.15) contrast(1.05)',
    accentBadgeColor: '#1E40AF',
  },
  'Polestar Blue': {
    primaryHex: '#0284C7',
    secondaryHex: '#38BDF8',
    finish: 'Metallic',
    finishLabel: 'Dynamic Polestar Cyan Blue',
    description: 'Electrifying sky-to-ocean gradient tone full of youth and vitality.',
    glowColor: 'rgba(2, 132, 199, 0.48)',
    overlayColor: 'rgba(2, 132, 199, 0.28)',
    filterCss: 'hue-rotate(185deg) saturate(1.35) contrast(1.08)',
    accentBadgeColor: '#0284C7',
  },
  'Cobalt Blue': {
    primaryHex: '#2563EB',
    finish: 'Gloss',
    finishLabel: 'Electric Cobalt Blue',
    description: 'High-contrast sport blue designed for racetrack aerodynamics and excitement.',
    glowColor: 'rgba(37, 99, 235, 0.48)',
    overlayColor: 'rgba(37, 99, 235, 0.3)',
    filterCss: 'hue-rotate(210deg) saturate(1.4) contrast(1.1)',
    accentBadgeColor: '#2563EB',
  },
  'Celestial Blue': {
    primaryHex: '#1E3A8A',
    secondaryHex: '#60A5FA',
    finish: 'Metallic',
    finishLabel: 'Celestial Metallic Navy',
    description: 'Deep midnight navy blue with starlight metallic sparkles under direct illumination.',
    glowColor: 'rgba(30, 58, 138, 0.5)',
    overlayColor: 'rgba(30, 58, 138, 0.32)',
    filterCss: 'hue-rotate(215deg) saturate(1.2) contrast(1.15) brightness(0.92)',
    accentBadgeColor: '#1E3A8A',
  },
  'Techno Blue': {
    primaryHex: '#0284C7',
    secondaryHex: '#1E293B',
    finish: 'Dual Tone',
    finishLabel: 'Techno Digital Blue',
    description: 'Futuristic electric blue accents highlighting tech-first ergonomics.',
    glowColor: 'rgba(2, 132, 199, 0.42)',
    overlayColor: 'rgba(2, 132, 199, 0.26)',
    filterCss: 'hue-rotate(190deg) saturate(1.3) contrast(1.08)',
    accentBadgeColor: '#0284C7',
  },
  'Sparkling Beta Blue': {
    primaryHex: '#3B82F6',
    finish: 'Metallic',
    finishLabel: 'Sparkling Beta Cyan',
    description: 'Luminous blue with glass-bead clearcoat reflecting vivid blue rays.',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    overlayColor: 'rgba(59, 130, 246, 0.28)',
    filterCss: 'hue-rotate(195deg) saturate(1.3) contrast(1.05)',
    accentBadgeColor: '#3B82F6',
  },
  'Bluish Teal': {
    primaryHex: '#0D9488',
    secondaryHex: '#2DD4BF',
    finish: 'Metallic',
    finishLabel: 'Jeweled Teal Cyan',
    description: 'Chic urban teal blending green and blue pigments for an upscale aesthetic.',
    glowColor: 'rgba(13, 148, 136, 0.45)',
    overlayColor: 'rgba(13, 148, 136, 0.26)',
    filterCss: 'hue-rotate(160deg) saturate(1.25) contrast(1.05)',
    accentBadgeColor: '#0D9488',
  },

  // Whites
  'Pearl White': {
    primaryHex: '#F8FAFC',
    secondaryHex: '#E2E8F0',
    finish: 'Pearl',
    finishLabel: 'Luminous Pearl White',
    description: 'Pristine multi-layer white with iridescent mica flakes providing a mother-of-pearl sheen.',
    glowColor: 'rgba(255, 255, 255, 0.55)',
    overlayColor: 'rgba(255, 255, 255, 0.25)',
    filterCss: 'brightness(1.15) contrast(1.05)',
    accentBadgeColor: '#E2E8F0',
    isLightShade: true,
  },
  'Pearl White Gloss': {
    primaryHex: '#FFFFFF',
    secondaryHex: '#CBD5E1',
    finish: 'Pearl',
    finishLabel: 'Gloss Pearl Diamond White',
    description: 'Crystal-clear gloss topcoat over brilliant pure white basecoat.',
    glowColor: 'rgba(255, 255, 255, 0.6)',
    overlayColor: 'rgba(255, 255, 255, 0.28)',
    filterCss: 'brightness(1.18) contrast(1.08)',
    accentBadgeColor: '#E2E8F0',
    isLightShade: true,
  },
  'Pearl Silver White': {
    primaryHex: '#F1F5F9',
    secondaryHex: '#94A3B8',
    finish: 'Pearl',
    finishLabel: 'Pearl Silver Diamond White',
    description: 'Refined silver-white tone with elegant cool undertones.',
    glowColor: 'rgba(241, 245, 249, 0.5)',
    overlayColor: 'rgba(241, 245, 249, 0.22)',
    filterCss: 'brightness(1.12) contrast(1.06)',
    accentBadgeColor: '#94A3B8',
    isLightShade: true,
  },
  'Arctic White': {
    primaryHex: '#F8FAFC',
    secondaryHex: '#18181B',
    finish: 'Gloss',
    finishLabel: 'Arctic Polar White',
    description: 'High-contrast pure white contrasting against blacked-out roadster engine block.',
    glowColor: 'rgba(255, 255, 255, 0.55)',
    overlayColor: 'rgba(255, 255, 255, 0.25)',
    filterCss: 'brightness(1.15) contrast(1.1)',
    accentBadgeColor: '#E2E8F0',
    isLightShade: true,
  },
  'Pro White': {
    primaryHex: '#F8FAFC',
    secondaryHex: '#E11D23',
    finish: 'Dual Tone',
    finishLabel: 'Rally Pro White & Red',
    description: 'Dakar Rally-inspired factory competition livery on bright white bodywork.',
    glowColor: 'rgba(255, 255, 255, 0.5)',
    overlayColor: 'rgba(255, 255, 255, 0.22)',
    filterCss: 'brightness(1.12) contrast(1.08)',
    accentBadgeColor: '#E11D23',
    isLightShade: true,
  },
  'Matte White': {
    primaryHex: '#F1F5F9',
    finish: 'Matte',
    finishLabel: 'Satin Matte White',
    description: 'Modern high-tech satin finish popular in flagship electric scooters.',
    glowColor: 'rgba(255, 255, 255, 0.45)',
    overlayColor: 'rgba(241, 245, 249, 0.2)',
    filterCss: 'brightness(1.1) contrast(0.98)',
    accentBadgeColor: '#CBD5E1',
    isLightShade: true,
  },

  // Yellows & Golds
  'Iconic Yellow': {
    primaryHex: '#EAB308',
    secondaryHex: '#18181B',
    finish: 'Gloss',
    finishLabel: 'Iconic Heritage Yellow',
    description: 'The legendary Karizma racing yellow revived with modern metallic depth and swagger.',
    glowColor: 'rgba(234, 179, 8, 0.55)',
    overlayColor: 'rgba(234, 179, 8, 0.32)',
    filterCss: 'hue-rotate(50deg) saturate(1.4) contrast(1.08)',
    accentBadgeColor: '#EAB308',
  },
  'Jubilant Yellow': {
    primaryHex: '#FACC15',
    secondaryHex: '#CA8A04',
    finish: 'Metallic',
    finishLabel: 'Jubilant Golden Yellow',
    description: 'Warm, cheerful metallic sunlight yellow exuding urban friendliness.',
    glowColor: 'rgba(250, 204, 21, 0.5)',
    overlayColor: 'rgba(250, 204, 21, 0.3)',
    filterCss: 'hue-rotate(55deg) saturate(1.35) contrast(1.05)',
    accentBadgeColor: '#EAB308',
  },

  // Oranges
  'Matt Abrax Orange': {
    primaryHex: '#F97316',
    secondaryHex: '#C2410C',
    finish: 'Matte',
    finishLabel: 'Flagship Matte Abrax Orange',
    description: 'Signature electric mobility hero color with bold saturation and satin touch.',
    glowColor: 'rgba(249, 115, 22, 0.55)',
    overlayColor: 'rgba(249, 115, 22, 0.32)',
    filterCss: 'hue-rotate(30deg) saturate(1.4) contrast(1.08)',
    accentBadgeColor: '#F97316',
  },

  // Greys & Bronzes
  'Tornado Grey': {
    primaryHex: '#4B5563',
    secondaryHex: '#1F2937',
    finish: 'Metallic',
    finishLabel: 'Metallic Tornado Grey',
    description: 'Industrial charcoal grey with strong metallic highlights on tank shoulders.',
    glowColor: 'rgba(107, 114, 128, 0.35)',
    overlayColor: 'rgba(75, 85, 99, 0.25)',
    filterCss: 'grayscale(0.6) contrast(1.15) brightness(0.95)',
    accentBadgeColor: '#6B7280',
  },
  'Heavy Grey with Green': {
    primaryHex: '#4B5563',
    secondaryHex: '#22C55E',
    finish: 'Dual Tone',
    finishLabel: 'Heavy Grey & Acid Green',
    description: 'Contemporary urban slate grey accented by vibrant lime green graphics.',
    glowColor: 'rgba(34, 197, 94, 0.38)',
    overlayColor: 'rgba(34, 197, 94, 0.18)',
    filterCss: 'hue-rotate(100deg) saturate(1.15) contrast(1.1)',
    accentBadgeColor: '#22C55E',
  },
  'Heavy Grey with Black': {
    primaryHex: '#374151',
    secondaryHex: '#111827',
    finish: 'Dual Tone',
    finishLabel: 'Dual Tone Grey & Black',
    description: 'Stealth commuter aesthetic combining graphite grey with midnight black.',
    glowColor: 'rgba(156, 163, 175, 0.25)',
    overlayColor: 'rgba(55, 65, 81, 0.3)',
    filterCss: 'grayscale(0.7) contrast(1.18)',
    accentBadgeColor: '#4B5563',
  },
  'Chestnut Bronze': {
    primaryHex: '#78350F',
    secondaryHex: '#B45309',
    finish: 'Metallic',
    finishLabel: 'Luxury Metallic Chestnut Bronze',
    description: 'Executive metallic copper bronze providing premium presence on city streets.',
    glowColor: 'rgba(180, 83, 9, 0.45)',
    overlayColor: 'rgba(120, 53, 15, 0.35)',
    filterCss: 'sepia(0.55) saturate(1.2) contrast(1.12) hue-rotate(-20deg)',
    accentBadgeColor: '#B45309',
  },
  'Matt Vernier Grey': {
    primaryHex: '#6B7280',
    finish: 'Matte',
    finishLabel: 'Matt Vernier Titanium Grey',
    description: 'Sophisticated matte titanium finish that repels fingerprints and micro-scratches.',
    glowColor: 'rgba(156, 163, 175, 0.32)',
    overlayColor: 'rgba(107, 114, 128, 0.22)',
    filterCss: 'grayscale(0.7) contrast(1.05) brightness(0.98)',
    accentBadgeColor: '#6B7280',
  },
  'Neon Green': {
    primaryHex: '#10B981',
    secondaryHex: '#059669',
    finish: 'Gloss',
    finishLabel: 'Electric Neon Lime',
    description: 'High-visibility fluorescent neon engineered to command immediate attention.',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    overlayColor: 'rgba(16, 185, 129, 0.3)',
    filterCss: 'hue-rotate(110deg) saturate(1.4) contrast(1.08)',
    accentBadgeColor: '#10B981',
  },
};

/**
 * Parses any color name string and returns a complete ColorProfile
 * with exact hex swatches, finish type, description, and dynamic CSS filters.
 */
export function getColorProfile(colorName: string): ColorProfile {
  const trimmed = (colorName || '').trim();
  
  // Exact match
  if (KNOWN_COLOR_PROFILES[trimmed]) {
    const known = KNOWN_COLOR_PROFILES[trimmed];
    return {
      name: trimmed,
      primaryHex: known.primaryHex || '#D6181F',
      secondaryHex: known.secondaryHex,
      finish: known.finish || 'Gloss',
      finishLabel: known.finishLabel || `${trimmed} Finish`,
      description: known.description || `Official Hero MotoCorp factory ${trimmed} paint.`,
      glowColor: known.glowColor || 'rgba(214, 24, 31, 0.35)',
      overlayColor: known.overlayColor || 'rgba(214, 24, 31, 0.2)',
      filterCss: known.filterCss || 'saturate(1.1)',
      accentBadgeColor: known.accentBadgeColor || '#D6181F',
      isLightShade: known.isLightShade || false,
    };
  }

  // Case-insensitive / Substring match
  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(KNOWN_COLOR_PROFILES)) {
    if (lower === key.toLowerCase()) {
      return {
        name: trimmed,
        primaryHex: val.primaryHex || '#D6181F',
        secondaryHex: val.secondaryHex,
        finish: val.finish || 'Gloss',
        finishLabel: val.finishLabel || `${trimmed} Finish`,
        description: val.description || `Official Hero MotoCorp factory ${trimmed} paint.`,
        glowColor: val.glowColor || 'rgba(214, 24, 31, 0.35)',
        overlayColor: val.overlayColor || 'rgba(214, 24, 31, 0.2)',
        filterCss: val.filterCss || 'saturate(1.1)',
        accentBadgeColor: val.accentBadgeColor || '#D6181F',
        isLightShade: val.isLightShade || false,
      };
    }
  }

  // Dynamic fallback inference based on keywords
  let primaryHex = '#D6181F';
  let secondaryHex: string | undefined = undefined;
  let finish: ColorProfile['finish'] = 'Gloss';
  let glowColor = 'rgba(214, 24, 31, 0.35)';
  let overlayColor = 'rgba(214, 24, 31, 0.2)';
  let filterCss = 'saturate(1.1)';
  let accentBadgeColor = '#D6181F';
  let isLightShade = false;

  if (lower.includes('matte') || lower.includes('matt')) {
    finish = 'Matte';
  } else if (lower.includes('metallic')) {
    finish = 'Metallic';
  } else if (lower.includes('pearl')) {
    finish = 'Pearl';
    isLightShade = true;
  } else if (lower.includes('with') || lower.includes('dual') || lower.includes('&')) {
    finish = 'Dual Tone';
  }

  if (lower.includes('red') || lower.includes('crimson') || lower.includes('scarlet')) {
    primaryHex = '#DC2626';
    glowColor = 'rgba(220, 38, 38, 0.45)';
    overlayColor = 'rgba(220, 38, 38, 0.28)';
    filterCss = 'saturate(1.2) contrast(1.08)';
    accentBadgeColor = '#DC2626';
  } else if (lower.includes('blue') || lower.includes('teal') || lower.includes('cyan')) {
    primaryHex = '#2563EB';
    glowColor = 'rgba(37, 99, 235, 0.45)';
    overlayColor = 'rgba(37, 99, 235, 0.28)';
    filterCss = 'hue-rotate(200deg) saturate(1.3) contrast(1.08)';
    accentBadgeColor = '#2563EB';
  } else if (lower.includes('white') || lower.includes('silver')) {
    primaryHex = '#F8FAFC';
    glowColor = 'rgba(255, 255, 255, 0.55)';
    overlayColor = 'rgba(255, 255, 255, 0.22)';
    filterCss = 'brightness(1.15) contrast(1.05)';
    accentBadgeColor = '#CBD5E1';
    isLightShade = true;
  } else if (lower.includes('black') || lower.includes('dark') || lower.includes('stealth')) {
    primaryHex = '#18181B';
    glowColor = 'rgba(255, 255, 255, 0.15)';
    overlayColor = 'rgba(24, 24, 27, 0.4)';
    filterCss = 'contrast(1.2) brightness(0.85)';
    accentBadgeColor = '#3F3F46';
  } else if (lower.includes('yellow') || lower.includes('gold')) {
    primaryHex = '#EAB308';
    glowColor = 'rgba(234, 179, 8, 0.5)';
    overlayColor = 'rgba(234, 179, 8, 0.3)';
    filterCss = 'hue-rotate(50deg) saturate(1.35) contrast(1.08)';
    accentBadgeColor = '#EAB308';
  } else if (lower.includes('orange')) {
    primaryHex = '#F97316';
    glowColor = 'rgba(249, 115, 22, 0.5)';
    overlayColor = 'rgba(249, 115, 22, 0.3)';
    filterCss = 'hue-rotate(25deg) saturate(1.35) contrast(1.08)';
    accentBadgeColor = '#F97316';
  } else if (lower.includes('green') || lower.includes('lime')) {
    primaryHex = '#10B981';
    glowColor = 'rgba(16, 185, 129, 0.48)';
    overlayColor = 'rgba(16, 185, 129, 0.28)';
    filterCss = 'hue-rotate(110deg) saturate(1.3) contrast(1.08)';
    accentBadgeColor = '#10B981';
  } else if (lower.includes('grey') || lower.includes('gray')) {
    primaryHex = '#4B5563';
    glowColor = 'rgba(107, 114, 128, 0.35)';
    overlayColor = 'rgba(75, 85, 99, 0.25)';
    filterCss = 'grayscale(0.6) contrast(1.12)';
    accentBadgeColor = '#6B7280';
  }

  // Check for second color in dual-tone
  if (lower.includes('with') || lower.includes('dual')) {
    if (lower.includes('red')) secondaryHex = '#DC2626';
    else if (lower.includes('silver')) secondaryHex = '#CBD5E1';
    else if (lower.includes('purple')) secondaryHex = '#9333EA';
    else if (lower.includes('green')) secondaryHex = '#22C55E';
    else if (lower.includes('blue')) secondaryHex = '#3B82F6';
    else if (lower.includes('black')) secondaryHex = '#18181B';
    else if (lower.includes('gold')) secondaryHex = '#F59E0B';
  }

  return {
    name: trimmed,
    primaryHex,
    secondaryHex,
    finish,
    finishLabel: `${finish} Factory Coat`,
    description: `Official Hero MotoCorp factory formulation with premium UV-resistant clearcoat.`,
    glowColor,
    overlayColor,
    filterCss,
    accentBadgeColor,
    isLightShade,
  };
}
