import {LitElement} from "lit";
import {property} from "lit/decorators.js";
import {Layer} from "ol/layer";
import {SandboxLayer} from "../utils/geo-utils.ts";

export class LayerAddedEvent extends Event {
  readonly layer: SandboxLayer;

  constructor(layer: SandboxLayer) {
    super('layer-added', {bubbles: true});
    this.layer = layer;
  }
}

export abstract class MapLayerElement extends LitElement {

  @property()
  opacity:number = 1;

  @property()
  identifier!: string;

  @property()
  description?: string;

  async connectedCallback() {
    super.connectedCallback();
    const layer = await this.getLayer();
    layer.setOpacity(this.opacity);
    this.dispatchEvent(new LayerAddedEvent(new SandboxLayer(this.identifier, layer, this.description ?? this.identifier)));
  }

  abstract getLayer(): Promise<Layer>;

}
