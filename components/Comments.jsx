import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import superagent from 'superagent';

import { TanStackQuerySSRCollectorContext } from '../utils/TanStackQuerySSRCollector';

const useComments = () => {
    const queryOptions = {
        queryKey: ['comments'],
        queryFn: () => superagent.get('https://jsonplaceholder.typicode.com/comments').then(res => res.body),
    }

    const { collectedQueryOptions } = useContext(TanStackQuerySSRCollectorContext);
    if (collectedQueryOptions) {
        collectedQueryOptions[JSON.stringify(queryOptions.queryKey)] = queryOptions
    }

    const { data, isLoading, error } = useQuery(queryOptions);
    return { data, isLoading, error };
}

const Comments = () => {
    const { data, isLoading, error } = useComments();

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error}</div>
    }
    return (
        <ul>
            {data.map(comment => (
                <li key={comment.id}>
                    {comment.name}
                </li>
            ))}
        </ul>
    );
}

export default Comments
