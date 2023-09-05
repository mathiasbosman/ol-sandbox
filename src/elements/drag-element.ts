import { css, html, LitElement, PropertyValues, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

class BaseElement extends LitElement {
  trigger (event: string, detail: any) {
    this.dispatchEvent(new CustomEvent(event, {
      detail,
      bubbles: true,
      composed: true
    }))
  }
}

@customElement("draggable-list")
export class DraggableList extends BaseElement {
  @property()
  currentSource?: number

  @property()
  currentTarget?: number

  protected firstUpdated (_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties)
    this.addEventListener('dragover', event => event.preventDefault())
    this.addEventListener('currentTarget',
      event => this.setCurrentTarget(event))
    this.addEventListener('currentSource',
      event => this.setCurrentSource(event))
    this.addEventListener('complete', () => this.setComplete())

    this.items.map((element, index) => {
      element.index = element.originalIndex = element.currentIndex = index
      element.currentSource = null
      return element
    })
  }

  get items (): DraggableItem[] {
    return [...this.querySelectorAll('draggable-item')] as DraggableItem[]
  }

  get arrangement () {
    return this.items.map((item, id) => {
      return { id, oid: item.originalIndex, ref: item.ref }
    })
  }

  reindex () {
    this.items.map((element, index) => element.index = index)
  }

  sort () {
    const mapIndex = (item: DraggableItem) => {
      if (!this.currentTarget) {
        this.currentTarget = 0;
      }
      if (item.currentIndex == this.currentSource) {
        item.index = this.currentTarget + 1;
      } else if (item.index >= this.currentTarget) {
        item.index += 1
      }
      return item
    }
    const sortIndex = (a:DraggableItem, b:DraggableItem) => (a.index > b.index) ? 1 : -1
    const reduceIndex = (item:DraggableItem, i: number) => {
      item.index = i
    }
    const unordered = (item:DraggableItem, i:number) => item.index != i

    this.items.map(mapIndex).sort(sortIndex).map(reduceIndex)

    if (this.items.filter(unordered).length) {
      this.items.sort(sortIndex).map(e => {
        this.removeChild(e)
        return e
      }).map(e => {
        this.append(e)
      })
    }
  }

  setCurrentTarget (event: CustomEvent) {
    this.currentTarget = event.detail.index
    this.sort()
  }

  setCurrentSource (event: CustomEvent) {
    this.items.map(item => {
      item.currentSource = event.detail.index
    })
    this.currentSource = event.detail.index
  }

  setComplete () {
    this.items.map((element, index) => {
      element.currentIndex = index
      element.currentSource = null
    })
    this.trigger('drag-sort-complete', { items: this.arrangement })
  }

  static styles = css`:host {
    display: block;
  }`

  protected render (): unknown {
    return html`
      <slot></slot>`
  }
}

@customElement("draggable-item")
export class DraggableItem extends BaseElement {
  @property({attribute: false})
  index: number = 0;
  @property({attribute: false})
  originalIndex: number = 0;
  @property({attribute: false})
  currentIndex: number = 0;
  @property({attribute: false})
  currentSource: number | null = null;
  @property()
  ref: any;
  @property()
  enableGrabCursor: boolean = true;

  protected firstUpdated (_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties)
    this.setAttribute('draggable', 'true')
    this.addEventListener('dragstart', this.dragstart);
    this.addEventListener('dragover', this.dragover);
    this.addEventListener('dragend', this.dragend);
  }

  dragstart () {
    this.trigger('currentSource', { index: this.index })
  }

  dragover (ev: DragEvent) {
    const target = ev.target as DraggableItem;
    const before = (ev.offsetY - (target.clientHeight / 2)) < 1
    const index = before ? this.index - 1 : this.index
    this.trigger('currentTarget', { index })
  }

  dragend (ev: DragEvent) {
    ev.preventDefault()
    this.trigger('complete', {})
  }

  static styles = css`
    :host {
      cursor: grab;
    }
    
    :host .draggable-dragging {
      cursor: grabbing;
    }
  `;

  protected render (): TemplateResult {
    const isSource = this.currentSource == this.currentIndex
    return html`<div class="${isSource ? 'draggable-dragging' : ''}">
      <slot></slot>
    </div>`
  }
}

declare global {
  interface HTMLElementEventMap {
    'currentSource': CustomEvent;
    'currentTarget': CustomEvent;
  }
  interface HTMLElementTagNameMap {
    'draggable-list': DraggableList;
    'draggable-item': DraggableItem;
  }
}
