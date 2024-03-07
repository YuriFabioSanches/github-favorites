export class GithubUser {
    static getUser(username) {
        const endpoit = `https://api.github.com/users/${username}`

        return fetch(endpoit)
        .then(response => response.json())
        .then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}