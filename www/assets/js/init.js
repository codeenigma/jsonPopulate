define(["require", "exports", "./Frame", "./Form", "./Split"], function (require, exports, Frame_1, Form_1, Split_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const frame = new Frame_1.default();
    const form = new Form_1.default();
    const split = new Split_1.default();
    form.init();
    frame.init();
    split.init();
});
//# sourceMappingURL=init.js.map