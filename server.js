/* eslint no-console: "off" */

import React from 'react';
import ReactDomServer from 'react-dom/server';
import express from 'express';
import browserify from 'browserify';
import babelify from 'babelify';
import App from './components/App.jsx';
import { dehydrate, QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import {
  createTanStackQuerySSRCollector,
} from './utils/TanStackQuerySSRCollector';

const app = express();
const port = 3000;

app.get('/bundle.js', (req, res) => {
  browserify('./client.js', { debug: true }).transform(babelify).bundle().pipe(res);
});

app.get('/', async (req, res) => {
  const queryClient = new QueryClient()
  const { collectedQueryOptions, TanStackQuerySSRCollectorProvider } = createTanStackQuerySSRCollector()

  // first pass to collect data dependencies
  ReactDomServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <TanStackQuerySSRCollectorProvider>
        <App />
      </TanStackQuerySSRCollectorProvider>
    </QueryClientProvider>,
  )


  // wait for all data dependencies to be resolved
  await Promise.allSettled(
    Object.values(collectedQueryOptions).map(queryOptions => queryClient.prefetchQuery(queryOptions))
  )
  const dehydratedState = dehydrate(queryClient)

  // second pass to render the app and inject the dehydrated state with the resolved
  // data dependencies
  const html = ReactDomServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <App />
      </Hydrate>
    </QueryClientProvider>,
  )

  res.send(`
    <html>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};
        </script>
      </body>
    </html>
  `)

  queryClient.clear()
});

app.listen(port, () => {
  console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
