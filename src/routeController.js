function InitRouteController() {
    let currentRoute = []

    function getPageIdFromNavName(navName) {
        return navName.slice(0, -4)
    }

    function routeWithNavElement(navButton) {
        navButton.classList.toggle("active", true)

        let pageName = getPageIdFromNavName(navButton.id)

        let selectedPage = document.getElementById(navButton.id + "-page")
        Array.from(document.querySelectorAll('main > div')).forEach(v => {
            v.classList.toggle('switching', true)
            v.classList.toggle('hidden', true)
            v.addEventListener('transitionend', (e) => {
                if (e.target === v) {
                    v.classList.toggle('switching', false)
                }
            })
        })
        selectedPage.classList.toggle('hidden', false)

        console.log(`Routed to ${pageName}.`)
    }

    return {
        routeWithNavElement,
        routeWithPageName(pageName) {
            let navId = pageName + "-nav"
            let navElement = document.getElementById(navId)
            routeWithNavElement(navElement)
        },
    }
}

export default InitRouteController