declare class Frame {
    protected supported: Array<string>;
    protected iFrame: HTMLIFrameElement;
    protected highLightElement: HTMLDivElement;
    init(): void;
    protected bindFrame(): void;
    protected getHighLightElement(): HTMLDivElement;
    protected highLightItem(item: HTMLElement): void;
    protected clicked(event: MouseEvent): void;
    protected processAltClicked(event: MouseEvent): void;
    protected isAnchor(href: string): boolean;
    protected processClicked(event: MouseEvent): void;
    protected getEventElement(event: MouseEvent): HTMLElement | null;
    protected filter(element: HTMLElement): HTMLElement | null;
    protected filterInputElement(element: HTMLElement): HTMLElement | null;
    protected populateCurrent(item: HTMLElement, recurse: boolean): void;
}
export default Frame;
