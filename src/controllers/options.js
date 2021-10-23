const options = {
    visualiser: {
        name: "Visualiser",
        type: "checkbox",
        value: true
    },
    visualiserDetail: {
        name: "Visualiser Detail",
        type: "number",
        value: 8 // 2 to the power of value = fft size
    },
    downloadMusic: {
        name: "Download music",
        type: "checkbox",
        value: true // todo: make me work
    },
    downloadThumbnails: {
        name: "Download thumbnails",
        type: "checkbox",
        value: true // todo: make me work
    },
    youtubeKey: {
        name: "Youtube API key",
        type: "text",
        value: ""
    },
    spotifyKey: {
        name: "Spotify API key",
        type: "text",
        value: ""
    },
    volumeScale: {
        name: "Volume Scale",
        type: "number",
        value: 2.5
    }

    // colourTheme ?
}

function updateOption(optionKey, value) {
    let option = options[optionKey]
    switch (option.type) {
        case "checkbox":
            if (typeof value !== "boolean") {
                throw new TypeError(`Invalid value passed.\nGot ${typeof value} but expected boolean.`)
            }
    }
    option.value = value
}

function getOptionValue(optionKey) {
    return options[optionKey].value
}

export {options, updateOption, getOptionValue}