// const mode = "left"
const mode = "centre"
// const mode = "symmetrical"

function init(audioElement) {
    let context = new AudioContext()
    let src = context.createMediaElementSource(audioElement)
    let analyser = context.createAnalyser()
    let canvas = document.querySelector('.audio-visualiser')
    let ctx = canvas.getContext("2d")

    src.connect(analyser)
    analyser.connect(context.destination)

    analyser.fftSize = 256 // todo: any higher results in jankiness

    let bufferLength = analyser.frequencyBinCount

    let dataArray = new Uint8Array(bufferLength)

    canvas.width = canvas.clientWidth
    canvas.height = 256

    let width = canvas.width
    let height = canvas.height

    let barWidth;

    if (mode === "symmetrical") {
        barWidth = (width / bufferLength) * 0.5
    } else if (mode === "left") {
        barWidth = (width / bufferLength) * 1.5
    } else if (mode === "centre") {
        barWidth = (width / bufferLength) * 0.75
    }
    let curBarPos = 0;

    function renderFrame() {
        requestAnimationFrame(renderFrame)

        curBarPos = 0;
        analyser.getByteFrequencyData(dataArray)

        ctx.clearRect(0, 0, width, height)
        let centre = width/2 - barWidth/2

        for (let i = 0; i < bufferLength; i++) {
            let preBarHeight = dataArray[i];
            if (preBarHeight > 0) {
                let barHeight = ((preBarHeight / 256) ** 1) * 256 // for modulating the bar heights if necessary in future
                let r = 250 * (i/bufferLength);
                let g = barHeight + (25 * (i/bufferLength));
                let b = 50;

                ctx.fillStyle = "rgb(0, 255, 0)";
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

                switch (mode){
                    case "left":
                        ctx.fillRect(curBarPos * barWidth - 1, height - barHeight, barWidth, barHeight);
                        break
                    case "centre":
                        let xPos = centre + (curBarPos * (curBarPos % 2 === 0 ? -1 : 1) * barWidth / 2)
                        ctx.fillRect(xPos, height - barHeight, barWidth, barHeight);
                        break
                    case "symmetrical":
                        let frontPos = centre + curBarPos * barWidth
                        let backPos = centre - curBarPos * barWidth
                        ctx.fillRect(frontPos, height - barHeight, barWidth, barHeight);
                        ctx.fillRect(backPos, height - barHeight, barWidth, barHeight);
                        break
                }

            }
            curBarPos += 1
        }
    }

    renderFrame()
}

export default init