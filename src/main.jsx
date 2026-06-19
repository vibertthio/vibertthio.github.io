import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ENTRIES } from "virtual:posts";
import "./styles.css";

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash) return { kind: "home", tag: null };

  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "tag" && parts[1]) {
    return { kind: "home", tag: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === "p" && parts[1]) {
    return { kind: "post", slug: decodeURIComponent(parts[1]) };
  }
  return { kind: "home", tag: null };
}

function useHashRoute() {
  const [route, setRoute] = useState(parseRoute);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}

function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return [dark, setDark];
}

function entryTags(entry) {
  return [entry.type, ...(entry.tags || []).filter((tag) => tag !== entry.type)];
}

function fmtDate(iso) {
  const [year, month, day] = iso.split("-");
  return `${year}.${month}.${day}`;
}

const tagLabels = {
  idea: "ideas",
  list: "lists",
  post: "essays",
  project: "projects",
  thesis: "theses",
  tweet: "tweets",
  wip: "wips",
};

function labelForTag(tag) {
  return tagLabels[tag] || tag;
}

function titleFor(entry) {
  return entry.title || entry.summary || entry.slug;
}

function TopBar({ dark, setDark }) {
  return (
    <div className="topbar">
      <a className="brand" href="#/">
        vibertthio
      </a>
      <div className="nav">
        <a href="#/">home</a>
        <a href="https://github.com/vibertthio" target="_blank" rel="noreferrer">
          github
        </a>
        <a href="https://x.com/vibertthio" target="_blank" rel="noreferrer">
          x
        </a>
        <a href="/rss.xml" target="_blank" rel="noreferrer">
          rss
        </a>
        <button className="toggle" onClick={() => setDark((value) => !value)} title="toggle theme">
          {dark ? "☾" : "☀"}
        </button>
      </div>
    </div>
  );
}

function Bio() {
  return (
    <p className="bio">
      <span className="wave">🙌</span> Hi, I&apos;m Vibert Thio. I make music easier to play with,
      at <a href="https://suno.com/">Suno</a>, ex TikTok, Google Magenta. I built{" "}
      <a href="https://magenta.tensorflow.org/lofi-player" target="_blank" rel="noreferrer">
        Lo-Fi Player
      </a>
      ,{" "}
      <a href="https://vibertthio.com/beact/" target="_blank" rel="noreferrer">
        Beact
      </a>
      ,{" "}
      <a href="https://vibertthio.com/karesansui/" target="_blank" rel="noreferrer">
        Karesansui
      </a>
      .{" "}
      Here are my <a href="#/tag/post">essays</a> and <a href="#/tag/project">projects</a>.
    </p>
  );
}

function ReferenceLinks({ references }) {
  if (!references?.length) return null;

  return (
    <span className="refs">
      {" "}
      [
      {references.map((reference, index) => (
        <React.Fragment key={reference.url}>
          {index > 0 && "] ["}
          <a href={reference.url} target="_blank" rel="noreferrer">
            {reference.label}
          </a>
        </React.Fragment>
      ))}
      ]
    </span>
  );
}

function FeedRow({ entry }) {
  const link = `#/p/${encodeURIComponent(entry.slug)}`;
  const tags = entryTags(entry);

  return (
    <div className={`row ${entry.type}`}>
      <span className="date">{fmtDate(entry.date)}</span>
      <div className="body">
        {entry.type === "tweet" || entry.type === "idea" ? (
          <a href={link} className="plain-link">
            {entry.summary}
          </a>
        ) : (
          <>
            <a href={link}>{titleFor(entry)}</a>
            <ReferenceLinks references={entry.references} />
          </>
        )}
        <span className="row-tags">
          {tags.map((tag) => (
            <a key={tag} className="chip" href={`#/tag/${encodeURIComponent(tag)}`}>
              {labelForTag(tag)}
            </a>
          ))}
        </span>
      </div>
    </div>
  );
}

