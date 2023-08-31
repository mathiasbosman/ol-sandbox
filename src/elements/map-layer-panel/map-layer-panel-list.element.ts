import {TailwindElement} from "../tailwind.element.ts";
import {customElement, property} from "lit/decorators.js";
import {SandboxLayer} from "../../utils/geo-utils.ts";
import {html, nothing, TemplateResult} from "lit";
import {repeat} from "lit-html/directives/repeat.js";

@customElement("map-layer-panel-list")
export class MapLayerPanelListElement extends TailwindElement("") {
  @property()
  protected layers: SandboxLayer[] = [];
  @property()
  protected sortable: boolean = true;


  protected render(): TemplateResult | symbol {
    if (this.layers.length < 1) {
      return nothing;
    }

    return html`${repeat(this.layers, layer => html`${layer.layerName}`)}`;
  }
}
