const canvas = document.querySelector(".canvas")
const ctx = canvas.getContext("2d")


const forkAngle = 0.5
const portion = 0.85

drawTree(240, 640, - Math.PI / 2, 70, 20)


function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}


function drawTree(x0, y0, angle, size, i) {
    if (i == 0) return
    setTimeout(() => {
        const { x, y } = findEnd(x0, y0, angle, size)
        drawLine(x0, y0, x, y)
        if (Math.random() < 0.8) drawTree(x, y, angle - forkAngle / 2, size * portion, i - 1)
        if (Math.random() < 0.8) drawTree(x, y, angle + forkAngle / 2, size * portion, i - 1)
    }, i * 15)
}

function findEnd(beginX, beginY, angle, length) {
    return {
        x: beginX - Math.cos(Math.PI - angle) * length,
        y: beginY + Math.sin(Math.PI - angle) * length
    }
}