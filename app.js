const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/Capstone/dev-data/data/blogs-simple.json`)
);

app.get('/api/v1/post', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

app.get('/api/v1/post/:id', (req, res) => {
  const id = req.params.id * 1;
  const post = posts.find((el) => el.id === id);

  if (!post) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

app.post('/api/v1/post', (req, res) => {
  const newId = posts[posts.length - 1].id + 1;
  const newPost = Object.assign({ id: newId }, req.body);

  posts.push(newPost);

  fs.writeFile(
    `${__dirname}/Capstone/dev-data/data/blogs-simple.json`,
    JSON.stringify(posts),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          posts: newPost,
        },
      });
    }
  );
});

app.patch('/api/v1/post/:id', (req, res) => {
  if (req.params.id * 1 > posts.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      post: '<Updated post here...>',
    },
  });
});

app.delete('/api/v1/post/:id', (req, res) => {
  if (req.params.id * 1 > posts.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
});
