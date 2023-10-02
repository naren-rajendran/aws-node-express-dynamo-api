const assert = require('assert');

const { validateUserData } = require('../../userModel');

const requiredFields = ['firstName', 'lastName', 'email'];

describe('user model', () => {
    function includedInErrorMessages(key, messages) {
        return messages.some(m => m.indexOf(key) > -1);
    }

    it('should set uuid and expect required properties', () => {
        const { user, error } = validateUserData({});
        assert.notStrictEqual(user.userId.length, 0);
        assert.notStrictEqual(error, undefined);
        assert.notStrictEqual(error.length, 0);

        requiredFields.forEach(r => assert.strictEqual(includedInErrorMessages(r, error), true));
    });

    it('should convert values to lower case', () => {
        const userObject = {
            firstName: 'JOHN',
            lastName: 'DOE',
            email: 'JOHN@DOE.COM',
        };
        const { user, error } = validateUserData(userObject);
        assert.strictEqual(error, undefined);
        Object.keys(userObject).forEach(k => {
            const modelVal = user[k];
            assert.strictEqual(modelVal, userObject[k].toLowerCase());
        });
    });

    it('should error on invalid email', () => {
        const userObject = {
            firstName: 'JOHN',
            lastName: 'DOE',
        };
        const invalidEmail = [
            'email',
            '',
            'email.email.email',
            '1234567',
            'email@email@email',
        ];

        invalidEmail.forEach(mail => {
            const obj = Object.assign({}, userObject, {
                email: mail,
            });
            const { error } = validateUserData(obj);
            assert.notStrictEqual(error.length, 0);
        });
    });

    it('should limit length of attributes to max value', () => {
        const pk = 'userId';
        const map = [
            {
                'key': 'firstName',
                'max': 30,
            },
            {
                'key': 'lastName',
                'max': 30,
            },
            {
                'key': 'email',
                'max': 254
            },
            {
                'key': 'phone',
                'type': 'number',
                'max': 20,
            },
            {
                'key': 'address',
                'max': 100,
            },
            {
                'key': 'city',
                'max': 30,
            },
            {
                'key': 'state',
                'max': 30,
            },
            {
                'key': 'country',
                'max': 30,
            },
            {
                'key': 'zipCode',
                'type': 'number',
                'max': 10,
            },
        ];

        const obj = {
            'email': `${"a".repeat(254)}@email.com`,
        };
        map.forEach(m => {
            const { key, max, type } = m;
            const val = type && type === 'number' ? '0'.repeat(max + 1) : 'a'.repeat(max + 1);
            obj[key] = val;
        });
        const { user, error } = validateUserData(obj);
        assert.notStrictEqual(user, undefined);
        assert.notStrictEqual(error.length, 0);
        Object.keys(user).forEach(k => {
            if (k !== pk) {
                assert.strictEqual(includedInErrorMessages(k, error), true);
            }
        });
    });

    it('should skip fields not defined in schema', () => {
        const notDefined = {
            name: 'john',
            mobile: 123456789,
        };

        const defined = {
            firstName: 'john',
            lastName: 'doe',
            email: 'john@doe.com',
            phone: 1234567890
        };

        const userObj = { ...notDefined, ...defined };

        const { user, error } = validateUserData(userObj);
        assert.strictEqual(error, undefined);
        Object.keys(notDefined).forEach(k => {
            assert.strictEqual(user[k], undefined);
        });
    });
});
