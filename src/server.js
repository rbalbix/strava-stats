import express from 'express';
import axios from 'axios';

// const api = axios.create({ baseURL: 'https://www.strava.com/oauth' });

const app = express();
app.use(express.json());

app.use(express.static('./'));

app.get('/', async (req, res) => {
  console.log(req);
  // const response = await api.get(
  //   '/authorize?client_id=63218&response_type=code&redirect_uri=http://localhost:3333/login&approval_prompt=force&scope=read,profile:read_all,activity:read,activity:read_all'
  // );
  // console.log(response.data);
  // return res.send(response.data);
  res.render('index.html');
});

app.get('/authorize', async (req, res) => {
  console.log('AUTHORIZE *********************');
  console.log(req.query.code);

  const url = `https://www.strava.com/oauth/token?client_id=63218&client_secret=ac8f12b31be72160ce0248b6f16c7c385e19000a&code=${req.query.code}&grant_type=authorization_code`;

  console.log(url);

  // const response = await api.get(
  const response = await axios.post(url);

  console.log(response.data);

  // return res.send({ token: response.data });

  return res.send({ message: req.query.code });
});

// https://www.strava.com/oauth/token
// ?client_id=63218
// &client_secret=ac8f12b31be72160ce0248b6f16c7c385e19000a
// &code=bbc8aaeb68c5c0dd78b1d8d85c5f9bff2b1d2a7e
// &grant_type=authorization_code

app.listen(3333, () => {
  console.log('Server running');
});
