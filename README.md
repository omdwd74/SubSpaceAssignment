# SubSpaceAssignment
# Blog Stats and Search API

A Node.js application that provides statistics and search functionality for a collection of blogs.

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.

## Configuration

Before running the application, make sure to set the `adminSecret` in `app.js` to your Hasura admin secret.

## Usage

- `/api/blog-stats`: Get statistics about the blogs.
- `/api/blog-search?query=<search-term>`: Search for blogs containing a specific word.

## Caching

This application uses memoization to cache the results of blog statistics and searches for improved performance. Cached data is refreshed every 60 seconds.
