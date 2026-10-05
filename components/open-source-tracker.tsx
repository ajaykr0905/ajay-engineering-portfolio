import { mergedOpenSourceContributions } from "@/lib/open-source";

export function OpenSourceTracker() {
  const mergedCount = String(mergedOpenSourceContributions.length).padStart(2, "0");

  return (
    <section aria-labelledby="open-source-heading" className="open-source-section section-tinted" id="open-source">
      <div className="shell open-source-layout">
        <div className="open-source-intro">
          <p className="eyebrow">Open source</p>
          <h2 id="open-source-heading">Upstream work, accepted.</h2>
          <p>
            Focused reliability and authentication fixes reviewed and merged by project maintainers.
          </p>
          <div aria-label={`${mergedCount} merged upstream pull requests`} className="open-source-count">
            <strong>{mergedCount}</strong>
            <span>merged upstream PRs</span>
          </div>
        </div>

        <ol aria-label="Merged open-source contributions" className="open-source-list">
          {mergedOpenSourceContributions.map((contribution, index) => (
            <li key={contribution.url}>
              <a
                aria-label={`${contribution.repository} ${contribution.pullRequest}: ${contribution.title}`}
                className="open-source-card"
                data-spectrum-option
                href={contribution.url}
                rel="noreferrer"
              >
                <span className="open-source-card-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="open-source-card-copy">
                  <span className="open-source-card-kicker">
                    {contribution.repository} <span aria-hidden="true">/</span> {contribution.pullRequest}
                  </span>
                  <strong>{contribution.title}</strong>
                  <span className="open-source-impact">{contribution.impact}</span>
                  <span className="open-source-evidence">
                    <span className="open-source-status"><span aria-hidden="true" /> Merged</span>
                    <span>{contribution.area}</span>
                    <span>{contribution.evidence}</span>
                    <time dateTime={contribution.mergedAt}>
                      {contribution.mergedOn}
                    </time>
                  </span>
                </span>
                <span aria-hidden="true" className="open-source-arrow">↗</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
