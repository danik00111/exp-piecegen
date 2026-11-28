This is a simple piece generator that isn't as abusable as 7-Bag while not droughting like Classic.

It keeps track of every piece's drought counter (how long ago it last appeared, 0 being last piece rolled) and bases how likely a piece is to appear off of that. Every piece's drought counter +1s every piece generated and =0s once it's rolled.

This piecegen takes three number inputs (`linear`, `ebase`, `edelay`), which are all plugged into the formula below.

Then, for every piece, it does a weighed random roll. Every piece's likelyhood of being rolled is proportional to `d*linear + ebase**(d-edelay)`, where `d` is how many pieces ago it last appeared. This function appears linear-ish until about `d=7`, where it starts to go exponential.
The default settings are `{ linear=1/8, ebase=1.5, edelay=8 }`. It outputs these values for `d` from 0 to 19:
```
0.0390 0.1835 0.3378 0.5067 0.6975
0.9213 1.1944 1.5417 2.0000 2.6250
03.500 04.750 06.562 09.219 13.141
18.961 27.629 40.568 59.915 88.873
```

Example, last queue is `tjisolz`:
| piece | drought | weight | % |
| --- | --- | --- | --- |
| z | 0 | 0.0390 | 1.005% |
| l | 1 | 0.1835 | 4.729% |
| o | 2 | 0.3378 | 8.706% |
| s | 3 | 0.5067 | 13.06% |
| i | 4 | 0.6975 | 17.98% |
| j | 5 | 0.9213 | 23.74% |
| t | 6 | 1.1944 | 30.78% |
| Total |  | 3.8803 | 100% |

Example, last queue is `ioljzstoljzst`:
| piece | drought | weight | % |
| --- | --- | --- | --- |
| t | 0 | 0.0390 | 0.421% |
| s | 1 | 0.1835 | 1.984% |
| z | 2 | 0.3378 | 3.652% |
| j | 3 | 0.5067 | 5.479% |
| l | 4 | 0.6975 | 7.542% |
| o | 5 | 0.9213 | 9.962% |
| i | **12** | **6.5625** | **70.96%** |
| Total |  | 9.2483 | 100% |

Drought distribution of 1_000_000 pieces with the default settings:

```
..0...1...2...3...4...5...6...7...8...9...0...1...2...3...4...5...6
00 ### 0.779% (2 consec. pieces)  |   |   |   |   |   |   |   |   |
01 ############## 3.599%  |   |   |   |   |   |   |   |   |   |   |
02 ######################### 6.347%   |   |   |   |   |   |   |   |
03 #################################### 8.964%|   |   |   |   |   |
04 ############################################# 11.342%  |   |   |
05 #################################################### 12.945%   |
06 ####################################################### 13.655%|
07 ################################################### 12.834%|   |
08 ########################################### 10.691%|   |   |   |
09 ################################ 7.996%|   |   |   |   |   |   |
10 ###################### 5.377%  |   |   |   |   |   |   |   |   |
11 ############ 3.111%|   |   |   |   |   |   |   |   |   |   |   |
12 ###### 1.515% (longest possible in 7-bag)  |   |   |   |   |   |
13 ## 0.602%  |   |   |   |   |   |   |   |   |   |   |   |   |   |
14 # 0.187%   |   |   |   |   |   |   |   |   |   |   |   |   |   |
15 0.046% |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
16 0.010% |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
17 0.001% |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
..0...1...2...3...4...5...6...7...8...9...0...1...2...3...4...5...6
```
Rows of hashtags are rounded to nearest 0.25%.

This formula was originally just `1/(1+[times piece appeared in last 35 pieces])`, but i realised that it had *zero* drought prevention, and therefore the linear part was added. And then I realised linear isn't enough, so the exponential part was added as well to introduce a soft-cap on drought length. And then I realised the harmonic sequence term is ⭕️⬅️ Does He Even Do Anything?, so I removed it.
