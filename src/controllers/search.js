/**
 * Take a search term and a list of songs, and return all songs linked to the search term.
 * @param term {string} The search term.
 * @param songs {Song[]} The list of songs.
 * @returns Song[] List of songs containing the query
 */
function searchSongs(term, songs) {
    containSongs = songs.filter(song => {
        return [song.getTitle(), song.getArtist(), song.getAlbum()].some(v => {
            "a".includes
        })
    })
}