declare class Form {
    protected form: HTMLFormElement;
    protected datalist: HTMLDataListElement;
    init(): void;
    protected bindForm(): void;
    protected save(): void;
    protected getFormData(): string;
    protected bindInput(input: HTMLInputElement): void;
    protected getDatalistElement(): HTMLDataListElement;
    protected updateDatalist(): void;
}
export default Form;
