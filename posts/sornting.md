---
title: Sornting
date: 2018-12-24
type: project
url: https://vibertthio.com/sornting/
tags:
  - music
  - ml
  - game
summary: "A music experiment collected by the Magenta community demos."
references:
  - label: magenta
    url: https://magenta.tensorflow.org/demos/community/
---

![Sornting gameplay still](/projects/sornting.png)

Sornting = sort + song.

Sornting is a web-based musical AI game built on a musical machine learning algorithm that interpolates between melodies.

The player has to figure out the original order of the interpolation between different melodies. As the game progresses, the difficulty increases. I was not trying to claim the interpolation is perfect; the point is that by listening carefully, players can understand both the model and some of its weaknesses.

The game uses Tone.js and MusicVAE. Drag the melodies into the golden box, click boxes to listen, and try to reconstruct the path between musical ideas.

- [Play it here](https://vibertthio.com/sornting)
- [Source code](https://github.com/vibertthio/sornting)