const canvas = document.querySelector(".canvas")
const ctx = canvas.getContext("2d")


const forkAngle = 0.5
const portion = 0.85


ctx.lineCap = "round"
drawTree(canvas.width / 2, canvas.height, - Math.PI / 2, 80, 20)

function rnd(max = 1) {
    return Math.random() * max
}

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
    if (i < 7 || size < 8) {
        if (rnd() < 0.05) return
        const hue = 120 - rnd(40)
        const saturation = 70 - rnd(30)
        const lightness = 30 + rnd(20)
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness - 25}%)`
        drawLeaf(x0, y0, 4 + rnd(2), angle)
        return
    }
    setTimeout(() => {
        const { x, y } = findEnd(x0, y0, angle, size)
        ctx.lineWidth = size * i ** 2 / 1500
        ctx.strokeStyle = `hsl(${80 - i * 3}, 60%, ${40 - i}%)`
        drawLine(x0, y0, x, y)
        const hasLeftBranch = rnd() < 0.95
        const hasRightBranch = rnd() < 0.95

        if (hasLeftBranch) drawTree(x, y, angle - forkAngle / 2, size * portion * (0.78 + rnd(0.45)), i - 1)
        if (hasRightBranch) drawTree(x, y, angle + forkAngle / 2, size * portion * (0.78 + rnd(0.45)), i - 1)
        if (!hasLeftBranch && !hasRightBranch && i < 6) {
            ctx.fillStyle = `hsl(${120 - rnd(60)}, ${100 - rnd(40)}%, ${20 + rnd(40)}%)`
            drawLeaf(x0, y0, 4 + rnd(2), angle)
        }

    }, i * 10)
}

function drawCircle(x, y, r) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 7)
    ctx.fill()
}

function drawLeaf(x, y, r, angle) {
    ctx.beginPath()
    ctx.ellipse(x, y, r, r / (rnd(3) + 1.5), angle, 0, 7)
    ctx.fill()
    ctx.lineWidth = 0.5
    ctx.stroke()
}

function findEnd(beginX, beginY, angle, length) {
    return {
        x: beginX - Math.cos(Math.PI - angle) * length,
        y: beginY + Math.sin(Math.PI - angle) * length
    }
}