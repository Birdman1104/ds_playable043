// @ts-nocheck
import { parseBase64JsonToObject } from '../utils/Utils';

import ctaPng from '../assets/atlases/cta.png?inline';
import ctaJson from '../assets/atlases/cta.json';

import gemsPng from '../assets/atlases/gems.png?inline';
import gemsJson from '../assets/atlases/gems.json';

import preloadPng from '../assets/atlases/preload.png?inline';
import preloadJson from '../assets/atlases/preload.json';

import uiPng from '../assets/atlases/ui.png?inline';
import uiJson from '../assets/atlases/ui.json';

export const ATLASES = [{name: 'cta', img:ctaPng, json: ctaJson,},{name: 'gems', img:gemsPng, json: gemsJson,},{name: 'ui', img:uiPng, json: uiJson,},];

export const PRELOAD_ATLAS = {name: 'preload', img:preloadPng, json: preloadJson,}