import Koa from 'koa';
import KoaRouter from 'koa-router';

const app = new Koa();
const router = new KoaRouter();

router.get('/', async (ctx, next) => {
  ctx.response.body = JSON.stringify(process.version);
  await next();
});

// prettier-ignore
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4295);
