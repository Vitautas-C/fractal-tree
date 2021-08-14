const canvas = document.querySelector(".canvas")
const ctx = canvas.getContext("2d")
const controlWrapper = document.querySelector(".control-wrapper")

let iterationCount, trunkHeight, trunkThickness, branchRatio, branchProbability, leafProbability, branchLengthVariability, forkAngle, forkAnglePull, branchRotationVariability, leafSize, branchColor, leafColor, leafColorVariability


const timers = []

ctx.lineCap = "round"
updateValues()
render()

controlWrapper.onchange = () => {
    updateValues()
    timers.forEach(timerId => clearTimeout(timerId))
    timers.splice(0)
    clear()
    render()
}


function updateValues() {
    ({ iterationCount, trunkHeight, trunkThickness, branchRatio, branchProbability, leafProbability, branchLengthVariability, forkAngle, forkAnglePull, branchRotationVariability, leafSize, branchColor, leafColor, leafColorVariability } = Object.fromEntries([...controlWrapper.querySelectorAll('[type="range"]')].map(({ id, value }) => [id, value])))
}


function render() {
    updateValues()
    drawTree(canvas.width / 2, canvas.height, - Math.PI / 2, trunkHeight, trunkThickness, iterationCount)
}


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


function drawTree(x0, y0, angle, length, width, i) {
    if (i < 7 || length < 8) {
        if (rnd() < 0.05) return
        const hue = 120 - rnd(40)
        const saturation = 70 - rnd(30)
        const lightness = 30 + rnd(20)
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness - 25}%)`
        drawLeaf(x0, y0, 4 + rnd(2), angle)
        return
    }

    const timerId = setTimeout(() => {
        const { x, y } = findEnd(x0, y0, angle, length)
        ctx.lineWidth = width
        ctx.strokeStyle = `hsl(${80 - i * 3}, 60%, ${40 - i}%)`
        drawLine(x0, y0, x, y)
        const hasLeftBranch = rnd() < branchProbability
        const hasRightBranch = rnd() < branchProbability
        width -= (width - (i == 8 ? 1 : 0.5)) / (i - 7)
        const nextForkAngle = 1 - rnd(1 - forkAnglePull)
        if (hasLeftBranch) drawTree(x, y, angle - forkAngle / 2 * nextForkAngle, length * branchRatio * (1 + rnd(branchLengthVariability) * (rnd() < 0.5 ? -1 : 1)), width, i - 1)
        if (hasRightBranch) drawTree(
            x,
            y,
            angle + forkAngle / 2 * nextForkAngle,
            length * branchRatio * (1 + rnd(branchLengthVariability) * (rnd() < 0.5 ? -1 : 1)),
            width,
            i - 1
        )
        if (!hasLeftBranch && !hasRightBranch && i < 6) {
            ctx.fillStyle = `hsl(${120 - rnd(60)}, ${100 - rnd(40)}%, ${20 + rnd(40)}%)`
            drawLeaf(x0, y0, 4 + rnd(2), angle)
        }
        timers.splice(timers.indexOf(timerId), 1)
    }, i * 10)
    timers.push(timerId)
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