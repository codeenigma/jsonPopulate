/**
 * Global state storage.
 */

class State {
  protected current: Array<any> = []
  public getCurrent() {
    return this.current
  }
  public push(item: any) {
    this.current.push(item)
    this.emit('currentStateUpdated')
  }
  public clean() {
    this.current = []
    this.emit('currentStateUpdated')
  }
  public count(): number{
    return this.current.length
  }

  public getItem(index: number): string{
    if(this.current[index]){
      return this.current[index]
    }
    return ''
  }
  protected emit(eventName: string){
    let event = new Event(eventName)
    document.dispatchEvent(event)
  }

}

const state = new State()

export default state