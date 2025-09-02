# Ground Video Specification for Media Team

## Overview

This document specifies the technical and creative requirements for ground layer videos in the tilt-based cinematic scene system. Ground videos appear when users tilt their device downward and serve as the foreground/base layer of the scene composition.

## Technical Specifications

### Video Format
- **Resolution**: 1440x3240 pixels (mobile portrait orientation)
- **Aspect Ratio**: 4.5:7.2 (mobile optimized)
- **Frame Rate**: 30fps (consistent across all videos)
- **Duration**: 10-30 seconds (must loop seamlessly)
- **Codec**: H.264 (Main Profile, Level 4.0)
- **Container**: MP4
- **Bitrate**: 2-4 Mbps (target 3 Mbps for quality/size balance)
- **Audio**: None (all videos are muted)

### File Naming Convention
`ground-[category]-[01-20][variant].mp4`

**Examples**:
- `ground-neutral-01a.mp4`
- `ground-healing-15b.mp4` 
- `ground-cosmic-20c.mp4`

### Categories (9 total)
1. **neutral** - Calm, balanced, everyday environments
2. **growth** - Thriving, flourishing, expansive scenes
3. **fracture** - Broken, fragmented, challenging landscapes
4. **healing** - Restorative, peaceful, nurturing environments
5. **cosmic** - Otherworldly, space-like, mystical terrains
6. **bloom** - Flowering, colorful, life-affirming scenes
7. **shadow** - Dark, introspective, mysterious environments
8. **energy** - Dynamic, electric, high-vibrancy scenes
9. **seasonal** - Time-based, cyclical, nature-focused

### Variants
- **a**: Primary/default version
- **b**: Alternative composition or lighting
- **c**: Tertiary variant (optional, for variety)

## Creative Guidelines

### Composition Requirements

#### Top Half Masking
- **Critical**: Ground videos use a gradient mask that fades from transparent (top) to opaque (bottom)
- **Fade zone**: Top 30% of frame should be expendable/maskable
- **Safe zone**: Bottom 70% contains primary visual content
- **Transition**: Smooth gradient from 0% opacity at top to 100% at 50% height

#### Visual Elements
- **Foreground focus**: Content should feel close and tactile
- **Depth layers**: Multiple visual planes for richness
- **Movement**: Subtle, organic motion (avoid jarring movements)
- **Texture**: Rich surface details that reward close viewing
- **Scale**: Elements should feel appropriately sized for "ground level" perspective

### Category-Specific Guidelines

#### neutral
- Natural earth tones, grass, stone, sand
- Gentle movement (wind through grass, subtle water flow)
- Balanced lighting, neither stark nor dramatic
- Timeless, universal appeal

#### growth
- Lush vegetation, sprouting plants, flowing water
- Upward movement, expansion, organic growth patterns
- Fresh greens, earth tones, life-affirming colors
- Energy that suggests progress and development

#### fracture
- Cracked earth, broken stone, scattered debris
- Angular, fragmented compositions
- Harsh lighting, stark contrasts
- Movement that suggests instability or decay

#### healing
- Soft moss, flowing water, gentle plant life
- Circular, embracing compositions
- Warm, nurturing colors (soft greens, blues, earth tones)
- Slow, meditative movement patterns

#### cosmic
- Otherworldly terrains, crystal formations, alien landscapes
- Mysterious lighting, ethereal glows
- Deep purples, blues, cosmic colors
- Hypnotic, transcendent movement

#### bloom
- Flowers, colorful plant life, abundant nature
- Organic, curved compositions
- Vibrant colors, high saturation
- Celebratory, joyful movement

#### shadow
- Dark wood, stone, mysterious textures
- Deep shadows, dramatic lighting
- Muted colors, high contrast
- Introspective, contemplative movement

#### energy
- Electric, dynamic surfaces, flowing energy
- Bold, energetic compositions
- Bright, saturated colors
- Fast, dynamic movement patterns

#### seasonal
- Time-based changes, natural cycles
- Lighting that suggests specific seasons
- Seasonal colors and textures
- Movement that reflects natural rhythms

## Performance Optimization

### Battery Optimization
- Provide multiple quality versions if possible:
  - High quality: 3-4 Mbps, full resolution
  - Medium quality: 2-3 Mbps, slightly reduced bitrate
  - Low quality: 1-2 Mbps, optimized for battery saving

### Seamless Looping
- **First/last frame**: Must be identical or nearly identical
- **Motion continuity**: Movement should flow naturally from end to beginning
- **Lighting consistency**: No sudden changes in lighting or exposure
- **Test requirement**: Each video must play continuously for 5+ minutes without visible seams

## Quality Assurance

### Technical Checklist
- [ ] Resolution exactly 1440x3240
- [ ] Frame rate stable at 30fps
- [ ] Duration between 10-30 seconds
- [ ] Seamless loop verified
- [ ] File size under 10MB
- [ ] No audio track present
- [ ] H.264 codec, MP4 container

### Creative Checklist
- [ ] Top 30% appropriate for masking
- [ ] Important visual elements in bottom 70%
- [ ] Smooth, organic movement
- [ ] Category-appropriate mood and colors
- [ ] Rich texture and depth
- [ ] Professional lighting and composition

### Integration Testing
- [ ] Loads properly in web browser
- [ ] Smooth transition with sky layer
- [ ] Proper masking effect when overlaid
- [ ] Good performance on mobile devices
- [ ] Appropriate mood when combined with starfield background

## Delivery Requirements

### File Organization
```
ground/
├── neutral/
│   ├── ground-neutral-01a.mp4
│   ├── ground-neutral-01b.mp4
│   └── ... (up to 20 per category)
├── growth/
├── fracture/
├── healing/
├── cosmic/
├── bloom/
├── shadow/
├── energy/
└── seasonal/
```

### Metadata
For each video, provide:
- Brief description (1-2 sentences)
- Primary colors used
- Mood keywords (3-5 words)
- Technical notes if applicable

## Examples and References

### Mood References
- **neutral**: "Gentle grass field with soft breeze"
- **growth**: "Moss growing on stones with water droplets"
- **fracture**: "Cracked desert earth with heat shimmer"
- **healing**: "Smooth river stones with gentle water flow"
- **cosmic**: "Crystalline formations with inner glow"

### Technical References
- Use industry standard color grading
- Ensure mobile device compatibility
- Test on actual devices, not just desktop browsers
- Consider varying network conditions during playback

## Support and Questions

For technical questions regarding video encoding or delivery, contact the development team.
For creative direction questions, consult with the design lead.

All assets should be delivered via the established media pipeline with appropriate previews for approval before final integration.