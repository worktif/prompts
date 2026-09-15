# Agent Skills Catalog Builder

This script builds a local catalog of agent skills. It discovers publicly
available skill pages, resolves their immutable Git sources, and preserves the
original skill files without transforming their contents.

## Usage

```bash
npm install
npm run crawl
```

The generated catalog is written to the configured output directory using the
following structure:

`./<output-directory>/<category>/<skill-slug>/`

Original file contents are preserved byte-for-byte. Each successfully
downloaded skill includes a source metadata file with its source page and
immutable Git commit/tree. Skills without a public source are listed in
`_crawl-errors.json` and are not replaced with reconstructed HTML.

## Configuration

```bash
HEADLESS=0 npm run crawl       # Show the browser
MAX_SKILLS=10 npm run crawl    # Run a limited test crawl
OUT_DIR=./catalog npm run crawl
DELAY_MS=1000 npm run crawl
```

For large crawls, the GitHub API may require `GITHUB_TOKEN`. The script also
works without a token when the referenced repositories are public.
