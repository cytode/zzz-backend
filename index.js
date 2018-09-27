const restify = require('restify');
const config = require('./config');
const server = restify.createServer();


server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use((req, res, next) => {
	req.headers.accept = 'application/json';
	return next();
});
server.use(restify.plugins.bodyParser({
    mapParams: true
}));
const corsMiddleware = require('restify-cors-middleware');
const cors = corsMiddleware({
	preflightMaxAge: 5, //Optional
	origins: ['http://localhost:4200'],
});
server.pre(cors.preflight);
server.use(cors.actual);

server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
const routes = require('./routes')(server);