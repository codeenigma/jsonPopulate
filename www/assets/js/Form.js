define(["require", "exports", "./State"], function (require, exports, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Form {
        init() {
            let form = document.getElementById('form');
            if (form === null) {
                return;
            }
            this.form = form;
            this.bindForm();
        }
        bindForm() {
            this.form.appendChild(this.getDatalistElement());
            document.addEventListener('currentStateUpdated', () => {
                this.updateDatalist();
            });
            let inputs = this.form.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i++) {
                this.bindInput(inputs[i]);
            }
        }
        save() {
            let data = this.getFormData();
            let request = new XMLHttpRequest();
            let method = 'post';
            let url = this.form.getAttribute('action');
            request.open(method, url);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send(data);
        }
        getFormData() {
            // We only have "text" input, so can encode easily.
            let data = [];
            let inputs = this.form.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i++) {
                data.push(inputs[i].name + "=" + encodeURIComponent(inputs[i].value));
            }
            return data.join("&");
        }
        bindInput(input) {
            input.addEventListener('focus', () => {
                if (State_1.default.count() === 0) {
                    return;
                }
                if (State_1.default.count() === 1) {
                    return input.value = State_1.default.getItem(0);
                }
                return input.value = '';
            });
            input.addEventListener('blur', () => {
                this.save();
            });
        }
        getDatalistElement() {
            let datalist = document.createElement('datalist');
            datalist.id = 'jsonpopulate-datalist';
            this.datalist = datalist;
            return datalist;
        }
        updateDatalist() {
            this.datalist.innerHTML = '';
            for (let i = 0; i < State_1.default.count(); i++) {
                let option = document.createElement('option');
                option.value = State_1.default.getItem(i);
                this.datalist.appendChild(option);
            }
        }
    }
    exports.default = Form;
});
//# sourceMappingURL=Form.js.map