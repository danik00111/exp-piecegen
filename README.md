It took quite a bit of brainstorming with Grok to finally end up with this piecegen.

The code was written entirely by me, in TextEdit, except for the weighted RNG part.

This piecegen keeps track of two things:

- recent queue (`history=35` pieces by default)
- how many pieces ago every piece last appeared (0 if it's the previous piece rolled)

And takes one singular input:

- how hard it should boost a droughted piece (`droughtboost=0.05` by default)

Then, for every piece, it does a random roll, weighted by `1/(1+frequency) + droughtboost*drought`, where `frequency` is how many times the piece appears within the last `history` pieces and `drought` is how many pieces ago it last appeared.

This formula was originally just `1/(1+frequency)`, but i realised that this had *zero* drought prevention, and therefore the second part was added.

I attached five separate 1000-piece queues here for a quick preview.

The piece generator is called "Harmonic" in reference to the harmonic series, because the first half of it resembles just that. Just a working name, though. I'm open to ideas on how to name it.
