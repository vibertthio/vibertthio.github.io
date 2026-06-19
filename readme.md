# vibertthio.com

This is my personal website.

## Development

```sh
npm install
npm run dev
```

The site is a Vite + React single-page app. The design is based on the Claude design export in `/Users/vibertthio/Desktop/20260619155349_claude_design/I want to build a new personal website.zip`.

## Publishing posts

Every feed item lives in `posts/*.md`. Add a new markdown file with frontmatter like:

```md
---
title: My new post
date: 2026-06-19
type: post
tags:
  - music
  - tools
summary: "Optional short homepage blurb."
---

Write the post body in markdown.
```

Supported frontmatter:

- `title`: optional for tweets/short notes, recommended for posts and projects.
- `date`: required, in `YYYY-MM-DD` format.
- `type`: `post`, `project`, `tweet`, `idea`, `list`, `wip`, or `thesis`.
- `tags`: optional list of tags. The visible tag chips are inferred directly from all markdown files plus each file's `type`.
- `summary`: optional homepage excerpt. If omitted, the first markdown block is used.
- `url`: optional external project URL.
- `references`: optional list of `{ label, url }` links for press or related pages.

Markdown is parsed during Vite builds by the local `posts-from-markdown` plugin in `vite.config.js`, using `yaml` for frontmatter and `marked` for markdown-to-HTML.

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`. The workflow installs dependencies with `npm ci`, builds static files into `dist`, and publishes that directory to the `gh-pages` branch.

After deploy, check [social previews](https://socialsharepreview.com/?url=https://vibertthio.com), [Twitter](https://cards-dev.twitter.com/validator), and [Facebook](https://developers.facebook.com/tools/debug/?q=https%3A%2F%2Fvibertthio.com%2F).
