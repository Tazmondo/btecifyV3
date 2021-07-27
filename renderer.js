console.log("renderer.js running...")

function randomColourCSS() {
    let r = Math.floor(Math.random()*256)
    let g = Math.floor(Math.random()*256)
    let b = Math.floor(Math.random()*256)
    return `rgb(${r}, ${g}, ${b})`
}

window.api.receiveMoved(() => {
    //console.log("Received")
    //document.body.style.backgroundColor = randomColourCSS();
})

document.getElementById("shuffle").addEventListener("click", (e) => {
    let audio = new Audio("https://r5---sn-aigzrn7s.googlevideo.com/videoplayback?expire=1627373763&ei=Ymz_YP2IOovw0wWU_YmYBg&ip=194.37.96.183&id=o-AP-mJN8fdTulX71t9RBmxU3ESgjRRCGMIpCWgoJLQp-B&itag=251&source=youtube&requiressl=yes&mh=Ri&mm=31%2C26&mn=sn-aigzrn7s%2Csn-5hnedn7z&ms=au%2Conr&mv=m&mvi=5&pl=24&initcwndbps=2978750&vprv=1&mime=audio%2Fwebm&ns=HGMrSRjyrNyKDRf8VOfrx24G&gir=yes&clen=5688359&dur=342.021&lmt=1496845270044825&mt=1627351728&fvip=5&keepalive=yes&fexp=24001373%2C24007246&c=WEB&n=-CwQJ3zQ2-EM0a&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRAIgZUXlEUT0k7I6Ig6pMKWmOJYui0H_xc4SWIMDaGRN0HgCIBcWXVXFMFRwr06BE3gNAqVg2_Mwp3gojwCZ1RPY018p&sig=AOq0QJ8wRQIgVUKp_TDwexBMfDAbHKWNaJYDFHxs6NjqaA0Hx-R902oCIQC6sxPetnXG1Uk7XsO4le1LYfOgRBB-H6B3nFz7ci66Vg==")
    audio.play()
})