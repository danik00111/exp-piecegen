This is a simple piece generator that isn't as abusable as 7-Bag while not droughting like Classic.

It keeps track of every piece's drought counter (how long ago it last appeared, 0 being last piece rolled) and bases how likely a piece is to appear off of that. Every piece's drought counter +1s every piece generated and =0s once it's rolled.

This piecegen takes a few inputs, which are by default `{ linear=1/8, exp=[1.5,8] }`.

Then, for every piece, it does a random roll, weighted by `d*linear + exp[0]**(d-exp[1])`, where `d` is how many pieces ago it last appeared. So the function appears linear-ish until about `d=7`, where it starts to go exponential.
Here are the approximate values for `d` from 0 to 19:
```
0.0390 0.1835 0.3378 0.5067 0.6975
0.9213 1.1944 1.5417 2.0000 2.6250
03.500 04.750 06.562 09.219 13.141
18.961 27.629 40.568 59.915 88.873
```

Drought distribution of 1_000_000 pieces with `{ linear=1/8, exp=[1.5,8] }` (rows of hashtags rounded to nearest 0.25%):

```
..0...1...2...3...4...5...6...7...8...9...0...1...2...3...4...5...6
00 ### 0.779% |   |   |   |   |   |   |   |   |   |   |   |   |   |
01 ############## 3.599%  |   |   |   |   |   |   |   |   |   |   |
02 ######################### 6.347%   |   |   |   |   |   |   |   |
03 #################################### 8.964%|   |   |   |   |   |
04 ############################################# 11.25 11.342%|   |
05 #################################################### 12.945%   |
06 ####################################################### 13.655%|
07 ################################################### 12.834%|   |
08 ########################################### 10.691%|   |   |   |
09 ################################ 7.996%|   |   |   |   |   |   |
10 ###################### 5.377%  |   |   |   |   |   |   |   |   |
11 ############ 3.111%|   |   |   |   |   |   |   |   |   |   |   |
12 ###### 1.515%  |   |   |   |   |   |   |   |   |   |   |   |   |
13 ## 0.602%  |   |   |   |   |   |   |   |   |   |   |   |   |   |
14 # 0.187%   |   |   |   |   |   |   |   |   |   |   |   |   |   |
15 0.046% |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
16 0.010% |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
17 0.001% |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
..0...1...2...3...4...5...6...7...8...9...0...1...2...3...4...5...6
```
This formula was originally just `1/(1+frequency)`, but i realised that this had *zero* drought prevention, and therefore the linear part was added. And then I realised linear isn't enough, so the exponential part was added as well to introduce a soft-cap on drought length. And then I realised the harmonic sequence term does literally nothing so I removed it.
