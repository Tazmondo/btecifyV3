let pageHTML = `

`

function playlist() {
    let header = document.querySelector('header')
    header.insertAdjacentHTML("afterend", pageHTML)

    Array.from(document.querySelectorAll('.playlist-section')).forEach(v => {
        let selector = v.querySelector('.playlist-select')
        let dropdown = v.querySelector('.select-dropdown')

        dropdown.addEventListener('mouseenter', e => {
            selector.classList.toggle("hover", true)
        })
        dropdown.addEventListener('mouseleave', e => {
            selector.classList.toggle("hover", false)
        })
    })
}

export default playlist