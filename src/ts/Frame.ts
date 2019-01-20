import state from './State'

class Frame {
  protected supported: Array<string> = [
    'A',
    'P',
    'SPAN',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'IMG',
    'SVG',
    'BUTTON',
    'INPUT',
    'LABEL'
  ]

  protected iFrame: HTMLIFrameElement

  protected highLightElement: HTMLDivElement

  public init() {
    let frame = document.getElementById('iframe') as HTMLIFrameElement
    if (frame === null) {
      return
    }
    this.iFrame = frame
    this.bindFrame()
    this.iFrame.addEventListener('load', () => {
      this.bindFrame()
    })
  }

  protected bindFrame() {
    let frame = this.iFrame
    if (frame.contentDocument === null || frame.contentDocument.body === null) {
      return
    }
    const targetBody = frame.contentDocument.body
    targetBody.appendChild(this.getHighLightElement())
    targetBody.addEventListener('click', (event) => {
      this.clicked(event)
    })
  }

  protected getHighLightElement(): HTMLDivElement {
    //@todo This should be a custom html element and use shadow DOM.
    const highlight = document.createElement('div')
    highlight.id = 'json-populate-highlight'
    highlight.style.cssText = 'background-color:green;border:1px solid #00F;margin:0;padding:0;opacity:0.3;width:0;height:0;position:absolute;left:-9999;'
    highlight.innerHTML = '&nbsp;'
    this.highLightElement = highlight
    return this.highLightElement
  }

  protected highLightItem(item: HTMLElement) {
    let style = this.highLightElement.style
    let coord = item.getBoundingClientRect()
    let zIndex = (item.style.zIndex) ? item.style.zIndex + 1 : 1
    style.width = coord.width + 'px'
    style.height = coord.height + 'px'
    style.top = coord.top + this.iFrame.contentWindow.scrollY + 'px'
    style.left = coord.left + this.iFrame.contentWindow.scrollX + 'px'
    style.zIndex = zIndex.toString()
  }
  protected clicked(event: MouseEvent): void {
    if (event.altKey) {
      return this.processAltClicked(event)
    }
    return this.processClicked(event)
  }

  protected processAltClicked(event: MouseEvent) {
    let item: HTMLElement | null = this.getEventElement(event)
    if (item === null) {
      return
    }
    // Not a link, nothing we should do.
    if (item.hasAttribute('href') === false) {
      return
    }
    let oldRef: string | null = item.getAttribute('href')
    if (oldRef === null) {
      return
    }
    // Anchor link, nothing we should do.
    if (this.isAnchor(oldRef)) {
      return
    }
    // Link to another page, pass through to iframe.
    var original = this.iFrame.getAttribute('src')
    var newRef = original + '&page=' + oldRef
    this.iFrame.setAttribute('src', newRef)
    event.preventDefault()
    event.stopPropagation()
  }

  protected isAnchor(href: string): boolean {
    if (href.indexOf('#') === 0) {
      return true
    }
    return false
  }

  protected processClicked(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    let item: HTMLElement | null = this.getEventElement(event)
    if (item === null) {
      return
    }
    state.clean()
    this.populateCurrent(item, false)
  }

  protected getEventElement(event: MouseEvent): HTMLElement | null {
    let element = event.target as HTMLElement
    return element
  }

  protected filter(element: HTMLElement): HTMLElement | null {
    if (this.supported.indexOf(element.tagName) < 0) {
      return null
    }
    if (element.tagName === 'INPUT') {
      return this.filterInputElement(element)
    }
    return element
  }

  protected filterInputElement(element: HTMLElement): HTMLElement | null {
    const types = ['submit', 'button']
    let type = element.getAttribute('type')
    if (!type) {
      return null
    }
    if (types.indexOf(type) < 0) {
      return null
    }
    return element
  }

  protected populateCurrent(item: HTMLElement, recurse: boolean) {
    switch (item.tagName.toLowerCase()) {
      case 'p':
      case 'label':
      case 'span':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        state.push(item.outerHTML)
        state.push(item.innerText)
        break

      case 'a':
        state.push(item.outerHTML)
        state.push(item.innerText)
        state.push(item.getAttribute('href'))
        state.push(item.getAttribute('title'))
        break

      case 'img':
        state.push(item.outerHTML)
        state.push(item.getAttribute('src'))
        state.push(item.getAttribute('alt'))
        break

      case 'svg':
        state.push(item.outerHTML)
        break
      case 'input':
      case 'button':
        //@todo Need to filter on type.
        state.push(item.outerHTML)
        state.push(item.innerText)
        state.push(item.getAttribute('value'))
        break
    }
    if (state.count() > 0 && !recurse) {
      this.highLightItem(item)
    }
    // @todo Do we want to process children of non supported tags ?
    for (let i = 0; i < item.children.length; i++) {
      let child = item.children.item(i) as HTMLElement
      if (child === null || child instanceof HTMLElement === false) {
        continue
      }
      this.populateCurrent(child, true)
    }

  }
}

export default Frame