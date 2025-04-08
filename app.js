const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/Capstone/dev-data/data/blogs-simple.json`)
);

const getAllPosts = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
};

const getPost = (req, res) => {
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
};

const createPost = (req, res) => {
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
};

const updatePost = (req, res) => {
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
};

const deletePost = (req, res) => {
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
};

// app.get('/api/v1/post', getAllPosts);
// app.post('/api/v1/post', createPost);
// app.get('/api/v1/post/:id', getPost);
// app.patch('/api/v1/post/:id', updatePost);
// app.delete('/api/v1/post/:id', deletePost);

app.route('/api/v1/post').get(getAllPosts).post(createPost);
app.route('/api/v1/post/:id').get(getPost).patch(updatePost).delete(deletePost);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
});
