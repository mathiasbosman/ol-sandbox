import style from '../index.css?inline';
import {LitElement, unsafeCSS} from "lit";
const tailwindElement = unsafeCSS(style);
export const TailwindElement = (style: string) => class extends LitElement {
  static styles = [tailwindElement, unsafeCSS(style)]
}
