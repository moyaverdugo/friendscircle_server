import express from 'express';
import cors from 'cors';
import signupRouter from './routes/signup.js'; 
import verificationRouter from './routes/verification.js'; 
import setupRouter from './routes/setup.js'; 
import loginRouter from './routes/login.js'; 
import connectionsRouter from './routes/connections.js'; 
import postsRouter from './routes/posts.js'; 
import activationRouter from "./routes/activation.js";
import forgotRouter from "./routes/forgot.js";
import resetRouter from "./routes/reset.js";
import userRouter from "./routes/user.js"; 
import homeDataRouter from "./routes/homeData.js"; 

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/signup', signupRouter);
app.use('/verification', verificationRouter);
app.use('/setup', setupRouter);
app.use('/login', loginRouter);
app.use('/connections', connectionsRouter);
app.use('/posts', postsRouter);
app.use('/activation', activationRouter);
app.use('/forgot', forgotRouter);
app.use('/reset', resetRouter);
app.use('/user', userRouter);
app.use('/homeData', homeDataRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});