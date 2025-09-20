import { Hono } from 'hono'
import {VerifyRouter} from './routes/HandlingApis'
import userRoute from './routes/user';
import {cors} from 'hono/cors';


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>();


app.use('/*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
  credentials: true
}))

app.route("/api/v1/user" , userRoute);
app.route("/api/v1/HandlingApi" , VerifyRouter);


export default app