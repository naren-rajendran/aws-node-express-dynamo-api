const assert = require('assert');
const axios = require('axios');

const LOCAL_DB_PORT = 3000;
let endpoint = `http://localhost:${LOCAL_DB_PORT}`;

describe('user api', () => {
    it('should return 400 on /', async () => {
        const route = `${endpoint}/`;
        try {
            await axios.get(route);
        } catch (err) {
            assert.strictEqual(err.response.status, 400);
        }
    });
    it('should return 404 on invalid routes', async () => {
        const routes = [
            {
                method: 'get',
                route: `${endpoint}/user`,
            },
            {
                method: 'get',
                route: `${endpoint}/api`,
            },
            {
                method: 'get',
                route: `${endpoint}/api/user`,
            },
            {
                method: 'get',
                route: `${endpoint}?user`,
            },
            {
                method: 'post',
                route: `${endpoint}/user`,
            },
            {
                method: 'post',
                route: `${endpoint}?user`,
            },
            {
                method: 'put',
                route: `${endpoint}/user`,
            },
            {
                method: 'put',
                route: `${endpoint}?user`,
            },
            {
                method: 'delete',
                route: `${endpoint}/user`,
            },
            {
                method: 'delete',
                route: `${endpoint}?user`,
            },
        ];

        routes.forEach(async r => {
            const { method, route } = r;
            try {
                await axios[method](route);
            } catch (err) {
                assert.strictEqual(err.response.status, 404);
            }
        });
    });
    it('should create user', async () => {
        const route = `${endpoint}/users`;
        let rnd = process.hrtime.bigint();
        const user = {
            firstName: 'NAREN',
            lastName: 'R',
            email: `naren${rnd}@r.com`,
        };
        const res = await axios.post(route, user);
        assert.strictEqual(res.status, 201);
        assert.notStrictEqual(res.data, undefined);
        uId = user.userId;
    });
    it('should get user', async () => {
        const route = `${endpoint}/users`;
        let rnd = process.hrtime.bigint();
        const user = {
            firstName: 'NAREN',
            lastName: 'R',
            email: `naren${rnd}@r.com`,
        };
        const res = await axios.post(route, user);
        assert.strictEqual(res.status, 201);
        assert.notStrictEqual(res.data, undefined);

        const getRoute = `${route}/${res.data.userId}`;
        const getRes = await axios.get(getRoute);
        assert.strictEqual(getRes.status, 200);
        assert.notStrictEqual(getRes.data, undefined);
        assert.deepStrictEqual(res.data, getRes.data);
    });
    it('should update user', async () => {
        const route = `${endpoint}/users`;
        let rnd = process.hrtime.bigint();
        const user = {
            firstName: 'NAREN',
            lastName: 'R',
            email: `naren${rnd}@r.com`,
        };
        const res = await axios.post(route, user);
        assert.strictEqual(res.status, 201);
        assert.notStrictEqual(res.data, undefined);

        const updRoute = `${route}/${res.data.userId}`;
        rnd = process.hrtime.bigint();
        const updUser = {
            firstName: 'NAREN',
            lastName: 'R',
            email: `naren${rnd}@r.com`,
            phone: 1234567890,
        };
        const updRes = await axios.put(updRoute, updUser);
        assert.strictEqual(updRes.status, 200);
        assert.notStrictEqual(updRes.data, undefined);
        assert.deepStrictEqual(updRes.data.userId, res.data.userId);
        assert.deepStrictEqual(updRes.data.email, updUser.email);
        assert.deepStrictEqual(updRes.data.phone, updUser.phone.toString());
    });
    it('should delete user', async () => {
        const route = `${endpoint}/users`;
        let rnd = process.hrtime.bigint();
        const user = {
            firstName: 'NAREN',
            lastName: 'R',
            email: `naren${rnd}@r.com`,
        };
        const res = await axios.post(route, user);
        assert.strictEqual(res.status, 201);
        assert.notStrictEqual(res.data, undefined);

        const delRoute = `${route}/${res.data.userId}`;
        const delRes = await axios.delete(delRoute);
        assert.strictEqual(delRes.status, 200);

        try {
            const getRoute = `${route}/${res.data.userId}`;
            await axios.get(getRoute);
        } catch (err) {
            assert.strictEqual(err.response.status, 404);
        }
    });
});
