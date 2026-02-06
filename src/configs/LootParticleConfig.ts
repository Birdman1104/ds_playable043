import { Resource, Texture } from '@pixi/core';

export const PARTICLE_CONFIG = {
  lifetime: {
    min: 7,
    max: 10,
  },
  frequency: 0.1,
  emitterLifetime: 20,
  maxParticles: 100,
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
      type: 'moveSpeed',
      config: {
        speed: {
          list: [
            {
              time: 0,
              value: 300,
            },
            {
              time: 1,
              value: 330,
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
              value: 0.6,
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
        min: -265,
        max: -332,
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
