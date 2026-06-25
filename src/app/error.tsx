'use client';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => (
    <div>
        <h2>Something went wrong!</h2>
        {error.digest ? <p>Error reference: {error.digest}</p> : null}
        <button
            onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
            }
            type='button'
        >
            Try again
        </button>
    </div>
);

export default Error;
