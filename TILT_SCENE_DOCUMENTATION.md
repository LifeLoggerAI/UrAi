# Tilt-Based Cinematic Scene System

The UrAi app includes a sophisticated tilt-based cinematic scene system that responds to device orientation to create immersive visual experiences.

## Features

### 🎬 Orientation-Based Scene Modes
- **Sky Mode**: Activated when tilting device up (-30° or more)
- **Horizon Mode**: Default mode when device is level (±15°)
- **Ground Mode**: Activated when tilting device down (+30° or more)

### 🎨 Multi-Layer Rendering System
1. **Starfield Background**: Always visible with varying opacity
2. **Sky Video Layer**: Fades in/out based on tilt angle  
3. **Horizon Fog Band**: CSS gradient overlay for atmospheric effect
4. **Ground Video Layer**: Masked at top for seamless blending

### ⚡ Performance Optimizations
- **Battery Awareness**: Reduces video quality when battery is low
- **Throttled Updates**: Limits orientation processing to 100ms intervals
- **Adaptive Quality**: Adjusts video preloading based on device capabilities
- **Memory Management**: Proper cleanup of event listeners and timeouts

### 🔧 Technical Implementation

#### Device Orientation Detection
```typescript
// Handles iOS 13+ permission requirements
const requestOrientationPermission = async () => {
  if ('requestPermission' in DeviceOrientationEvent) {
    const permission = await DeviceOrientationEvent.requestPermission();
    return permission === 'granted';
  }
  return true;
};
```

#### Tilt Angle Thresholds
```typescript
const TILT_THRESHOLDS = {
  SKY_ANGLE: -30,     // Look up significantly to show sky
  GROUND_ANGLE: 30,   // Look down significantly to show ground
  HORIZON_RANGE: 15,  // Within this range shows horizon mode
};
```

#### Layer Opacity Calculation
Smooth transitions between modes are achieved through calculated opacity values:
- Sky opacity decreases as device tilts down
- Ground opacity increases as device tilts down
- Horizon fog appears strongest in level position

## Usage

### Basic Integration
```tsx
import TiltScene from '@/components/tilt-scene';

function MyComponent() {
  const [currentMode, setCurrentMode] = useState('horizon');
  
  return (
    <TiltScene
      skyCategory="cosmic"
      groundCategory="healing"
      skyIndex={5}
      groundIndex={3}
      skyVariant="a"
      groundVariant="b"
      onModeChange={setCurrentMode}
      enableBatteryOptimization={true}
      enablePerformanceOptimization={true}
    />
  );
}
```

### HomeView Integration
The main HomeView component includes a toggle to switch between traditional video layers and the new tilt-based system:

```tsx
// Toggle in UI controls
<label className="flex items-center gap-2 text-xs">
  <input 
    type="checkbox" 
    checked={useTiltScene} 
    onChange={(e) => setUseTiltScene(e.target.checked)} 
  />
  Enable Tilt Scene
</label>
```

## Asset Requirements

### Video Assets
All video assets must meet specific requirements for optimal performance:

- **Resolution**: 1440x3240 pixels (mobile portrait)
- **Duration**: 10-30 seconds with seamless looping
- **Format**: H.264 MP4, 2-4 Mbps bitrate
- **Audio**: None (muted videos)

### Ground Video Masking
Ground videos are automatically masked at the top using CSS:
```css
mask-image: linear-gradient(
  to bottom, 
  transparent 0%, 
  rgba(0,0,0,0.5) 30%, 
  rgba(0,0,0,1) 50%, 
  rgba(0,0,0,1) 100%
);
```

### Starfield Backgrounds
- **Location**: `/public/assets/starfield/`
- **Format**: JPEG images, 1440x3240 resolution
- **Fallback**: CSS-generated starfield for enhanced reliability

## Browser Support

### Device Orientation API
- ✅ iOS Safari 13+ (with permission prompt)
- ✅ Android Chrome/Firefox
- ✅ Modern desktop browsers (limited functionality)
- ❌ IE/Edge Legacy

### Battery API (Optional)
- ✅ Chrome/Edge (experimental)
- ❌ Safari/Firefox (graceful degradation)

## Development

### Demo Page
Visit `/tilt-demo` to test the tilt functionality with debugging controls.

### Debug Mode
In development, debug information is displayed showing:
- Current tilt mode
- Device orientation angles (beta, gamma)
- Battery level and optimization status
- Layer opacity values

### Testing
```bash
# Type checking
npm run typecheck

# Build test
npm run build

# Development server
npm run dev
```

## Troubleshooting

### iOS Permission Issues
On iOS 13+, users must grant device orientation permission. The component handles this automatically but may require user interaction.

### Video Loading Problems
The system includes error handling for failed video loads and provides fallback behaviors.

### Performance Issues
Enable performance optimizations to reduce orientation update frequency and adjust video quality based on device capabilities.

## Future Enhancements

- [ ] Gesture-based mode switching as fallback
- [ ] Advanced physics-based transitions
- [ ] Multi-device synchronization
- [ ] VR/AR integration capabilities
- [ ] Custom tilt threshold configuration
- [ ] Haptic feedback integration