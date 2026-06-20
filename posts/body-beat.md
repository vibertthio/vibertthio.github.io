---
title: Body Beat
date: 2018-02-01
type: project
tags:
  - music
  - ml
summary: "A body-controlled rhythm experiment that turns movement into a beat interface."
references:
  - label: ml5.js
    url: https://ml5js.org/community
---

![Body Beat PoseNet screenshot](/projects/body-beat.png)

<iframe width="560" height="315" src="https://www.youtube.com/embed/2GzFCEiiut8?si=CIEmfqY2yFopZxPA" title="Body Beat YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Body Beat is a body-controlled rhythm experiment built around the idea that movement can become the interface for making beats.

Instead of starting from pads, knobs, or a timeline, the piece uses body motion as the input. The fun is in making rhythm feel less like editing and more like moving.

It uses PoseNet to map physical gestures to audio parameters: left hand controls kick volume, right hand controls snare volume, and the height difference between hands controls snare delay to create a controllable shuffle. The visual feedback makes the distance between hands feel tangible, like charging up a visible rhythm field.

- [Source code](https://github.com/vibertthio/body-rhythm)