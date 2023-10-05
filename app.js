const express = require('express');
const app = express();
const axios = require('axios');
const _ = require('lodash');

const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const adminSecret = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';

function handleErrorResponse(res, error) {
  console.error('Error:', error);
  res.status(500).send('Internal Server Error');
}

const memoizedBlogStats = _.memoize(async () => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'x-hasura-admin-secret': adminSecret
      }
    });

    const blogs = response.data.blogs;

    const titles = blogs.map(blog => blog.title);
    const longestTitle = _.maxBy(titles, 'length');
    const count = _.countBy(titles, title => title.toLowerCase().includes('privacy'))['true'] || 0;

    const uniqueTitles = _.uniq(titles);

    const responseJson = {
      numberOfBlogs: blogs.length,
      longestTitle: longestTitle,
      numberOfPrivacy: count,
      uniqueBlogsTitle: uniqueTitles
    };

    return responseJson;
  } catch (error) {
    handleErrorResponse(res, error);
  }
}, () => 'cachedResults', 60000); 

const memoizedBlogSearch = _.memoize(async (wordToFind) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'x-hasura-admin-secret': adminSecret
      }
    });

    const blogs = response.data.blogs;
    const matchBlog = [];
    wordToFind = wordToFind.toLowerCase(); 

    blogs.forEach((blog) => {
      if (blog.title.toLowerCase().includes(wordToFind)) {
        matchBlog.push(blog);
      }
    });

    return matchBlog;
  } catch (error) {
    handleErrorResponse(res, error);
  }
}, (wordToFind) => wordToFind, 60000); 

//for status
app.get('/api/blog-stats', async (req, res) => {
  const cachedResults = await memoizedBlogStats();
  res.send(cachedResults);
});
//for searching
app.get('/api/blog-search', async (req, res) => {
  const wordToFind = req.query.query.toLowerCase();
  const cachedResults = await memoizedBlogSearch(wordToFind);
  res.send(cachedResults);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
