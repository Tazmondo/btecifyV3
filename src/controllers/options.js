const options = {
    visualiser: {
        name: "Visualiser",
        type: "checkbox",
        value: true
    }
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