import {dispatch} from "./event.js";

const validExtractors = ['youtube', 'bandcamp']
const clipboardPollInterval = 250

let prevClip = ""
let prevClipData = undefined

setInterval(() => {
    api.getClipboard().then(contents => {
        if (contents && contents !== prevClip) {
            prevClip = contents
            api.getSongData(contents).then(res => {
                if (res) {
                    if (validExtractors.includes(res.extractor)) {
                        console.log(res);
                        prevClipData = res
                        dispatch('clipboard')
                    }
                }
            })
        }
    })
}, clipboardPollInterval)

export function getClipboardText() {
    return prevClip
}

export function getClipboardData() {
    return prevClipData
}


