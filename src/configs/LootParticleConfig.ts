import { Resource, Texture } from '@pixi/core';

export const PARTICLE_CONFIG = {
  lifetime: {
    min: 0.15,
    max: 0.35,
  },
  frequency: 0.008,
  emitterLifetime: 0,
  maxParticles: 30,
  addAtBack: true,
  pos: {
    x: 0,
    y: 0,
  },
  behaviors: [
    {
      type: 'alpha',
      config: {
        alpha: {
          list: [
            {
              time: 0,
              value: 0.2,
            },
            {
              time: 1,
              value: 0,
            },
          ],
        },
      },
    },
    {
      type: 'moveSpeed',
      config: {
        speed: {
          list: [
            {
              time: 0,
              value: 100,
            },
            {
              time: 1,
              value: 10,
            },
          ],
        },
      },
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            {
              time: 0,
              value: 0.4,
            },
            {
              time: 1,
              value: 0.1,
            },
          ],
        },
        minMult: 1,
      },
    },
    {
      type: 'color',
      config: {
        color: {
          list: [
            {
              time: 0,
              value: 'fb1010',
            },
            {
              time: 1,
              value: 'f5b830',
            },
          ],
        },
      },
    },
    {
      type: 'rotationStatic',
      config: {
        min: 90,
        max: 90,
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
