/**
 * Example usage of ShineEffects utility
 * 
 * This file demonstrates how to use the shine effects API
 * which mimics PixiJS v8's preFX.addReveal() and preFX.addWipe()
 * but works efficiently with PixiJS v7 and is optimized for performance
 * when running on multiple sprites (e.g., 22 sprites simultaneously).
 */

import { Sprite } from '@pixi/sprite';
import { SpriteEffects } from './ShineEffects';

/**
 * Example 1: Apply shine effect to a single sprite
 */
export function exampleSingleShine(sprite: Sprite): void {
  SpriteEffects.addShine(sprite, {
    duration: 1500,
    direction: 45, // 45 degree angle
    width: 0.3,
    intensity: 1.0,
    loop: true,
    easing: 'linear',
  });
}

/**
 * Example 2: Apply reveal effect to a sprite
 */
export function exampleReveal(sprite: Sprite): void {
  SpriteEffects.addReveal(sprite, {
    duration: 800,
    direction: 'left', // or 'right', 'top', 'bottom', or angle in degrees
    easing: 'easeInOutQuad',
    onComplete: () => {
      console.log('Reveal complete!');
    },
  });
}

/**
 * Example 3: Apply wipe effect to a sprite
 */
export function exampleWipe(sprite: Sprite): void {
  SpriteEffects.addWipe(sprite, {
    duration: 1000,
    direction: 'right',
    edgeSoftness: 0.15, // Softer edge (0-1)
    easing: 'easeInOutQuad',
    onComplete: () => {
      console.log('Wipe complete!');
    },
  });
}

/**
 * Example 4: Apply shine to multiple sprites efficiently (22 sprites)
 * This is optimized for performance - all sprites share the same shader code
 * but each has its own filter instance for independent animation
 */
export function exampleMultipleShine(sprites: Sprite[]): void {
  // Apply shine to all 22 sprites at once
  SpriteEffects.addShineToSprites(sprites, {
    duration: 1500,
    direction: 45,
    width: 0.3,
    intensity: 1.0,
    loop: true,
    easing: 'linear',
  });
}

/**
 * Example 5: Apply reveal to multiple sprites with staggered timing
 */
export function exampleStaggeredReveal(sprites: Sprite[]): void {
  sprites.forEach((sprite, index) => {
    SpriteEffects.addReveal(sprite, {
      duration: 600,
      direction: 'left',
      easing: 'easeInOutQuad',
      // Stagger the start time
      // Note: You can use animejs delay or setTimeout for staggering
    });
  });
}

/**
 * Example 6: Remove effects from sprites
 */
export function exampleRemoveEffects(sprites: Sprite[]): void {
  // Remove all effects from a sprite
  sprites.forEach((sprite) => {
    SpriteEffects.removeEffects(sprite);
  });

  // Or remove specific effect type
  sprites.forEach((sprite) => {
    SpriteEffects.removeEffect(sprite, 'shine');
  });
}

/**
 * Example 7: Clean up all effects (useful when destroying a scene)
 */
export function exampleCleanup(): void {
  SpriteEffects.cleanup();
}

/**
 * Example 8: Custom direction angles
 */
export function exampleCustomDirections(sprite: Sprite): void {
  // Use numeric angle in degrees
  SpriteEffects.addShine(sprite, {
    direction: 30, // 30 degrees
  });

  // Or use predefined directions
  SpriteEffects.addReveal(sprite, {
    direction: 'top', // 'left' | 'right' | 'top' | 'bottom'
  });
}
