import { Filter } from '@pixi/core';
import { Rectangle } from '@pixi/math';
import { Sprite } from '@pixi/sprite';
import anime from 'animejs';

/**
 * Reveal effect - reveals sprite from left to right (or custom direction)
 * Optimized for performance with multiple sprites
 */
class RevealFilter extends Filter {
  private _progress: number = 0;
  private _angle: number = 0; // Direction angle in radians

  constructor() {
    const vertexShader = `
      attribute vec2 aVertexPosition;
      attribute vec2 aTextureCoord;
      uniform mat3 projectionMatrix;
      varying vec2 vTextureCoord;
      
      void main(void) {
        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord;
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float uProgress;
      uniform float uAngle;
      uniform vec2 uResolution;
      
      void main(void) {
        vec2 uv = vTextureCoord;
        vec2 center = vec2(0.5);
        
        // Calculate direction vector from angle
        vec2 dir = vec2(cos(uAngle), sin(uAngle));
        
        // Project UV onto direction line
        vec2 toUV = uv - center;
        float projection = dot(toUV, dir);
        
        // Normalize projection to 0-1 range
        float maxDist = length(vec2(0.5, 0.5));
        float normalizedProj = (projection + maxDist) / (2.0 * maxDist);
        
        // Create reveal effect
        float reveal = step(normalizedProj, uProgress);
        
        vec4 color = texture2D(uSampler, uv);
        gl_FragColor = vec4(color.rgb, color.a * reveal);
      }
    `;

    super(vertexShader, fragmentShader, {
      uProgress: 0,
      uAngle: 0,
      uResolution: [1, 1],
    });

    // Set filter resolution to match app resolution for quality
    this.resolution = Math.max(window.devicePixelRatio || 1, 2);
    // Enable autoFit for proper filter area calculation
    this.autoFit = true;
  }

  get progress(): number {
    return this._progress;
  }

  set progress(value: number) {
    this._progress = Math.max(0, Math.min(1, value));
    this.uniforms.uProgress = this._progress;
  }

  get angle(): number {
    return this._angle;
  }

  set angle(value: number) {
    this._angle = value;
    this.uniforms.uAngle = value;
  }

  updateResolution(width: number, height: number): void {
    this.uniforms.uResolution = [width, height];
  }
}

/**
 * Wipe effect - wipes sprite with a gradient edge
 * Optimized for performance with multiple sprites
 */
class WipeFilter extends Filter {
  private _progress: number = 0;
  private _angle: number = 0; // Direction angle in radians
  private _edgeSoftness: number = 0.1; // Softness of the wipe edge (0-1)

  constructor() {
    const vertexShader = `
      attribute vec2 aVertexPosition;
      attribute vec2 aTextureCoord;
      uniform mat3 projectionMatrix;
      varying vec2 vTextureCoord;
      
      void main(void) {
        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord;
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float uProgress;
      uniform float uAngle;
      uniform float uEdgeSoftness;
      uniform vec2 uResolution;
      
      void main(void) {
        vec2 uv = vTextureCoord;
        vec2 center = vec2(0.5);
        
        // Calculate direction vector from angle
        vec2 dir = vec2(cos(uAngle), sin(uAngle));
        
        // Project UV onto direction line
        vec2 toUV = uv - center;
        float projection = dot(toUV, dir);
        
        // Normalize projection to 0-1 range
        float maxDist = length(vec2(0.5, 0.5));
        float normalizedProj = (projection + maxDist) / (2.0 * maxDist);
        
        // Create smooth wipe effect with soft edge
        float edge = smoothstep(uProgress - uEdgeSoftness, uProgress + uEdgeSoftness, normalizedProj);
        
        vec4 color = texture2D(uSampler, uv);
        gl_FragColor = vec4(color.rgb, color.a * edge);
      }
    `;

    super(vertexShader, fragmentShader, {
      uProgress: 0,
      uAngle: 0,
      uEdgeSoftness: 0.1,
      uResolution: [1, 1],
    });

    // Set filter resolution to match app resolution for quality
    this.resolution = Math.max(window.devicePixelRatio || 1, 2);
    // Enable autoFit for proper filter area calculation
    this.autoFit = true;
  }

  get progress(): number {
    return this._progress;
  }

