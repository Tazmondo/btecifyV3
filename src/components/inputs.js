function createLabel(label, parent) {
    parent.insertAdjacentHTML('beforeend', `<label>${label}</label>`)
    return parent.lastElementChild
}

/**
 * Generates a checkbox given a label and a parent element.
 * @param label {string}
 * @param callBack {function(e)} A function to be called when the input changes
 * @param value {boolean} The starting value
 * @return {HTMLElement} The generated input element
 */
function CheckBox(label, value, callBack) {
    let labelElement = document.createElement("label")
    labelElement.classList.toggle("checkbox", true)
    labelElement.innerText = label

    let inputElement = document.createElement("input")
    labelElement.insertAdjacentElement('beforeend', inputElement)
    inputElement.type = "checkbox"
    inputElement.checked = value

    labelElement.insertAdjacentHTML('beforeend', '<span></span>')

    inputElement.addEventListener('input', e => {
        callBack(e)
        e.stopPropagation()
    })

    return labelElement
}

/**
 * Generates a text input
 * @param label {string} The label text
 * @param callBack {function(e)} Function to be called when input changes
 * @param value {string} Default value
 * @return {HTMLElement} The generated input element
 */
function Text(label, callBack, value="") {
    let labelElement = document.createElement('label')
    labelElement.innerText = label

    let inputElement = document.createElement('input')
    labelElement.insertAdjacentElement('beforeend', inputElement)
    inputElement.type = 'text'
    inputElement.value = value

    inputElement.addEventListener('input', e => {
        callBack(e)
        e.stopPropagation()
    })

    return labelElement
}

function getMousePosition(e, target) {
    // e = Mouse click event.
    let rect = target.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top;  //y position within the element.
    return [x, y]
}

/**
 * Generates a seeker input
 * @param label {string} The label text
 * @param callback {function(number)} Function to be called when input changes
 * @param rounded {boolean} Whether to round to integer
 * @param minValue {number} Minimum value
 * @param maxValue {number} Maximum value
 * @param defaultValue {number?} The default value. Defaults to halfway between min and max.
 * @return {HTMLElement} The generated input element
 */
function Seeker(label, callback, rounded, minValue, maxValue, defaultValue) {
    if (defaultValue === undefined) defaultValue = (minValue + maxValue) / 2
    if (rounded === true) {
        minValue = Math.round(minValue)
        maxValue = Math.round(maxValue)
        defaultValue = Math.round(defaultValue)
    }

    let labelElement = document.createElement('label')
    labelElement.classList.toggle("seeker-label")
    labelElement.innerText = label

    let seekerElement = document.createElement('div')
    labelElement.insertAdjacentElement('beforeend', seekerElement)
    seekerElement.classList.toggle('seeker')

    let minText = document.createElement('span')
    seekerElement.insertAdjacentElement('beforeend', minText)
    minText.innerText = minValue.toString()

    let seekerBackgroundElement = document.createElement('div')
    seekerElement.insertAdjacentElement('beforeend', seekerBackgroundElement)
    seekerBackgroundElement.classList.toggle('seeker-background')

    let maxText = document.createElement('span')
    seekerElement.insertAdjacentElement('beforeend', maxText)
    maxText.innerText = maxValue.toString()

    let seekerForegroundElement = document.createElement('div')
    seekerBackgroundElement.insertAdjacentElement('beforeend', seekerForegroundElement)
    seekerForegroundElement.classList.toggle('seeker-foreground')

    let seekerThumbElement = document.createElement('div')
    seekerForegroundElement.insertAdjacentElement('beforeend', seekerThumbElement)
    seekerThumbElement.classList.toggle('seeker-thumb')

    let valueTip = document.createElement('div')
    labelElement.insertAdjacentElement('beforeend', valueTip)
    valueTip.innerText = "50"
    valueTip.classList.toggle("seeker-tip")

    let tipPopper = Popper.createPopper(seekerThumbElement, valueTip, {
        placement: "top",
    })

    labelElement.addEventListener('mouseenter', () => {
        tipPopper.update()
        valueTip.classList.toggle('hover', true)
    })
    labelElement.addEventListener('mouseleave', () => {
        valueTip.classList.toggle('hover', false)
    })

    let oldValue = defaultValue

    function updateSeeker(calculatedValue) {
        let distanceProportion = (calculatedValue - minValue) / (maxValue - minValue)
        let percentage = distanceProportion * 100

        if (percentage < 0) {
            percentage = 0
        } else if (percentage > 100) {
            percentage = 100
        }
        let transitioning = true
        let duration = parseFloat(getComputedStyle(seekerForegroundElement).transitionDuration)
        setTimeout(() => transitioning = false, duration*1000)
        function updPopper() {
            tipPopper.update()
            if (transitioning) requestAnimationFrame(updPopper)
        }
        updPopper()

        seekerForegroundElement.style = `width: ${percentage}%`
        valueTip.innerText = calculatedValue.toString()
    }
    updateSeeker(defaultValue)

    function seekerClick(e) {
        let oldX = 0;
        let currentEvent = e

        function moveFunc(e) {
            let relativeX = getMousePosition(e, seekerBackgroundElement)[0]

            // 0 < relativeX < width of element
            relativeX = Math.min(seekerBackgroundElement.clientWidth, Math.max(0, relativeX))

            let proportion = relativeX / seekerBackgroundElement.clientWidth

            // Interpolate between min and max based on the proportion
            let newValue = (proportion * (maxValue - minValue)) + minValue
            if (rounded) {
                newValue = Math.round(newValue)
                updateSeeker(newValue)
                if (newValue !== oldValue) {
                    oldValue = newValue
                    callback(newValue)
                }
            } else {
                updateSeeker(newValue)
                callback(newValue)
            }
        }
        moveFunc(currentEvent)
        let interval = setInterval(() => {
            if (currentEvent.clientX !== oldX) {
                moveFunc(currentEvent)
                oldX = currentEvent.clientX
            }
        }, 50)
        function mouseMove(e) {
            currentEvent = e
        }
        valueTip.classList.toggle('held', true)
        document.addEventListener("mousemove", mouseMove)
        document.addEventListener("mouseup", e => {
            valueTip.classList.toggle('held', false)
            document.removeEventListener("mousemove", mouseMove)
            clearInterval(interval)
        }, {once: true})
    }

    seekerElement.addEventListener('mousedown', seekerClick)

    return labelElement
}

export {CheckBox, Text, Seeker}