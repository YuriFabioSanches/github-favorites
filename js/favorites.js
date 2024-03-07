import { GithubUser } from "./githubUser.js"

/* classe para tratar os dados */
class Favorites {
    constructor(root) {
        this.root = document.getElementById(root)
        this.load()
    }

    load() {
        this.data = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.data))
    }

    async add(username) {
        try{
            if(this.data.find(data => data.login == username)){
                throw new Error('User already favorited!')
            }

            const user = await GithubUser.getUser(username)
            if(user.login === undefined) {
                throw new Error('User not found!')
            }

            this.data = [user, ...this.data]
            this.update()
            this.save()
        }
        catch (e){
            alert(e.message)
        }

    }

    delete(user) {
        const filteredData = this.data
        .filter(data => data.login != user.login)

        this.data = filteredData
        this.update()
        this.save()
    }
}



/* classe para tratar criação e eventos do HTML */
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    update() {
        this.removeAllRows()

        this.data.forEach(user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user a p').innerText = `${user.name}`
            row.querySelector('.user a span').innerText = `/${user.login}`

            row.querySelector('.repositories').innerText = `${user.public_repos}`

            row.querySelector('.followers').innerText = `${user.followers}`

            row.querySelector('.actions .remove').onclick = () => {
                const isOk = confirm('Do you want to delete this user from your GitFav?')

                if(isOk){
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })

        this.emptyState()
    }

    onadd() {
        const addButton = this.root.querySelector('#search-button')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('#search-input')
            this.add(value)
        }
    }


    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="" alt="" />
                <a href="" target="_blank">
                    <p></p>
                    <span></span>
                </a>
            </td>

            <td class="repositories"></td>

            <td class="followers"></td>

            <td class="actions">
                <button class="remove">Remove</button>
            </td>
        `
        
        return tr
    }

    removeAllRows() {
        this.tbody.querySelectorAll('tr').forEach(tr => {
            tr.remove()
        })
    }

    emptyState() {
        const emptyDiv = this.root.querySelector('.empty-state')
        const table = this.root.querySelector('table')

        if(this.data.length == 0){
            emptyDiv.style.display = ''
            table.style.borderRadius = '.6rem .6rem 0rem 0rem'
        }else {
            emptyDiv.style.display = 'none'
            table.style.borderRadius = '.6rem'
        }
    }
}