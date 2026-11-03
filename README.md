# Save the Sadhya

Wedding invitation and RSVP site for Gayathri & Anand —
live at https://sdooodly.github.io/saveTheSadhya/

Everything about the wedding (names, date, muhurtham, venue, RSVP deadline,
site address) lives in `src/wedding.config.ts`.

## Develop

```sh
npm install
npm run dev          # http://localhost:3000
```

## Check before deploying

```sh
npm run lint
npm test             # unit tests: dates, calendar invite, RSVP rules
```

Dates must read the same everywhere, so also run the tests in another time zone:

```sh
TZ=America/Los_Angeles npm test
```

End-to-end checks of the built site (needs Python + Playwright; never touches
the real RSVP sheet — requests to Google are intercepted):

```sh
npm run build
mkdir -p /tmp/site && ln -sfn "$PWD/out" /tmp/site/saveTheSadhya
(cd /tmp/site && python3 -m http.server 8790) &
python3 tests/e2e.py
```

## Deploy

```sh
npm run deploy       # lint + tests + build, then publishes out/ to the gh-pages branch
```

GitHub Pages serves the `gh-pages` branch. Production builds automatically use
the `/saveTheSadhya` path; no environment variables are needed.
