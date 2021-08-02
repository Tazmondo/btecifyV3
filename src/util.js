function copyArray(array) {
    if (Array.isArray(array)) {
        return array.slice(0)
    }
}

export {copyArray}