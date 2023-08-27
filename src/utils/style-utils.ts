import tailwindConfig from '../../tailwind.config.js';
import {CSSResult, unsafeCSS} from "lit";


export function getTailwindCustomColor(name: string): CSSResult {
  return unsafeCSS(tailwindConfig.theme.extend.colors[name]);
}
