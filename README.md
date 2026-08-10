It took quite a bit of brainstorming with Grok to finally end up with the idea for this piecegen.

The code was written entirely by me, in TextEdit, except for the weighted RNG part.

This piecegen keeps track of two things:

- recent queue (`history=35` pieces by default)
- how many pieces ago every piece last appeared (0 if it's the previous piece rolled)

And takes a few inputs:

- how hard it should boost a droughted piece (`droughtboost=1/12` by default)
- (optional) second, exponential layer to boosting droughted pieces, with a base and delay (`ebase=1.5`, `edelay=10` by default, although may do `ebase=2` as well), which may be turned off by setting `ebase=1`

Then, for every piece, it does a random roll, weighted by `1/(1+frequency) + droughtboost*drought + ebase**(drought-edelay)`, where `frequency` is how many times the piece appears within the last `history` pieces and `drought` is how many pieces ago it last appeared.

This formula was originally just `1/(1+frequency)`, but i realised that this had *zero* drought prevention, and therefore the second part was added. And then I realised linear isn't enough, so the third part was added as well to introduce a soft-cap on drought length.

The piece generator is called "Harmonic" in reference to the harmonic series, because the first part of it resembles just that. Just a working name, though. I'm open to ideas on how to name it.
