define(["require", "exports", "./State"], function (require, exports, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Frame {
        constructor() {
            this.supported = [
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
                'INPUT',
                'LABEL'
            ];
        }
        init() {
            let frame = document.getElementById('iframe');
            if (frame === null) {
                return;
            }
            this.iFrame = frame;
            this.bindFrame();
            this.iFrame.addEventListener('load', () => {
                this.bindFrame();
            });
        }
        bindFrame() {
            let frame = this.iFrame;
            if (frame.contentDocument === null || frame.contentDocument.body === null) {
                return;
            }
            const targetBody = frame.contentDocument.body;
            targetBody.appendChild(this.getHighLightElement());
            targetBody.addEventListener('click', (event) => {
                this.clicked(event);
            });
        }
        getHighLightElement() {
            //@todo This should be a custom html element and use shadow DOM.
            const highlight = document.createElement('div');
            highlight.id = 'json-populate-highlight';
            highlight.style.cssText = 'background-color:green;border:1px solid #00F;margin:0;padding:0;opacity:0.3;width:0;height:0;position:absolute;left:-9999;';
            highlight.innerHTML = '&nbsp;';
            this.highLightElement = highlight;
            return this.highLightElement;
        }
        highLightItem(item) {
            let style = this.highLightElement.style;
            let coord = item.getBoundingClientRect();
            let zIndex = (item.style.zIndex) ? item.style.zIndex + 1 : 1;
            style.width = coord.width + 'px';
            style.height = coord.height + 'px';
            style.top = coord.top + this.iFrame.contentWindow.scrollY + 'px';
            style.left = coord.left + this.iFrame.contentWindow.scrollX + 'px';
            style.zIndex = zIndex.toString();
        }
        clicked(event) {
            if (event.altKey) {
                return this.processAltClicked(event);
            }
            return this.processClicked(event);
        }
        processAltClicked(event) {
            let item = this.getEventElement(event);
            if (item === null) {
                return;
            }
            // Not a link, nothing we should do.
            if (item.hasAttribute('href') === false) {
                return;
            }
            let oldRef = item.getAttribute('href');
            if (oldRef === null) {
                return;
            }
            // Anchor link, nothing we should do.
            if (this.isAnchor(oldRef)) {
                return;
            }
            // Link to another page, pass through to iframe.
            var original = this.iFrame.getAttribute('src');
            var newRef = original + '&page=' + oldRef;
            this.iFrame.setAttribute('src', newRef);
            event.preventDefault();
            event.stopPropagation();
        }
        isAnchor(href) {
            if (href.indexOf('#') === 0) {
                return true;
            }
            return false;
        }
        processClicked(event) {
            event.preventDefault();
            event.stopPropagation();
            let item = this.getEventElement(event);
            if (item === null) {
                return;
            }
            State_1.default.clean();
            this.populateCurrent(item, false);
        }
        getEventElement(event) {
            let element = event.target;
            return element;
        }
        filter(element) {
            if (this.supported.indexOf(element.tagName) < 0) {
                return null;
            }
            return element;
        }
        populateCurrent(item, recurse) {
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
                    State_1.default.push(item.outerHTML);
                    State_1.default.push(item.innerText);
                    break;
                case 'a':
                    State_1.default.push(item.outerHTML);
                    State_1.default.push(item.innerText);
                    State_1.default.push(item.getAttribute('href'));
                    break;
                case 'img':
                    State_1.default.push(item.outerHTML);
                    State_1.default.push(item.getAttribute('src'));
                    break;
                case 'svg':
                    State_1.default.push(item.outerHTML);
                    break;
                case 'input':
                    //@todo Need to filter on type.
                    State_1.default.push(item.outerHTML);
                    State_1.default.push(item.getAttribute('value'));
                    break;
            }
            if (State_1.default.count() > 0 && !recurse) {
                this.highLightItem(item);
            }
            // @todo Do we want to process children of non supported tags ?
            for (let i = 0; i < item.children.length; i++) {
                let child = item.children.item(i);
                if (child === null || child instanceof HTMLElement === false) {
                    continue;
                }
                this.populateCurrent(child, true);
            }
        }
    }
    exports.default = Frame;
});
//# sourceMappingURL=Frame.js.map