// const mode = "left"
import {getOptionValue} from "./options.js";

let mode: string;
mode = "centre"

// const mode = "symmetrical"

function init(audioElement: HTMLAudioElement) {
    let context = new AudioContext()
    let src = context.createMediaElementSource(audioElement)
    let analyser = context.createAnalyser()
    let canvas: HTMLCanvasElement = document.querySelector('.audio-visualiser')!  // To tell typescript that canvas is not null
    if (canvas === null) return

    let ctx: CanvasRenderingContext2D = canvas.getContext("2d")!  // Ditto above

    src.connect(analyser)
    analyser.connect(context.destination)

    let prevDetail = -1
    let bufferLength: number;
    let dataArray: Uint8Array;
    let width: number;
    let height: number;
    let offsetWidth: number;
    let barWidth: number;

    function refreshDetail() {
        let newDetail = getOptionValue('visualiserDetail')

        if (prevDetail !== newDetail) {
            prevDetail = newDetail

            analyser.fftSize = 2 ** newDetail
            bufferLength = analyser.frequencyBinCount
            dataArray = new Uint8Array(bufferLength)

            offsetWidth = canvas.parentElement!.firstElementChild!.clientWidth // Get width of the element before the canvas.

            canvas.width = canvas.clientWidth
            canvas.height = 256

            width = canvas.clientWidth
            height = 256

            if (mode === "symmetrical") {
                barWidth = (width / bufferLength) * 0.5
            } else {
                if (mode === "left") {
                    barWidth = (width / bufferLength) * 1.5
                } else if (mode === "centre") {
                    barWidth = (width / bufferLength) * 0.9
                }
            }
        }
    }

    refreshDetail()


    let curBarPos = 0;

    function renderFrame() {
        requestAnimationFrame(renderFrame)
        ctx.clearRect(0, 0, width, height)
        if (!getOptionValue('visualiser')) return
        refreshDetail()
        curBarPos = 0;
        analyser.getByteFrequencyData(dataArray)

        let centre = (width - barWidth - offsetWidth) / 2

        for (let i = 0; i < bufferLength; i++) {
            let preBarHeight = dataArray[i];
            if (preBarHeight > 0) {
                let barHeight = ((preBarHeight / 256) ** 1) * 256 // for modulating the bar heights if necessary in future
                let r = 250 * (i / bufferLength);
                let g = barHeight + (25 * (i / bufferLength));
                let b = 50;

                ctx.fillStyle = "rgb(0, 255, 0)";
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

                switch (mode) {
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
