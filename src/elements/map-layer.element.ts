import {LitElement} from "lit";
import {Layer} from "ol/layer";
import {SandboxMap} from "./map.element.ts";
import {property} from "lit/decorators.js";

export abstract class MapLayerElement extends LitElement {

  @property()
  opacity:number = 1;

  async connectedCallback() {
    super.connectedCallback();
    const layer = await this.getLayer();
    console.log("adding layer");
    console.log(layer);
    this._getMapElement().addLayer(layer);
  }

  abstract getLayer(): Promise<Layer>;

  _getMapElement(): SandboxMap {
    return this.parentElement as SandboxMap;
  }
}
