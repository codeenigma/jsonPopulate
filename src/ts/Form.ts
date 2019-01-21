import state from './State'

class Form {

  protected form: HTMLFormElement
  protected datalist: HTMLDataListElement
  
  public init() {
    let form = document.getElementById('form') as HTMLFormElement
    if (form === null) {
      return
    }
    this.form = form
    this.bindForm()
  }

  protected bindForm() {
    this.form.appendChild(this.getDatalistElement())
    document.addEventListener('currentStateUpdated', () => {
      this.updateDatalist()
    })
    let inputs = this.form.getElementsByTagName('input')
    for (let i = 0; i < inputs.length; i++){
      this.bindInput(inputs[i])
    }
  }
  protected save(){
    let data: string = this.getFormData()
    let request = new XMLHttpRequest()
    let method = 'post'
    let url = this.form.getAttribute('action') as string
    request.open(method,url)
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    request.send(data)
  }
  protected getFormData(): string{
    // We only have "text" input, so can encode easily.
    let data = []
    let inputs = this.form.getElementsByTagName('input')
    for (let i = 0; i < inputs.length; i++) {
      data.push(inputs[i].name + "=" + encodeURIComponent(inputs[i].value))
    }
    return data.join("&")
  }
  protected bindInput(input: HTMLInputElement){
    let originalValue = input.value
    input.addEventListener('focus', () => {
      if(state.count() === 0){
        return
      }
      originalValue = input.value
      if(state.count() === 1){
       return input.value = state.getItem(0)
      }
      return input.value = ''
    })
    input.addEventListener('blur', () => {
      if (input.value.length === 0){
        input.value = originalValue
      }
      this.save()
    })
  }
  protected getDatalistElement() {
    let datalist = document.createElement('datalist')
    datalist.id = 'jsonpopulate-datalist'
    this.datalist = datalist
    return datalist
  }
  protected updateDatalist() {
    this.datalist.innerHTML = ''
    for(let i = 0; i < state.count(); i++){
      let option = document.createElement('option')
      option.value = state.getItem(i)
      this.datalist.appendChild(option)
    }
  }
}

export default Form