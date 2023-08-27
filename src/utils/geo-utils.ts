import {Layer} from "ol/layer";
import wretch from "wretch";
import WMTS, {optionsFromCapabilities} from "ol/source/WMTS";
import TileLayer from "ol/layer/Tile";
import WMTSCapabilities from "ol/format/WMTSCapabilities";

export interface WMTSLayerInfo {
  capabilitiesUrl: string,
  layerName: string,
  matrixSet: string
}

export const wmtsParser = new WMTSCapabilities();
export function getWMTSLayer(layerinfo: WMTSLayerInfo): Promise<Layer<WMTS>> {
    return wretch(layerinfo.capabilitiesUrl)
    .get()
    .text(text => {
      const result = wmtsParser.read(text);
      return optionsFromCapabilities(result, {
        layer: layerinfo.layerName,
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