function TagChips({ active }) {
  const counts = useMemo(() => {
    const map = {};
    ENTRIES.forEach((entry) => {
      entryTags(entry).forEach((tag) => {
        map[tag] = (map[tag] || 0) + 1;
      });
    });
    return map;
  }, []);

  const primary = ["post", "project"].filter((tag) => counts[tag]);
  const typeOrder = ["post", "thesis", "wip", "idea", "list", "tweet", "project"];
  const restTypes = typeOrder.filter((tag) => counts[tag] && !primary.includes(tag));
  const restTags = Object.entries(counts)
    .filter(([tag]) => !typeOrder.includes(tag))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
  const rest = [...restTypes, ...restTags];
  const activeIsHidden = active && rest.includes(active);
  const [open, setOpen] = useState(Boolean(activeIsHidden));

  useEffect(() => {
    if (activeIsHidden) setOpen(true);
  }, [activeIsHidden]);

  const chip = (tag) => (
    <a key={tag} className={`chip ${active === tag ? "active" : ""}`} href={`#/tag/${encodeURIComponent(tag)}`}>
      {labelForTag(tag)}
      <span className="n">{counts[tag]}</span>
    </a>
  );
  const allChip = (
    <a className={`chip all ${!active ? "active" : ""}`} href="#/">
      all <span className="n">{ENTRIES.length}</span>
    </a>
  );

  return (
    <div className="chips">
      {allChip}
      {primary.map(chip)}
      {open && rest.map(chip)}
      <button className="chip toggle-tags" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        {open ? "less -" : "all tags +"}
      </button>
    </div>
  );
}

function HomePage({ tag }) {
  const filtered = useMemo(() => {
    if (!tag) return ENTRIES;
    return ENTRIES.filter((entry) => entryTags(entry).includes(tag));
  }, [tag]);

  return (
    <>
      <Bio />
      <TagChips active={tag} />
      <div className="feed">
        {filtered.length === 0 ? (
          <div className="empty">nothing here yet ✿</div>
        ) : (
          filtered.map((entry) => <FeedRow key={entry.slug} entry={entry} />)
        )}
      </div>
    </>
  );
}

function PostPage({ slug }) {
  const index = ENTRIES.findIndex((entry) => entry.slug === slug);

  if (index === -1) {
    return (
      <>
        <a className="back" href="#/">
          ← home
        </a>
        <div className="empty">post not found</div>
      </>
    );
  }

  const entry = ENTRIES[index];
  const newer = ENTRIES[index - 1];
  const older = ENTRIES[index + 1];

  return (
    <div className="post">
      <a className="back" href="#/">
        ← home
      </a>
      <h1>{titleFor(entry)}</h1>
      <div className="post-meta">
        <span>{fmtDate(entry.date)}</span>
        <span>·</span>
        {entryTags(entry).map((tag) => (
          <a key={tag} className="chip" href={`#/tag/${encodeURIComponent(tag)}`}>
            {labelForTag(tag)}
          </a>
        ))}
      </div>

      <div className="post-body" dangerouslySetInnerHTML={{ __html: entry.html }} />

      {entry.url && (
        <p className="external-link">
          <a href={entry.url} target="_blank" rel="noreferrer">
            open project →
          </a>
        </p>
      )}
      {!!entry.references?.length && (
        <p className="reference-list">
          featured in:{" "}
          {entry.references.map((reference, referenceIndex) => (
            <React.Fragment key={reference.url}>
              {referenceIndex > 0 && ", "}
              <a href={reference.url} target="_blank" rel="noreferrer">
                {reference.label}
              </a>
            </React.Fragment>
          ))}
        </p>
      )}

      <div className="pn">
        {newer ? (
          <a className="pn-card prev" href={`#/p/${encodeURIComponent(newer.slug)}`}>
            <span className="arrow">← newer</span>
            <span className="title">{titleFor(newer)}</span>
          </a>
        ) : (
          <span className="pn-card prev">
            <span className="arrow">← newer</span>
            <span className="muted">—</span>
          </span>
        )}
        {older ? (
          <a className="pn-card next" href={`#/p/${encodeURIComponent(older.slug)}`}>
            <span className="arrow">older →</span>
            <span className="title">{titleFor(older)}</span>
          </a>
        ) : (
          <span className="pn-card next">
            <span className="arrow">older →</span>
            <span className="muted">—</span>
          </span>
        )}
      </div>
    </div>
  );
}

function App() {
  const route = useHashRoute();
  const [dark, setDark] = useTheme();

  return (
    <div className="col">
      <TopBar dark={dark} setDark={setDark} />
      {route.kind === "post" ? <PostPage slug={route.slug} /> : <HomePage tag={route.tag} />}
      <div className="foot">
        <span>vibertthio.com</span>
        <span>
          <a href="/rss.xml" target="_blank" rel="noreferrer">
            rss
          </a>{" "}
          · made with care
        </span>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
