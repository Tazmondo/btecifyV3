import {subscribeToKeydown} from "./hotkey.js";
import {apiSong} from "./types";

let searchBar = <HTMLInputElement>document.getElementById('global-search')

let searchCallbacks: Function[] = []

function searchListen(func: Function) {
    func(searchBar.value)
    searchCallbacks.push(func)
    return () => {
        searchCallbacks = searchCallbacks.filter(v => v !== func)
    }
}


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
function keyDown(e: KeyboardEvent) {
    // if (e.key.length === 1) {
    //     searchBar.value = e.key
    // }
    if (e.key === "Escape") {
        searchBar.value = ""
        inputChanged()
    }
    if (document.activeElement && document.activeElement?.tagName !== "INPUT") {
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
function searchSongs(term: string, songs: apiSong[]) {
    if (term !== "") {
        return songs.filter(song => {
            return [song.title, song.album?.title, song.artist?.title].some(v => {
                try {
                    if (v !== undefined) {
                        return v.search(new RegExp(term, "i")) !== -1
                    }
                    return false
                } catch (e) { // Fixes weird rare error when a weird regex expression is entered, causing an error render failure.
                    return false
                }
            })
        })
    } else {
        return songs
    }
}

function highlightSearchedTerm(element: HTMLElement, text: string , query: string) {
    try {
        if (query !== "") {

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
