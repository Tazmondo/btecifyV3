import {subscribeToKeydown} from "./hotkey.js";

let searchCallbacks = []

function searchListen(func) {
    searchCallbacks.push(func)
    return () => {
        searchCallbacks = searchCallbacks.filter(v => v !== func)
    }
}

let searchBar = document.getElementById('global-search')

function inputChanged() {
    searchCallbacks.forEach(v => v(searchBar.value))
}

searchBar.addEventListener('input', inputChanged)
searchBar.addEventListener('blur', () => {
    searchBar.value = ""
    inputChanged()
    if (keySubscription) keySubscription()
    keySubscription = subscribeToKeydown(keyDown)
})
let keySubscription = undefined
function keyDown(e) {
    // if (e.key.length === 1) {
    //     searchBar.value = e.key
    // }
    searchBar.focus()
    if (keySubscription) keySubscription()
    keySubscription = undefined

}
keySubscription = subscribeToKeydown(keyDown)

/**
 * Take a search term and a list of songs, and return all songs linked to the search term.
 * @param term {string} The search term.
 * @param songs {Song[]} The list of songs.
 * @returns Song[] List of songs containing the query
 */
function searchSongs(term, songs) {
    let containSongs = songs.filter(song => {
        return [song.getTitle(), song.getArtist(), song.getAlbum()].some(v => {
            return v.search(new RegExp(term, "i")) !== -1
        })
    })
    return containSongs
}

function highlightSearchedTerm(element, text, query) {
    if (typeof query == "string" && query !== "") {
        // if (element.childNodes.length > 0){
        //     console.log(element.childNodes);
        //     throw new Error("Do not call on an element with children.")
        // }
        text = text.replaceAll(new RegExp(query, "ig"), `<span class="highlight-text">${query}</span>`)
        // text = text.replace(query, `<span class="highlight-text">${query}</span>`)
        element.innerHTML = text
    } else {
        element.innerText = text
    }
}

export {searchSongs, highlightSearchedTerm, searchListen}