import {LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import {SandboxMap} from "./map.element.ts";
import {Control} from "ol/control";

@customElement("map-control")
export class MapControlElement extends LitElement {

  @property()
  control!: Control;

  connectedCallback() {
    super.connectedCallback();
    this._getSandboxMap().getOlMap().addControl(this.control);
  }

  _getSandboxMap(): SandboxMap {
    return this.parentElement as SandboxMap;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "map-control": MapControlElement;
  }
}
