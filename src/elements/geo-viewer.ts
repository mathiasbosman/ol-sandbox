import {customElement, state} from "lit/decorators.js";
import {html, TemplateResult} from "lit";
import {TailwindElement} from "./tailwind.element.ts";
import {Layer} from "ol/layer";
import "./map.element.ts";
import "./map-control.element.ts";
import "./map-layer-wmts.element.ts";
import {getWMTSLayer} from "../utils/geo-utils.ts";
import {Task} from "@lit-labs/task";
import {Control, ZoomToExtent} from "ol/control";
import WMTS from "ol/source/WMTS";
import {fromLonLat} from "ol/proj";

@customElement("geo-viewer")
export class SandboxGeoViewer extends TailwindElement("") {

  private flanders: Layer<WMTS> | undefined = undefined;
  private zoomToFlandersControl: Control | undefined = undefined;

  @state() layers: Layer[] = [];

  private readonly getLayers = new Task(
      this,
      {
        task: async (): Promise<void> => {
          // fetch flanders layer via capabilities
          this.flanders = await getWMTSLayer({
            capabilitiesUrl: 'https://geo.api.vlaanderen.be/GRB/wmts?service=WMTS&request=getcapabilities',
            layerName: 'grb_bsk',
            matrixSet: 'GoogleMapsVL'
          });
          this.layers.push(this.flanders);
          // create "zoom to Flanders" control
          const globeIcon = document.createElement('div');
          globeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mx-auto">' +
              '  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />' +
              '</svg>'
          this.zoomToFlandersControl = new ZoomToExtent({
            extent: this.flanders.getSource()?.getTileGrid()?.getExtent(),
            tipLabel: "Zoom to Flanders",
            label: globeIcon
          });
        },
        args: () => []
      }
  );


  render(): TemplateResult {
    return html`
      ${this.getLayers.render({
        initial: () => html`<p>loading..</p>`,
        pending: () => html`<p>loading..</p>`,
        error: (e: any) => html`<p>BOOM ${e}</p>`,
        complete: () => html`
          <sandbox-map class="h-screen w-full"
                       .initialCenter="${fromLonLat([4.240528, 51.037861])}">
            <map-layer-wmts
                url="https://geo.api.vlaanderen.be/GRB/wmts?service=WMTS&request=getcapabilities"
                layerName="grb_bsk"
                matrixSet="GoogleMapsVL"></map-layer-wmts>
            <map-layer-wmts
                url="https://mercator.vlaanderen.be/raadpleegdienstenmercatorpubliek/gwc/service/wmts?service=WMTS&request=getcapabilities"
                layerName="hh:hh_geluid_vliegver_2016" 
                .opacity=${0.75}
                matrixSet="WGS84VL"></map-layer-wmts>
            <map-control .control="${this.zoomToFlandersControl}"></map-control>
          </sandbox-map>`
      })};`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'geo-viewer': SandboxGeoViewer
  }
}
