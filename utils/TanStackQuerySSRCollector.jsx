import React from 'react';

export const TanStackQuerySSRCollectorContext = React.createContext({});

export const createTanStackQuerySSRCollector = () => {
  const collectedQueryOptions = {};

  const TanStackQuerySSRCollectorProvider = ({ children }) => {
    return (
      <TanStackQuerySSRCollectorContext.Provider value={{ collectedQueryOptions }}>
        {children}
      </TanStackQuerySSRCollectorContext.Provider>
    );
  };

  return {
    collectedQueryOptions,
    TanStackQuerySSRCollectorProvider
  }
};
