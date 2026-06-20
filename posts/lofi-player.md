---
title: Lo-Fi Player
date: 2020-07-08
type: project
url: https://magenta.tensorflow.org/lofi-player
tags:
  - music
  - ml
summary: "A virtual room where you make music by interacting with everyday objects."
references:
  - label: MIT Tech Review
    url: https://www.technologyreview.com/2020/09/04/1008151/google-ai-machine-learning-quarantine-music/
  - label: The Verge
    url: https://www.theverge.com/2020/9/5/21424092/google-magenta-lo-fi-player-virtual-music-room-ai
  - label: engadget
    url: https://www.engadget.com/google-magenta-lo-fi-player-music-making-164501958.html
---

![Lo-Fi Player room screenshot](/projects/lofi-player.png)

A virtual room where you make music by interacting with everyday objects.

Built while working with Google Magenta. It turns a room into a playful interface for arranging loops, melodies, and textures.

The room is the sequencer: click objects, change the mood, and let the music become something closer to a toy than a DAW.

The experience is powered by machine learning models from Magenta.js. The TV represents MusicVAE, which recombines existing melodies into new ones. The radio represents MelodyRNN, generating new melodies like a small automatic loom.

- [Try Lo-Fi Player](https://magenta.github.io/lofi-player/)
- [YouTube demo](https://www.youtube.com/watch?v=lyCfSQzWg-o)
- [Read the Magenta post](https://magenta.tensorflow.org/lofi-player)
- [Source code](https://github.com/vibertthio/lofi-player)