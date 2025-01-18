const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Your database file
const middlewares = jsonServer.defaults();

// Custom middleware to handle `id` <-> `_id` conversion for all requests
server.use((req, res, next) => {
    debugger
    // Convert `id` to `_id` for incoming requests (POST, PUT, PATCH)
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (req.body.id) {
            req.body._id = req.body.id;
            delete req.body.id;
        }
    }

    // Convert `id` in URL parameters to `_id` for GET, PUT, DELETE
    if (req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE') {
        if (req.params.id) {
            req.params._id = req.params.id;
            delete req.params.id;
        }
    }

    console.log(req)
    next();
});

// Custom middleware to convert `_id` back to `id` in responses
router.render = (req, res) => {
    if (res.locals.data) {
        if (Array.isArray(res.locals.data)) {
            res.locals.data = res.locals.data.map(item => {
                if (item._id) {
                    item.id = item._id;
                    delete item._id;
                }
                return item;
            });
        } else {
            if (res.locals.data._id) {
                res.locals.data.id = res.locals.data._id;
                delete res.locals.data._id;
            }
        }
    }
    res.jsonp(res.locals.data);
};

server.use(middlewares);
server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running on port 3000');
});