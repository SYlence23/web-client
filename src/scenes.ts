export interface SceneInfo {
  id: string
  name: string
  description: string
}

export const SCENES: SceneInfo[] = [
  {
    id: 'spheres',
    name: 'Spheres',
    description: 'Three spheres on a yellow floor: matte blue, matte red and brushed gold metal.',
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Solid and hollow glass spheres next to a mirror, with shallow depth of field.',
  },
  {
    id: 'random',
    name: 'Random',
    description: 'Hundreds of small random spheres around three large ones. The heaviest scene.',
  },
]
