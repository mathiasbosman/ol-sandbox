import {customElement, property} from "lit/decorators.js";
import {WMTSLayerInfo, wmtsParser} from "../utils/geo-utils.ts";
import {MapLayerElement} from "./map-layer.element.ts";
import {Layer} from "ol/layer";
import WMTS, {optionsFromCapabilities} from "ol/source/WMTS";
import wretch from "wretch";
import TileLayer from "ol/layer/Tile";

@customElement("map-layer-wmts")
export class MapLayerWmtsElement extends MapLayerElement {

  @property()
  url!: string;

  @property()
  layerName!: string;

  @property()
  matrixSet!: string;



  async getLayer(): Promise<Layer> {
    const wmtsLayer = await this._getWMTSLayer({
      capabilitiesUrl: this.url,
      layerName: this.layerName,
      matrixSet: this.matrixSet
    });
    wmtsLayer.setOpacity(this.opacity);
    return wmtsLayer;
  }

   async _getWMTSLayer(layerinfo: WMTSLayerInfo): Promise<Layer<WMTS>> {
     try {
       const options = await wretch(layerinfo.capabilitiesUrl)
       .get()
       .text(text => {
         const result = wmtsParser.read(text);
         return optionsFromCapabilities(result, {
           layer: layerinfo.layerName,
           matrixSet: layerinfo.matrixSet,
         });
       });
       if (options == null) {
         throw new Error("Unable to get WMTS options");
       }
       const layer = new TileLayer({source: new WMTS(options)});
       return layer;
     } catch (error) {
       throw error;
     }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "map-layer-wmts": MapLayerWmtsElement;
  }
}
