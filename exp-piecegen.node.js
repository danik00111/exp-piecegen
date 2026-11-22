// these two functions are just formatting.
const normaliseWeights = obj => {
  const ent = Object.entries(obj);
  const scale = 100000 / ent.map(x=>x[1]).reduce((a,v)=>a+v,0);
  const norm = ent.map(([k,v])=>[k,Math.round(v*scale)]);
  return JSON.stringify(Object.fromEntries(norm));
};
const format = obj => JSON.stringify(Object.fromEntries(
  Object.entries(obj).map(([k,v])=>[k,Math.round(v*10000)/10000])
));
// they're only used for console.log debugging purposes (see last few lines of next()).

class ExpGenerator {
  constructor({ bag = 'ioljzst'.split(''), linear=1/8, ebase=1.5, edelay=8}={}) {
    this.bag=bag; this.linear=linear; this.ebase=ebase; this.edelay=edelay;
    this.droughts = {}; bag.forEach(p => {this.droughts[p]=0});
  }

  next() {
    const weights = Object.fromEntries(
      Object.entries(this.droughts).map(
        ([p,d]) => [ p, d*this.linear + this.ebase**(d-this.edelay) ]
      )
    );
    const piece = this.weightedRoll(weights);
    this.bag.forEach(p => {this.droughts[p]++});
    this.droughts[piece] = 0;
    // console.log(`d${format(this.droughts)} w${format(weights)} => ${piece}`); // debug
    return piece;
  }

  // ai generated code starts here
  weightedRoll(weights) {
    const cleaned = {};
    for (const [k, w] of Object.entries(weights)) {
      if (w<0) {
        console.warn(`"${k}"'s weight is ${w}), setting to 0`);
        cleaned[k] = 0;
      } else cleaned[k] = w;
    }
    const entries = Object.entries(cleaned);
    const total = entries.reduce((sum,[,w])=>sum+w,0);
    let r = Math.random()*total;
    for (const [k,w] of entries) {r-=w; if (r<=0) return k};
    return entries[entries.length-1][0];
  }
  // ai generated code ends here
}

const generator = new ExpGenerator({droughtboost:1/12, ebase:1.5, edelay:8}); // The default.
let queue = '';
for(let i=0; i<1e5; i++) queue += generator.next();
console.log(queue);
/*
const fs = require('node:fs');
const path = require('node:path');
const filePath = path.join(__dirname, 'queue.txt');
fs.writeFile(filePath, queue, (err) => {
  if (err) { console.error('error writing file:', err); return }
  console.log('queue sucessfully dumped to queue.txt (in the same folder as the nodejs file)');
});
*/
