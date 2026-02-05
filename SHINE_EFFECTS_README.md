# Shine Effects Implementation

This implementation provides `preFX.addReveal()` and `preFX.addWipe()`-like functionality for PixiJS v7, optimized for performance when running on multiple sprites simultaneously (e.g., 22 sprites).

## Features

- **Reveal Effect**: Reveals sprites from one direction to another
- **Wipe Effect**: Wipes sprites with a soft gradient edge
- **Shine Effect**: Adds a moving shine/glow effect across sprites
- **Performance Optimized**: Efficient shader-based filters that can handle 22+ sprites simultaneously
- **PixiJS v7 Compatible**: Works with your current PixiJS v7.4.3 setup
- **Future Ready**: API designed to be similar to PixiJS v8's preFX for easy migration

## Usage

### Basic Usage

```typescript
import { SpriteEffects } from './utils/ShineEffects';
import { Sprite } from '@pixi/sprite';

// Apply shine effect to a single sprite
SpriteEffects.addShine(sprite, {
  duration: 1500,
  direction: 45, // angle in degrees
  width: 0.3,
  intensity: 1.0,
  loop: true,
});

// Apply reveal effect
SpriteEffects.addReveal(sprite, {
  duration: 800,
  direction: 'left', // 'left' | 'right' | 'top' | 'bottom' | number
  easing: 'easeInOutQuad',
  onComplete: () => console.log('Done!'),
});

// Apply wipe effect
SpriteEffects.addWipe(sprite, {
  duration: 1000,
  direction: 'right',
  edgeSoftness: 0.15,
  easing: 'easeInOutQuad',
});
```

### Multiple Sprites (Optimized for Performance)

```typescript
// Apply shine to 22 sprites efficiently
const sprites: Sprite[] = [/* your 22 sprites */];

SpriteEffects.addShineToSprites(sprites, {
  duration: 1500,
  direction: 45,
  width: 0.3,
  intensity: 1.0,
  loop: true,
});
```

### Remove Effects

```typescript
// Remove all effects from a sprite
SpriteEffects.removeEffects(sprite);

// Remove specific effect type
SpriteEffects.removeEffect(sprite, 'shine');

// Clean up all effects (useful when destroying scenes)
SpriteEffects.cleanup();
```

## Performance Considerations

1. **Shader-Based**: Uses efficient GPU shaders instead of CPU-based animations
2. **Independent Instances**: Each sprite gets its own filter instance for independent animation
3. **Shared Shader Code**: Shader code is reused across instances for better performance
4. **Minimal Uniform Updates**: Only updates necessary uniform values during animation
5. **Proper Cleanup**: Always clean up effects when done to free resources

## API Reference

### `SpriteEffects.addShine(sprite, options)`
Adds a moving shine effect to a sprite.

**Options:**
- `duration` (number): Animation duration in ms (default: 1500)
- `direction` ('left' | 'right' | 'top' | 'bottom' | number): Direction or angle in degrees (default: 45)
- `width` (number): Width of shine band 0-1 (default: 0.3)
- `intensity` (number): Intensity of shine (default: 1.0)
- `loop` (boolean): Loop animation (default: true)
- `easing` (string): Anime.js easing function (default: 'linear')

### `SpriteEffects.addReveal(sprite, options)`
Reveals a sprite from one direction to another.

**Options:**
- `duration` (number): Animation duration in ms (default: 1000)
- `direction` ('left' | 'right' | 'top' | 'bottom' | number): Direction or angle in degrees (default: 'left')
- `easing` (string): Anime.js easing function (default: 'easeInOutQuad')
- `onComplete` (function): Callback when animation completes

### `SpriteEffects.addWipe(sprite, options)`
Wipes a sprite with a soft gradient edge.

**Options:**
- `duration` (number): Animation duration in ms (default: 1000)
- `direction` ('left' | 'right' | 'top' | 'bottom' | number): Direction or angle in degrees (default: 'left')
- `edgeSoftness` (number): Softness of wipe edge 0-1 (default: 0.1)
- `easing` (string): Anime.js easing function (default: 'easeInOutQuad')
- `onComplete` (function): Callback when animation completes

### Batch Methods

- `SpriteEffects.addShineToSprites(sprites[], options)`: Apply shine to multiple sprites
- `SpriteEffects.addRevealToSprites(sprites[], options)`: Apply reveal to multiple sprites
- `SpriteEffects.addWipeToSprites(sprites[], options)`: Apply wipe to multiple sprites

### Cleanup Methods

- `SpriteEffects.removeEffects(sprite)`: Remove all effects from a sprite
- `SpriteEffects.removeEffect(sprite, type)`: Remove specific effect type ('reveal' | 'wipe' | 'shine')
- `SpriteEffects.cleanup()`: Clean up all effects and animations globally

## Example Integration

See `src/views/BoardView.ts` for example usage methods:
- `shineGemsGroup(groupIndex)`: Apply shine to a gem group
- `revealGems(sprites)`: Apply reveal effect
- `wipeGems(sprites)`: Apply wipe effect
- `removeShineFromGroup(groupIndex)`: Remove shine from a group

## Migration to PixiJS v8

When upgrading to PixiJS v8, you can replace:
```typescript
SpriteEffects.addReveal(sprite, options);
```
with:
```typescript
sprite.preFX.addReveal(options);
```

The API is designed to be similar for easier migration.