  set progress(value: number) {
    this._progress = Math.max(0, Math.min(1, value));
    this.uniforms.uProgress = this._progress;
  }

  get angle(): number {
    return this._angle;
  }

  set angle(value: number) {
    this._angle = value;
    this.uniforms.uAngle = value;
  }

  get edgeSoftness(): number {
    return this._edgeSoftness;
  }

  set edgeSoftness(value: number) {
    this._edgeSoftness = Math.max(0, Math.min(1, value));
    this.uniforms.uEdgeSoftness = this._edgeSoftness;
  }

  updateResolution(width: number, height: number): void {
    this.uniforms.uResolution = [width, height];
  }
}

/**
 * Shine effect - adds a moving shine/glow across the sprite
 * Optimized for performance with multiple sprites
 */
class ShineFilter extends Filter {
  private _progress: number = 0;
  private _angle: number = Math.PI / 4; // Default 45 degrees
  private _width: number = 0.3; // Width of shine band (0-1)
  private _intensity: number = 1.0; // Intensity of shine

  constructor() {
    const vertexShader = `
      attribute vec2 aVertexPosition;
      attribute vec2 aTextureCoord;
      uniform mat3 projectionMatrix;
      varying vec2 vTextureCoord;
      
      void main(void) {
        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord;
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float uProgress;
      uniform float uAngle;
      uniform float uWidth;
      uniform float uIntensity;
      uniform vec2 uResolution;
      
      void main(void) {
        vec2 uv = vTextureCoord;
        vec2 center = vec2(0.5);
        
        // Calculate direction vector from angle
        vec2 dir = vec2(cos(uAngle), sin(uAngle));
        
        // Project UV onto direction line
        vec2 toUV = uv - center;
        float projection = dot(toUV, dir);
        
        // Normalize projection to 0-1 range
        float maxDist = length(vec2(0.5, 0.5));
        float normalizedProj = (projection + maxDist) / (2.0 * maxDist);
        
        // Create moving shine band
        float dist = abs(normalizedProj - uProgress);
        float shine = 1.0 - smoothstep(0.0, uWidth, dist);
        shine *= uIntensity;
        
        vec4 color = texture2D(uSampler, uv);
        // Add shine to the color
        gl_FragColor = vec4(color.rgb + shine, color.a);
      }
    `;

    super(vertexShader, fragmentShader, {
      uProgress: 0,
      uAngle: Math.PI / 4,
      uWidth: 0.3,
      uIntensity: 1.0,
      uResolution: [1, 1],
    });

    // Set filter resolution to match app resolution for quality
    this.resolution = Math.max(window.devicePixelRatio || 1, 2);
    // Enable autoFit for proper filter area calculation
    this.autoFit = true;
  }

  get progress(): number {
    return this._progress;
  }

  set progress(value: number) {
    this._progress = Math.max(0, Math.min(1, value));
    this.uniforms.uProgress = this._progress;
  }

  get angle(): number {
    return this._angle;
  }

  set angle(value: number) {
    this._angle = value;
    this.uniforms.uAngle = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = Math.max(0, Math.min(1, value));
    this.uniforms.uWidth = this._width;
  }

  get intensity(): number {
    return this._intensity;
  }

  set intensity(value: number) {
    this._intensity = Math.max(0, value);
    this.uniforms.uIntensity = this._intensity;
  }

  updateResolution(width: number, height: number): void {
    this.uniforms.uResolution = [width, height];
  }
}

export interface RevealOptions {
  duration?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom' | number; // number is angle in degrees
  easing?: string;
  onComplete?: () => void;
}

export interface WipeOptions {
  duration?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom' | number; // number is angle in degrees
  edgeSoftness?: number; // 0-1, default 0.1
  easing?: string;
  onComplete?: () => void;
}

export interface ShineOptions {
  duration?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom' | number; // number is angle in degrees
  width?: number; // 0-1, default 0.3
  intensity?: number; // default 1.0
  loop?: boolean;
  easing?: string;
}

/**
 * PreFX-like API for PixiJS v7
 * Optimized for performance with multiple sprites
 */
export class SpriteEffects {
  private static filterCache = new Map<string, Filter>();
  private static activeAnimations = new Map<Sprite, anime.AnimeInstance[]>();

