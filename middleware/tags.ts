class Tags{
  t: string;
  constructor(t: string){
    this.t = t;
    if (this.t === " ") {
      this.t = ""
    }
  }

  get(): string[] {
    let p = this.t.split(",")
    let q = []
    for (const e of p) {
      if (e !== "") {
        let f = e;
        if (f.charAt(0) === " ") {
          f = f.substring(1, f.length)
        }
        if (f.charAt(f.length - 1) === " ") {
          f = f.substring(0, f.length - 1)
        }
        q.push(f)
      }
    }
    return q;
  }
}

export default Tags
