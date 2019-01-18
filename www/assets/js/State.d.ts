/**
 * Global state storage.
 */
declare class State {
    protected current: Array<any>;
    getCurrent(): any[];
    push(item: any): void;
    clean(): void;
    count(): number;
    getItem(index: number): string;
    protected emit(eventName: string): void;
}
declare const state: State;
export default state;