  /**
   * Convert direction string to angle in radians
   */
  private static directionToAngle(direction: 'left' | 'right' | 'top' | 'bottom' | number): number {
    if (typeof direction === 'number') {
      return (direction * Math.PI) / 180;
    }
    switch (direction) {
      case 'left':
        return Math.PI;
      case 'right':
        return 0;
      case 'top':
        return -Math.PI / 2;
      case 'bottom':
        return Math.PI / 2;
      default:
        return 0;
    }
  }

  /**
   * Get or create a filter instance (reused for performance)
   */
  private static getFilter(type: 'reveal' | 'wipe' | 'shine'): Filter {
    const key = type;
    if (!this.filterCache.has(key)) {
      let filter: Filter;
      switch (type) {
        case 'reveal':
          filter = new RevealFilter();
          break;
        case 'wipe':
          filter = new WipeFilter();
          break;
        case 'shine':
          filter = new ShineFilter();
          break;
      }
      this.filterCache.set(key, filter);
    }
    return this.filterCache.get(key)!;
  }

  /**
   * Clean up animations for a sprite
   */
  private static cleanupAnimations(sprite: Sprite): void {
    const animations = this.activeAnimations.get(sprite);
    if (animations) {
      animations.forEach((anim) => anim.pause());
      this.activeAnimations.delete(sprite);
    }
  }

  /**
   * Add reveal effect to sprite
   * Reveals the sprite from one direction to another
   */
  static addReveal(sprite: Sprite, options: RevealOptions = {}): void {
    this.cleanupAnimations(sprite);

    const { duration = 1000, direction = 'left', easing = 'easeInOutQuad', onComplete } = options;

    const filter = this.getFilter('reveal') as RevealFilter;
    const angle = this.directionToAngle(direction);

    // Clone filter for this sprite (filters can't be shared between sprites in v7)
    const spriteFilter = new RevealFilter();
    spriteFilter.angle = angle;
    spriteFilter.progress = 0;

    // Set filter area to match sprite bounds for quality
    // In PixiJS v7, filterArea is set on the sprite, not the filter
    const updateFilterArea = () => {
      const bounds = sprite.getBounds(true); // Get local bounds
      // Set sprite's filterArea for optimal quality (using type assertion for v7 compatibility)
      (sprite as any).filterArea = new Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
      spriteFilter.updateResolution(bounds.width, bounds.height);
    };
    updateFilterArea();

    // Apply filter
    if (!sprite.filters) {
      sprite.filters = [];
    }
    if (!sprite.filters.includes(spriteFilter)) {
      sprite.filters.push(spriteFilter);
    }

    // Animate
    const animTarget = { progress: 0 };
    const animation = anime({
      targets: animTarget,
      progress: 1,
      duration,
      easing,
      update: () => {
        spriteFilter.progress = animTarget.progress;
      },
      complete: () => {
        if (onComplete) onComplete();
        // Optionally remove filter after animation
        // sprite.filters = sprite.filters?.filter(f => f !== spriteFilter) || null;
      },
    });

    // Track animation
    if (!this.activeAnimations.has(sprite)) {
      this.activeAnimations.set(sprite, []);
    }
    this.activeAnimations.get(sprite)!.push(animation);
  }

  /**
   * Add wipe effect to sprite
   * Wipes the sprite with a soft edge
   */
  static addWipe(sprite: Sprite, options: WipeOptions = {}): void {
    this.cleanupAnimations(sprite);

    const {
      duration = 1000,
      direction = 'left',
      edgeSoftness = 0.1,
      easing = 'easeInOutQuad',
      onComplete,
    } = options;

    const filter = this.getFilter('wipe') as WipeFilter;
    const angle = this.directionToAngle(direction);

    // Clone filter for this sprite
    const spriteFilter = new WipeFilter();
    spriteFilter.angle = angle;
    spriteFilter.edgeSoftness = edgeSoftness;
    spriteFilter.progress = 0;

    // Set filter area to match sprite bounds for quality
    // In PixiJS v7, filterArea is set on the sprite, not the filter
    const updateFilterArea = () => {
      const bounds = sprite.getBounds(true); // Get local bounds
      // Set sprite's filterArea for optimal quality (using type assertion for v7 compatibility)
      (sprite as any).filterArea = new Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
      spriteFilter.updateResolution(bounds.width, bounds.height);
    };
    updateFilterArea();

    // Apply filter
    if (!sprite.filters) {
      sprite.filters = [];
    }
    if (!sprite.filters.includes(spriteFilter)) {
      sprite.filters.push(spriteFilter);
    }

    // Animate
    const animTarget = { progress: 0 };
    const animation = anime({
      targets: animTarget,
      progress: 1,
      duration,
      easing,
      update: () => {
        spriteFilter.progress = animTarget.progress;
      },
      complete: () => {
        if (onComplete) onComplete();
      },
    });

    // Track animation
    if (!this.activeAnimations.has(sprite)) {
      this.activeAnimations.set(sprite, []);
    }
    this.activeAnimations.get(sprite)!.push(animation);
  }

