# TanStack Query automatic SSR example by data dependency tracking

Check the Network tab in browser on page load. No new API call is made because the comments data is fetched via SSR.

Important files:
1. `server.js` - for double-pass SSR implementation
2. `components/Comments.jsx` - for TanStack Query usage
3. `utils/TanStackQuerySSRCollector.jsx` - for data dependency tracking in context

Inspired by https://github.com/kmoskwiak/useSSE

## Getting started

1. Clone this repository

2. Run `yarn`

3. Run `yarn start`

4. Open http://localhost:3000/ in your browser.

## License

MIT
