import {subscribeToKeydown} from "./hotkey.js";

let searchCallbacks = []

function searchListen(func) {
    func(searchBar.value)
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
    // searchBar.value = ""
    // inputChanged()
    // if (keySubscription) keySubscription()
    // keySubscription = subscribeToKeydown(keyDown)
})
let keySubscription = undefined
function keyDown(e) {
    // if (e.key.length === 1) {
    //     searchBar.value = e.key
    // }
    if (e.key === "Escape") {
        searchBar.value = ""
        inputChanged()
    }
    if (document.activeElement.tagName !== "INPUT") {
        searchBar.focus()
        // if (keySubscription) keySubscription()
        // keySubscription = undefined
    }

}
keySubscription = subscribeToKeydown(keyDown)

/**
 * Take a search term and a list of songs, and return all songs linked to the search term.
 * @param term {string} The search term.
 * @param songs {Song[]} The list of songs.
 * @returns Song[] List of songs containing the query
 */
function searchSongs(term, songs) {
    if (typeof term === "string" && term !== "") {
        return songs.filter(song => {
            return [song.getTitle(), song.getArtist(), song.getAlbum()].some(v => {
                return v.search(new RegExp(term, "i")) !== -1
            })
        })
    } else {
        return songs
    }
}

function highlightSearchedTerm(element, text, query) {
    try {
        if (typeof query == "string" && query !== "") {

            // Use regexp.quote as the query could contain special characters, resulting in an error.
            text = text.replaceAll(new RegExp(query, "ig"), `<span class="highlight-text">${query}</span>`)
            element.innerHTML = text
        } else {
            element.innerText = text
        }
    } catch (e) {
        if (e instanceof SyntaxError) {
            element.innerText = text
        }
        throw e
    }
}

export {searchSongs, highlightSearchedTerm, searchListen}