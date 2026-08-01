class HarmonicGenerator {
  constructor({ history=35, bag = 'ioljzst'.split(''), droughtboost=0.05 }={}) {
    this.history = new Array(history).fill(null);
    this.bag = bag;
    this.droughts = {};
    this.droughtboost=droughtboost;
    bag.forEach(p => {this.droughts[p]=0});
  }
  
  // ai generated code starts here
  weightedRoll(weights) {
    const cleaned = {};
    for (const [key, weight] of Object.entries(weights)) {
      if (weight < 0) {
        console.warn(`"${key}"'s weight is ${weight}), setting to 0`);
        cleaned[key] = 0;
      } else cleaned[key] = weight;
    }
    const entries = Object.entries(cleaned);
    const total = entries.reduce((sum,[,w]) => sum+w,0);
    let r = Math.random()*total;
    for (const [k,w] of entries) {r-=w; if (r<=0) return k}
    return entries[entries.length - 1][0];
  }
  // ai generated code ends here

  next() {
    const freq = {}; const weights = {};
    this.bag.forEach(p => {freq[p]=0});
    this.history.forEach(p => { if(this.bag.includes(p)) freq[p]++ });
    this.bag.forEach(p => {
      weights[p] = 1/(1+freq[p]) + this.droughtboost*this.droughts[p];
    });
    const piece = this.weightedRoll(weights);
    this.bag.forEach(p => {this.droughts[p]++}); this.droughts[piece] = 0;
    this.history.push(piece); this.history.shift(); return piece;
  }
}

const generator = new HarmonicGenerator();
let queue = '';
for(let i=0; i<1000; i++) queue += generator.next();
console.log(queue);