  /**
   * Add shine effect to sprite
   * Creates a moving shine/glow effect
   */
  static addShine(sprite: Sprite, options: ShineOptions = {}): void {
    this.cleanupAnimations(sprite);

    const {
      duration = 1500,
      direction = 45, // 45 degrees by default
      width = 0.3,
      intensity = 1.0,
      loop = false,
      easing = 'linear',
    } = options;

    const angle = this.directionToAngle(direction);

    // Clone filter for this sprite
    const spriteFilter = new ShineFilter();
    spriteFilter.angle = angle;
    spriteFilter.width = width;
    spriteFilter.intensity = intensity;
    spriteFilter.progress = 0;

    // Set filter area to match sprite bounds for quality
    // In PixiJS v7, filterArea is set on the sprite, not the filter
    const updateFilterArea = () => {
      const bounds = sprite.getBounds(true); // Get local bounds
      // Set sprite's filterArea for optimal quality (using type assertion for v7 compatibility)
      (sprite as any).filterArea = new Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
      spriteFilter.updateResolution(bounds.width, bounds.height);
    };
    updateFilterArea();

    // Apply filter
    if (!sprite.filters) {
      sprite.filters = [];
    }
    if (!sprite.filters.includes(spriteFilter)) {
      sprite.filters.push(spriteFilter);
    }

    // Animate
    const animTarget = { progress: 0 };
    const animation = anime({
      targets: animTarget,
      progress: 1,
      duration,
      easing,
      loop,
      update: () => {
        spriteFilter.progress = animTarget.progress;
      },
    });

    // Track animation
    if (!this.activeAnimations.has(sprite)) {
      this.activeAnimations.set(sprite, []);
    }
    this.activeAnimations.get(sprite)!.push(animation);
  }

  /**
   * Remove all effects from a sprite
   */
  static removeEffects(sprite: Sprite): void {
    this.cleanupAnimations(sprite);
    sprite.filters = null;
  }

  /**
   * Remove specific effect type from sprite
   */
  static removeEffect(sprite: Sprite, type: 'reveal' | 'wipe' | 'shine'): void {
    if (!sprite.filters) return;

    // Remove filters of the specified type
    sprite.filters = sprite.filters.filter((filter) => {
      return (
        !(filter instanceof RevealFilter && type === 'reveal') &&
        !(filter instanceof WipeFilter && type === 'wipe') &&
        !(filter instanceof ShineFilter && type === 'shine')
      );
    });

    if (sprite.filters.length === 0) {
      sprite.filters = null;
    }
  }

  /**
   * Apply shine effect to multiple sprites efficiently
   * Optimized for batch operations (e.g., 22 sprites)
   */
  static addShineToSprites(sprites: Sprite[], options: ShineOptions = {}): void {
    sprites.forEach((sprite) => {
      this.addShine(sprite, options);
    });
  }

  /**
   * Apply reveal effect to multiple sprites efficiently
   */
  static addRevealToSprites(sprites: Sprite[], options: RevealOptions = {}): void {
    sprites.forEach((sprite) => {
      this.addReveal(sprite, options);
    });
  }

  /**
   * Apply wipe effect to multiple sprites efficiently
   */
  static addWipeToSprites(sprites: Sprite[], options: WipeOptions = {}): void {
    sprites.forEach((sprite) => {
      this.addWipe(sprite, options);
    });
  }

  /**
   * Clean up all effects and animations
   */
  static cleanup(): void {
    this.activeAnimations.forEach((animations, sprite) => {
      animations.forEach((anim) => anim.pause());
      sprite.filters = null;
    });
    this.activeAnimations.clear();
    this.filterCache.clear();
  }
}
