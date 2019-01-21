define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Split {
        constructor() {
            this.current = localStorage.getItem('split') ? localStorage.getItem('split') : 40;
        }
        init() {
            let split = document.getElementById('split');
            if (split === null) {
                return;
            }
            this.split = split;
            this.initSplit();
        }
        initSplit() {
            this.split.value = this.current;
            this.resizePanes();
            this.split.addEventListener('change', () => {
                this.current = this.split.value;
                localStorage.setItem('split', this.current);
                this.resizePanes();
            });
        }
        resizePanes() {
            let form = document.getElementById('form');
            if (form === null) {
                return;
            }
            let frame = document.getElementById('iframe-wrap');
            if (frame === null) {
                return;
            }
            form.style.width = this.current + '%';
            frame.style.width = 100 - this.current + '%';
            frame.style.left = this.current + '%';
        }
    }
    exports.default = Split;
});
//# sourceMappingURL=Split.js.map