class Split {
  
  protected split: HTMLInputElement
  protected current: any = localStorage.getItem('split') ? localStorage.getItem('split') : 40

  public init() {
    let split = document.getElementById('split')
    if(split === null){
      return
    }
    this.split = split as HTMLInputElement
    this.initSplit()
  }
  protected initSplit(){
    this.split.value = this.current
    this.resizePanes()
    this.split.addEventListener('change', () => {
      this.current = this.split.value
      localStorage.setItem('split', this.current)
      this.resizePanes()
    })

  }
  protected resizePanes(){
    let form = document.getElementById('form') as HTMLElement
    if(form === null){
      return
    }
    let frame = document.getElementById('iframe-wrap') as HTMLElement
    if(frame === null){
      return
    }
    form.style.width = this.current + '%'
    frame.style.width = 100 - this.current + '%'
    frame.style.left = this.current + '%'
  }
}
export default Split