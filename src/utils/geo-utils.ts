import {Layer} from "ol/layer";
import wretch from "wretch";
import WMTS, {optionsFromCapabilities} from "ol/source/WMTS";
import TileLayer from "ol/layer/Tile";
import WMTSCapabilities from "ol/format/WMTSCapabilities";

export interface WMTSLayerInfo {
  capabilitiesUrl: string,
  identifier: string,
  matrixSet: string
}

export class SandboxLayer {
  order?: number;
  description?: string;
  layerName: string;
  layer: Layer;

  constructor(layerName: string, layer: Layer, description: string, order: number = 0) {
    this.order = order;
    this.layerName = layerName;
    this.layer = layer;
    this.description = description;
  }
}

export const wmtsParser = new WMTSCapabilities();
export function getWMTSLayer(layerinfo: WMTSLayerInfo): Promise<Layer<WMTS>> {
    return wretch(layerinfo.capabilitiesUrl)
    .get()
    .text(text => {
      const result = wmtsParser.read(text);
      return optionsFromCapabilities(result, {
        layer: layerinfo.identifier,
        matrixSet: layerinfo.matrixSet,
      });
    })
    .then(options => {
      if (options == null) {
        throw new Error("Unable to get WMTS options");
      }
      return new TileLayer({source: new WMTS(options)});
    })
    .then(layer => {
      return layer;
    })
    .catch(error => {
      throw new Error(error);
    });
  }
