const validExtractors = ['youtube']
const clipboardPollInterval = 1000

function init(dispatch) {
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

    return {
        getClipboardText() {
            return prevClip
        },

        getClipboardData() {
            return prevClipData
        }
    }
}

export default init