import {customElement, property} from "lit/decorators.js";
import {MapLayerElement} from "./map-layer.element.ts";
import {Layer} from "ol/layer";
import ImageLayer from "ol/layer/Image";
import {ImageWMS} from "ol/source";

@customElement("map-layer-wms")
export class MapLayerWmsElement extends MapLayerElement {

  @property()
  url!: string;

  @property()
  layerName!: string;


  async getLayer(): Promise<Layer> {
    return this._getWMSLayer();
  }

  async _getWMSLayer(): Promise<ImageLayer<ImageWMS>> {
    return new ImageLayer({
      source: new ImageWMS({
        url: this.url,
        params: {'LAYERS': this.layerName},
      })
    })
  }


}

declare global {
  interface HtmlElementTagNameMap {
    "map-layer-wms": MapLayerWmsElement;
  }
}
