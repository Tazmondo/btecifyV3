function init(audioElement) {
    let context = new AudioContext()
    let src = context.createMediaElementSource(audioElement)
    let analyser = context.createAnalyser()
    let canvas = document.querySelector('.audio-visualiser')
    let ctx = canvas.getContext("2d")

    src.connect(analyser)
    analyser.connect(context.destination)

    analyser.fftSize = 512 // todo: add a setting to change this to reduce lag

    let bufferLength = analyser.frequencyBinCount

    let dataArray = new Uint8Array(bufferLength)

    canvas.width = canvas.clientWidth
    canvas.height = 256

    let width = canvas.width
    let height = canvas.height

    let barWidth = (width / bufferLength) * 1.5
    let curBarPos = 0;

    function renderFrame() {
        requestAnimationFrame(renderFrame)

        curBarPos = 0;
        analyser.getByteFrequencyData(dataArray)

        ctx.clearRect(0, 0, width, height)
        for (let i = 0; i < bufferLength; i++) {
            let preBarHeight = dataArray[i];
            if (preBarHeight > 0) {
                let barHeight = ((preBarHeight / 256) ** 1) * 256 // for modulating the bar heights if necessary in future
                let r = 250 * (i/bufferLength);
                let g = barHeight + (25 * (i/bufferLength));
                let b = 50;

                ctx.fillStyle = "rgb(0, 255, 0)";
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(curBarPos, height - barHeight, barWidth, barHeight);
            }
            curBarPos += barWidth - 1
        }
    }

    renderFrame()
}

export default init