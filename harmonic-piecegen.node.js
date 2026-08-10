const normaliseWeights = obj => {
  const ent = Object.entries(obj);
  const scale = 10000 / ent.map(x=>x[1]).reduce((a,v)=>a+v,0);
  const norm = ent.map(([k,v])=>[k,Math.round(v*scale)]);
  return JSON.stringify(Object.fromEntries(norm));
};
const format = obj => JSON.stringify(Object.fromEntries(
  Object.entries(obj).map(([k,v])=>[k,Math.round(v*100)/100])
));

class HarmonicGenerator {
// The exponent is very, very lenient, allowing 16~18 droughts to happen. In case that's what you're into. Adjust as you wish. I set it to [2,10] near the end of the file to basically cap droughts at 14~17.
  constructor({
    bag = 'ioljzst'.split(''),
    history=35, droughtboost=1/12,
    ebase=1.5, edelay=10
  }={}) {
    this.history = new Array(history).fill(null);
    this.bag = bag;
    this.droughts = {};
    this.droughtboost=droughtboost;
    [this.ebase, this.edelay] = [ebase, edelay];
    bag.forEach(p => {this.droughts[p]=0});
  }
  
  // ai generated code starts here
  weightedRoll(weights) {
    const cleaned = {};
    for (const [k, w] of Object.entries(weights)) {
      if (w<0) {
        console.warn(`"${k}"'s weight is ${w}), setting to 0`);
        cleaned[k] = 0;
      } else { cleaned[k] = w };
    }
    const entries = Object.entries(cleaned);
    const total = entries.reduce((sum,[,w])=>sum+w,0);
    let r = Math.random()*total;
    for (const [k,w] of entries) {r-=w; if (r<=0) return k};
    return entries[entries.length-1][0];
  }
  // ai generated code ends here

  next() {
    const freq = {}; const weights = {};
    this.bag.forEach(p => {freq[p]=0});
    this.history.forEach(p => { if(this.bag.includes(p)) freq[p]++ });
    this.bag.forEach(p => {
      const harmonic = 1/(1+freq[p]);
      const linear = this.droughtboost*this.droughts[p];
      const exponential = this.ebase**(this.droughts[p]-this.edelay);
      weights[p] = harmonic + linear + exponential;
    });
    const piece = this.weightedRoll(weights);
    /*console.log(
      'f' + format(freq)
    + ' d' + format(this.droughts)
    + ' w' + format(weights)
    + ' => ' + piece
    );*/ // debug
    this.bag.forEach(p => {this.droughts[p]++}); this.droughts[piece] = 0;
    this.history.push(piece); this.history.shift(); return piece;
  }
}

const generator_v1_light = new HarmonicGenerator({history:35, droughtboost:0.05, ebase:1});
const generator_v1_medium = new HarmonicGenerator({history:35, droughtboost:1/12, ebase:1});
const generator_v2_medium = new HarmonicGenerator({history:35, droughtboost:1/12, ebase:1.5}); // The default.
const generator_v2_heavy = new HarmonicGenerator({history:35, droughtboost:1/12, ebase:2});
// didn't experiment with changing the exponent's delay. i think 10 is the sweetspot for it to start ramping up.
let queues = { v1_l:'', v1_m:'', v2_m:'', v2_h:'' };
for(let i=0; i<1e4; i++) queues.v1_l += generator_v1_light.next();
for(let i=0; i<1e4; i++) queues.v1_m += generator_v1_medium.next();
for(let i=0; i<1e4; i++) queues.v2_m += generator_v2_medium.next();
for(let i=0; i<1e4; i++) queues.v2_h += generator_v2_heavy.next();

console.log(Object.entries(queues).map(x=>`${x[0]}: ${x[1]}`).join('\n\n'));
