/**
 * Global state storage.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class State {
        constructor() {
            this.current = [];
        }
        getCurrent() {
            return this.current;
        }
        push(item) {
            this.current.push(item);
            this.emit('currentStateUpdated');
        }
        clean() {
            this.current = [];
            this.emit('currentStateUpdated');
        }
        count() {
            return this.current.length;
        }
        getItem(index) {
            if (this.current[index]) {
                return this.current[index];
            }
            return '';
        }
        emit(eventName) {
            let event = new Event(eventName);
            document.dispatchEvent(event);
        }
    }
    const state = new State();
    exports.default = state;
});
//# sourceMappingURL=State.js.map