# Asset Folder Instructions

## Starfield Images

**Location**: `/public/assets/starfield/`

**Required Files**:
- `starfield-01.jpg` - Main starfield background (1440x3240 portrait)
- `starfield-02.jpg` - Alternative starfield background (1440x3240 portrait)
- `starfield-nebula.jpg` - Nebula variant for cosmic moods (1440x3240 portrait)

**Specifications**:
- **Resolution**: 1440x3240 pixels (mobile portrait orientation)
- **Format**: JPEG for optimal file size
- **Color space**: sRGB
- **Quality**: 85-90% to balance quality and file size
- **File size**: Target 200-500KB per image

**Visual Requirements**:
- Deep space starfield with realistic star distribution
- Subtle color variations (blues, purples, hints of distant galaxies)
- No bright stars that would distract from foreground content
- Seamless tiling capability for infinite scroll effects
- Dark enough to serve as background without overwhelming UI elements

## Sky Videos

**Location**: `/public/assets/sky/[category]/`

**Categories**: neutral, growth, fracture, healing, cosmic, bloom, shadow, energy, seasonal

**Naming Convention**: `sky-[category]-[01-20][variant].mp4`
- Example: `sky-neutral-01a.mp4`, `sky-cosmic-15b.mp4`

**Specifications**:
- **Resolution**: 1440x3240 pixels (mobile portrait)
- **Duration**: 10-30 seconds (seamless loop)
- **Frame rate**: 30fps
- **Codec**: H.264 with high compatibility
- **Bitrate**: 2-4 Mbps for quality balance
- **Audio**: None (muted videos)

## Ground Videos

**Location**: `/public/assets/ground/[category]/`

**Categories**: neutral, growth, fracture, healing, cosmic, bloom, shadow, energy, seasonal

**Naming Convention**: `ground-[category]-[01-20][variant].mp4`
- Example: `ground-neutral-01a.mp4`, `ground-healing-08c.mp4`

**Specifications**:
- **Resolution**: 1440x3240 pixels (mobile portrait)
- **Duration**: 10-30 seconds (seamless loop)
- **Frame rate**: 30fps
- **Codec**: H.264 with high compatibility
- **Bitrate**: 2-4 Mbps for quality balance
- **Audio**: None (muted videos)
- **Masking**: Content should work with top 50% fade mask
- **Composition**: Important visual elements in bottom half of frame

## Performance Considerations

**File Size Targets**:
- Starfield images: 200-500KB each
- Sky videos: 2-8MB each (depending on duration)
- Ground videos: 2-8MB each (depending on duration)

**Optimization**:
- Use web-optimized compression
- Consider multiple quality versions for battery optimization
- Implement progressive loading for better user experience

## Asset Deployment

1. Place assets in respective folders under `/public/assets/`
2. Update manifest files if adding new categories or changing structure
3. Test loading performance on mobile devices
4. Verify smooth playback and transitions