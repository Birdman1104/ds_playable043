import { Resource, Texture } from '@pixi/core';

export const PARTICLE_CONFIG = {
  lifetime: {
    min: 1,
    max: 2,
  },
  frequency: 0.005,
  emitterLifetime: 1.3,
  maxParticles: 60,
  addAtBack: true,
  pos: {
    x: 0,
    y: 0,
  },
  noRotation: false,
  behaviors: [
    {
      type: 'alpha',
      config: {
        alpha: {
          list: [
            {
              time: 0,
              value: 1,
            },
            {
              time: 1,
              value: 0.4,
            },
          ],
        },
      },
    },
    {
      type: 'rotation',
      config: {
        accel: 10,
        minSpeed: 0,
        maxSpeed: 50,
        minStart: 90,
        maxStart: -90,
      },
    },

    {
      type: 'moveSpeedStatic',
      config: {
        min: 600,
        max: 800,
      },
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            {
              time: 0,
              value: 0.3,
            },
            {
              time: 1,
              value: 0.05,
            },
          ],
        },
        minMult: 0.42,
      },
    },
    {
      type: 'color',
      config: {
        color: {
          list: [
            {
              time: 0,
              value: 'f060b6',
            },
            {
              time: 1,
              value: 'f0e91a',
            },
          ],
        },
      },
    },
    {
      type: 'rotationStatic',
      config: {
        min: 265,
        max: 332,
      },
    },
    {
      type: 'textureRandom',
      config: {
        textures: [] as Texture<Resource>[],
      },
    },
    {
      type: 'spawnShape',
      config: {
        type: 'torus',
        data: {
          x: 0,
          y: 0,
          radius: 2,
          innerRadius: 1,
          affectRotation: false,
        },
      },
    },
  ],
};
