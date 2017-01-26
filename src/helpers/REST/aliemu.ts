import * as unirest from 'unirest';

export namespace get {

    const HEADERS = {
        'authorization': process.env.ALIEMU_REST_AUTH,
        'cache-control': 'no-cache',
    };

    export function user(userID: string|number): Promise<WordPress.User> {
        return new Promise<WordPress.User>((resolve, reject) => {
            unirest.get(`https://www.aliemu.com/wp-json/wp/v2/users/${userID}`)
            .headers(HEADERS)
            .query('context=edit')
            .end(res => res.error ? reject(new Error('Could not retrieve user.')) : resolve(res.body));
        });
    }
}

export namespace update {

    const HEADERS = {
        'authorization': process.env.ALIEMU_REST_AUTH,
        'cache-control': 'no-cache',
        'content-type': 'application/json',
    };

    export function user(userID: string|number, data: WordPress.User): Promise<number> {
        return new Promise<WordPress.User>((resolve, reject) => {
            unirest.post(`https://www.aliemu.com/wp-json/wp/v2/users/${userID}`)
            .headers(HEADERS)
            .type('json')
            .send(data)
            .end(res => res.error ? reject(new Error('Updating user in database failed.')) : resolve(200));
        });
    }
}
