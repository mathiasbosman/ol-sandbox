import {LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import {SandboxMap} from "./map.element.ts";
import {getWMTSLayer} from "../utils/geo-utils.ts";

@customElement("map-layer-wmts")
export class MapLayerWmtsElement extends LitElement {

  @property()
  url!: string;

  @property()
  layerName!: string;

  @property()
  matrixSet!: string;

  @property()
  opacity:number = 1;

  async connectedCallback() {
    super.connectedCallback();
    const wmtsLayer = await getWMTSLayer({
      capabilitiesUrl: this.url,
      layerName: this.layerName,
      matrixSet: this.matrixSet
    });
    wmtsLayer.setOpacity(this.opacity)
    this._getSandboxMap().addLayer(wmtsLayer);
  }

  _getSandboxMap(): SandboxMap {
    return this.parentElement as SandboxMap;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "map-layer-wmts": MapLayerWmtsElement;
  }
}
