import * as PIXI from 'pixi.js'
import * as filters from 'pixi-filters'
import { $, createObserver, detectMobile, randomIntFromInterval } from './helper'

const ratio = window.devicePixelRatio

const appInit = async (settings) => {
    const { node, effects, params, maxFPS } = settings
    const app = new PIXI.Application()
    let isInView = false

    params.width = !params.width ? node.clientWidth * ratio : params.width * ratio
    params.height = !params.height ? node.clientHeight * ratio : params.height * ratio

    await app.init(params)

    const canvas = app.canvas
    canvas.style.width = params.width / ratio + 'px';
    canvas.style.height = params.height / ratio + 'px';
    node.append(canvas)
    const rect = new PIXI.Graphics().rect(0, 0, params.width, params.height).fill(params.background)
    app.stage.addChild(rect)

    if (effects) {
        const appFilters = []

        effects.forEach(effect => {
            if (effect === 'glitch') {
                const glitch = new filters.GlitchFilter()
                appFilters.push(glitch)
                glitch.offset = 0
                glitch.slices = 0
                glitch.average = true
                glitch.fillMode = 3
            } else if (effect === 'rgb') {
                const rgb = new filters.RGBSplitFilter()
                appFilters.push(rgb)
                rgb.red.x = 0
                rgb.red.y = 0
                rgb.green.x = 0
                rgb.green.y = 0
                rgb.blue.x = 0
                rgb.blue.y = 0
            }
        })

        app.stage.filters = appFilters
    }

    app.ticker.maxFPS = maxFPS
    app.ticker.minFPS = 0

    createObserver(node, (entries) => {
        const { isIntersecting } = entries[0]
        isInView = isIntersecting
        if (isIntersecting) app.ticker.start()
        else app.ticker.stop()
        if (typeof settings.observerFn === 'function') {
            settings.observerFn(isIntersecting)
        }
    })

    window.addEventListener('blur', () => {
        if (isInView) app.ticker.stop()
    })

    window.addEventListener('focus', () => {
        if (isInView) app.ticker.start()
    })

    return app
}

const appendText = async (app) => {
    await PIXI.Assets.load('/src/fonts/bf2d136f158c0796316e.woff')
    const isMobile = detectMobile()
    const width = app.canvas.width
    const height = app.canvas.height
    const fontSize1 = width / 1440 * 96
    const fontSize2 = width / 1440 * 40
    const fontSize3 = width / 1440 * 58
    const fontSize4 = width / 1440 * 120
    const rgb = new filters.RGBSplitFilter()
    const textes = [
        new PIXI.Container(),
        new PIXI.Container(),
        new PIXI.Container(),
        new PIXI.Container()
    ]
    const standartStyle = {
        fontFamily: 'Bender black',
        // fontWeight: 'black',
        fill: '#fff',
        // wordWrap: isMobile,
        align: 'center',
        // wordWrapWidth: width - 40,
    }
    const textList = !isMobile ? [
        { text: 'barber king\n2o24', fontSize: fontSize1, container: 1, x: width / 2, y: height / 2 },
        { text: '21 - 22 оkтября', fontSize: fontSize1, container: 2, x: width / 2, y: height / 2 },
        { text: 'barber king 2o24', fontSize: fontSize2, container: 2, x: width / 2, y: height / 2 + fontSize1 },
        { text: 'МТС Live Холл', fontSize: fontSize1, container: 3, x: width / 2, y: height / 2 },
        { text: 'barber king 2o24', fontSize: fontSize2, container: 3, x: width / 2, y: height / 2 + fontSize1 },
        { text: 'barber king', fontSize: fontSize3, container: 4, x: width / 3.8, y: height / 4 },
        { text: '2o24', fontSize: fontSize4, container: 4, x: width / 1.5, y: height / 1.2 },
    ] : [
        { text: 'barber king\n2o24', fontSize: fontSize1 * 2, container: 1, x: width / 2, y: height / 2 - 75 },
        { text: '21 - 22\nоkтября', fontSize: fontSize1 * 2, container: 2, x: width / 2, y: height / 2 - 75 },
        { text: 'barber king 2o24', fontSize: fontSize2 * 2, container: 2, x: width / 2, y: height / 2 + 125 },
        { text: 'МТС\nLive Холл', fontSize: fontSize1 * 2, container: 3, x: width / 2, y: height / 2 - 75 },
        { text: 'barber king 2o24', fontSize: fontSize2 * 2, container: 3, x: width / 2, y: height / 2 + 125 },
        { text: 'barber king', fontSize: fontSize3 * 2.5, container: 4, x: width / 3, y: height / 3 },
        { text: '2o24', fontSize: fontSize4 * 2, container: 4, x: width / 1.3, y: height / 1.5 },
    ]

    const sourses = [
        '/src/images/main/slider/1.jpg',
        '/src/images/main/slider/2.jpg',
        '/src/images/main/slider/3.jpg',
        '/src/images/main/slider/4.jpg'
    ]

    sourses.forEach(async src => {
        await PIXI.Assets.load(src)
        const sprite = PIXI.Sprite.from(src)
        const imageWidth = isMobile ? width / 375 * 278 : width / 1440 * 658
        const imageHeight = isMobile ? width / 375 * 237 : width / 1440 * 538
        sprite.width = imageWidth
        sprite.height = imageHeight
        sprite.x = (width / 2) - (imageWidth / 2)
        sprite.y = (height / 2) - (imageHeight / 2)
        textes[3].addChild(sprite)
        sprite.renderable = false
    })

    textList.forEach(el => {
        const fontSize = el.fontSize
        const style = {
            ...standartStyle,
            lineHeight: fontSize,
            fontSize,
        }
        const text = new PIXI.Text({ text: el.text, style })
        text.x = el.x - (text.width / 2)
        text.y = el.y - (text.height / 2)
        text.zIndex = 3
        textes[el.container - 1].addChild(text)
    })

    textes.forEach((text) => {
        text.filters = [rgb]
        app.stage.addChild(text)
        text.renderable = false
    })

    return textes
}

const appendRect = (app) => {
    const width = app.canvas.clientWidth
    const height = app.canvas.clientHeight
    const blur = new filters.KawaseBlurFilter()
    const radius = height / 700 * 90 * ratio
    const coordX = width / 2 * ratio
    const coordY = height / 2 * ratio
    const circle = new PIXI.Graphics().circle(coordX, coordY, radius).fill('#CC00FF')
    circle.filters = [blur]
    circle.filters[0].strength = 90
    circle.filters[0].quality = 10
    circle.filters[0].pixelSizeY = 1
    circle.filters[0].pixelSizeX = 1
    app.stage.addChild(circle)

    return circle
}

const getSettings = () => {
    const timePerState = 400
    const states = 4
    const perFrame = 7
    const aStates = []
    const effects = [
        { type: 'glitch', time: timePerState / 2 },
        { type: 'stop', time: timePerState },
        { type: 'color', time: timePerState },
        { type: 'stop', time: timePerState },
        { type: 'color', time: timePerState },
        { type: 'stop', time: timePerState },
        { type: 'glitch', time: timePerState / 2 },
    ]
    let prevTime = 0

    for (let i = 0; i < states * perFrame; i++) {
        const index = i % perFrame
        const { type, time } = effects[index]

        aStates.push(
            {
                from: prevTime,
                to: prevTime + time,
                state: Math.floor(i / perFrame),
                effect: type
            }
        )

        prevTime += time
    }

    return aStates
}

const tickerHandler = (app, text, effect) => {
    const co = 4
    if (effect === 'color') {
        text.filters[0].red.x = randomIntFromInterval(-co, co)
        text.filters[0].red.y = randomIntFromInterval(-co, co)
        text.filters[0].green.x = randomIntFromInterval(-co, co)
        text.filters[0].green.y = randomIntFromInterval(-co, co)
        text.filters[0].blue.x = randomIntFromInterval(-co, co)
        text.filters[0].blue.y = randomIntFromInterval(-co, co)
        app.stage.filters[0].offset = 0
    } else if (effect === 'glitch') {
        text.filters[0].red.x = randomIntFromInterval(-co, co)
        text.filters[0].red.y = randomIntFromInterval(-co, co)
        text.filters[0].green.x = randomIntFromInterval(-co, co)
        text.filters[0].green.y = randomIntFromInterval(-co, co)
        text.filters[0].blue.x = randomIntFromInterval(-co, co)
        text.filters[0].blue.y = randomIntFromInterval(-co, co)
        app.stage.filters[0].offset = randomIntFromInterval(-150, 150)
        app.stage.filters[0].slices = randomIntFromInterval(40, 80)
    } else {
        text.filters[0].red.x = 0
        text.filters[0].red.y = 0
        text.filters[0].green.x = 0
        text.filters[0].green.y = 0
        text.filters[0].blue.x = 0
        text.filters[0].blue.y = 0
        app.stage.filters[0].offset = 0
    }
}

const setAnimationState = (app, index, textes) => {
    const prevIndex = index !== 0 ? index - 1 : 3
    const prevText = textes[prevIndex]
    const currText = textes[index]

    prevText.renderable = false
    currText.renderable = true
    if (index === 3) {
        const images = textes[3].children.filter(el => el.label === 'Sprite')
        images.forEach(image => {
            image.renderable = false
        })
        const randomImage = images[randomIntFromInterval(0, 3)]
        randomImage.renderable = true
    }
}

const glitchImagesInit = async () => {
    const images = $('js-glitch-image')
    if (!images) return
    const apps = []
    images.items.forEach(async (el, index) => {
        const iWidth = el.clientWidth
        const iHeight = el.clientHeight
        const params = {
            width: iWidth,
            height: iHeight,
            background: '#040214'
        }
        const overlay = el.previousElementSibling
        let isInView = false
        let isStopped = false
        let timeout = null

        const countStars = randomIntFromInterval(2, 5)
        const getStar = () => {
            const color = randomIntFromInterval(1, 2) === 1 ? '#00FF00' : '#FF00FF'
            const left = randomIntFromInterval(20, iWidth - 20)
            const top = randomIntFromInterval(20, iHeight - 20)
            return `
                <svg class="image-star" style="left: ${left}px;top: ${top}px;" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3812 0.495117L17.793 8.57128L25.8691 12.9831L17.793 17.419L13.3812 25.4951L8.94532 17.419L0.869141 12.9831L8.94532 8.57128L13.3812 0.495117Z" fill="${color}"/>
                </svg>
            `
        }
        // for (let i = 0; i < countStars; i++) {
        //     el.innerHTML += getStar()
        // }

        const stopFunc = () => {
            if (!isInView) return
            isStopped = !isStopped
            clearTimeout(timeout)
            timeout = setTimeout(stopFunc, randomIntFromInterval(100, 1200))
        }

        const obsHandler = (entry) => {
            isInView = entry
            if (isInView) stopFunc()
            else clearTimeout(timeout)
        }
        const app = await appInit({
            node: el,
            params,
            maxFPS: 12,
            observerFn: obsHandler
        })
        apps.push(app)
        const rgb = new filters.RGBSplitFilter()
        const glitch = new filters.GlitchFilter()
        const shadow = new filters.DropShadowFilter()
        const src = el.dataset.src

        await PIXI.Assets.load(src)
        const sprite = PIXI.Sprite.from(src)
        sprite.x = 0
        sprite.y = 50 * 0.996 * ratio
        sprite.filters = [rgb, glitch, shadow]
        sprite.width = iWidth * 0.996 * ratio
        sprite.height = iHeight * 0.996 * ratio
        app.stage.addChild(sprite)

        sprite.filters[2].color = '#CC00FF'
        sprite.filters[2].blur = 30
        sprite.filters[2].quality = 10

        app.ticker.add((ticker) => {
            const { top, height } = el.getBoundingClientRect()
            if (-top > height) return

            const wc = innerHeight / 2
            const ic = height / 2
            const p = Math.abs(top + ic - wc)
            const l = innerHeight - (wc - ic)
            const m = p / l

            overlay.style.opacity = m + 0.1

            if (isStopped) {
                sprite.filters[0].green.x = 0
                sprite.filters[0].green.y = 0
                sprite.filters[0].red.x = 0
                sprite.filters[0].red.y = 0
                sprite.filters[0].blue.x = 0
                sprite.filters[0].blue.y = 0
                sprite.filters[1].offset = 0
                sprite.filters[1].slices = 0

                return
            }

            const i = m < 0.25 ? 0 : m
            const s = Math.max(1 - i, 0)
            const co = s * 10
            const so = s * 20
            const bo = s * 30

            sprite.filters[0].red.x = randomIntFromInterval(-co, co)
            sprite.filters[0].red.y = randomIntFromInterval(-co, co)
            sprite.filters[0].green.x = randomIntFromInterval(-co, co)
            sprite.filters[0].green.y = randomIntFromInterval(-co, co)
            sprite.filters[0].blue.x = randomIntFromInterval(-co, co)
            sprite.filters[0].blue.y = randomIntFromInterval(-co, co)
            sprite.filters[1].offset = randomIntFromInterval(-so, so)
            sprite.filters[1].slices = randomIntFromInterval(1, 6)
            sprite.filters[2].blur = bo
        })
    })
}

const mainSecInit = async () => {
    const main = $('js-main-sec')
    if (!main) return
    const mainNode = main.eq(0)
    const params = { background: '#040214', width: innerWidth, height: innerHeight }
    const app = await appInit({
        node: mainNode,
        effects: ['glitch'],
        params,
        maxFPS: 1
    })
    const circle = appendRect(app)
    const textes = await appendText(app)
    const aStates = getSettings()
    const text = textes[0]
    let current = -1

    let time = 0
    app.ticker.add((ticker) => {
        time += Math.floor(ticker.deltaMS)
        const currensState = aStates.find(el => time.isBetween(el.from, el.to))
        if (!currensState) return time = 0

        const { effect, state } = currensState
        if (state !== current) {
            current = state
            setAnimationState(app, current, textes)
        }

        tickerHandler(app, text, effect)
    })
}

const btnsInit = () => {
    const btns = $('js-btn')
    if (!btns) return

    btns.items.forEach(async btn => {
        let force = 0
        let forceInterval = null
        let forceTimeout = null
        let isHovered = false
        const cDark = '#040214'
        const cLight = '#ffffff'
        const text = btn.innerHTML.trim().toUpperCase()
        const type = btn.classList.contains('btn--primary') ? 'primary' : 'secondary'
        const wrapWidth = btn.dataset.wrapwidth

        const {
            fontSize,
            fontFamily,
            color,
            letterSpacing,
            fontWeight,
            width,
            height,
            backgroundColor
        } = getComputedStyle(btn)

        const cWidth = btn.clientWidth
        const cHeight = btn.clientHeight
        const params = { background: cDark, width: cWidth, height: cHeight }

        btn.style.width = width
        btn.style.height = height
        btn.style.backgroundColor = 'transparent'
        btn.innerHTML = ''
        const app = await appInit({
            node: btn,
            effects: ['glitch'],
            params,
            masFPS: 40
        })
        app.stage.filters[0].fillMode = 0

        const rect = new PIXI.Graphics()
        rect.rect(0, 0, app.canvas.width, app.canvas.height)
        rect.fill(backgroundColor)

        if (type === 'secondary') {
            rect.filters = [new filters.ColorOverlayFilter]
            rect.filters[0].color = cDark
        }

        app.stage.addChild(rect)

        await PIXI.Assets.load('/src/fonts/d59df5a538d671a54c79.woff2')

        const style = new PIXI.TextStyle({
            fontSize: +fontSize.replace('px', '') * ratio,
            fontFamily,
            fontWeight,
            fill: color,
            align: 'center',
            wordWrap: !!wrapWidth,
            letterSpacing: +letterSpacing.replace('px', ''),
            wordWrapWidth: !wrapWidth ? 0 : +wrapWidth * ratio,
        })

        const btnText = new PIXI.Text({ text, style })
        btnText.x = (app.canvas.width / 2) - (btnText.width / 2)
        btnText.y = (app.canvas.height / 2) - (btnText.height / 2)
        app.stage.addChild(btnText)

        app.ticker.add(() => {
            const of = Math.max(Math.floor(20 * force), 0)
            app.stage.filters[0].direction = randomIntFromInterval(-20, 20)
            app.stage.filters[0].offset = randomIntFromInterval(-of, of)
            app.stage.filters[0].slices = 150
        })

        if (!detectMobile()) {
            btn.addEventListener('mouseenter', () => {
                isHovered = true
                app.ticker.start()
                force = 1
                if (type === 'secondary') {
                    rect.filters[0].color = cLight
                    btnText.style.fill = cDark
                }
                forceInterval = setInterval(() => {
                    if (force > 0) {
                        force -= 0.05
                    } else if (!forceTimeout) {
                        forceTimeout = setTimeout(() => {
                            force = 1
                            clearTimeout(forceTimeout)
                            forceTimeout = null
                        }, 1000)
                    }
                }, 50)
            })

            btn.addEventListener('mouseleave', () => {
                isHovered = false
                force = 0
                if (forceTimeout) clearTimeout(forceTimeout)
                if (forceInterval) clearInterval(forceInterval)
                forceTimeout = null
                forceInterval = null

                if (type === 'secondary') {
                    rect.filters[0].color = cDark
                    btnText.style.fill = cLight
                }

                setTimeout(() => {
                    if (!isHovered) app.ticker.stop()
                }, 1000);
            })
        }
    })
}

const hiddenSecInit = async () => {
    if (detectMobile()) return
    const section = $('js-hidden-sec')
    if (!section) return
    const src = section.attr('data-src')
    const node = section.eq(0)
    const width = node.clientWidth
    const height = node.clientHeight
    const params = { background: '#040214', width, height }
    const app = await appInit({
        node: node,
        params
    })
    const backgroundImage = await PIXI.Assets.load(src)
    const background = new PIXI.Sprite(backgroundImage)
    const blurSize = 32
    const radius = 200
    let interval = null
    let posX = 0
    let posY = 0

    app.stage.addChild(background)
    background.width = width * ratio
    background.height = height * ratio

    const circle = new PIXI.Graphics().circle(radius + blurSize, radius + blurSize, radius).fill({ color: 0xff0000 })
    // { strength, quality, resolution, kernelSize }
    circle.filters = [new PIXI.BlurFilter({ strength: blurSize + 20, quality: 10 })]
    const bounds = new PIXI.Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2)
    const texture = app.renderer.generateTexture({
        target: circle,
        resolution: 1,
        frame: bounds,
    })
    const focus = new PIXI.Sprite(texture)
    app.stage.addChild(focus)
    background.mask = focus

    app.stage.eventMode = 'static'
    app.stage.hitArea = app.screen
    app.stage.on('pointermove', (event) => {
        posX = event.global.x
        posY = event.global.y
        focus.position.x = Math.max(posX - focus.width / 2, 0)
        focus.position.y = Math.max(posY - focus.height / 2, 0)
    })

    focus.width = 1
    focus.height = 1

    section.on('mouseleave', () => {
        // focus.width = 0
        if (interval) clearInterval(interval)
        interval = setInterval(() => {
            const { height } = focus
            if (height - 10 <= 1) {
                focus.width = 1
                focus.height = 1
                clearInterval(interval)
            } else {
                focus.width = height - 20
                focus.height = height - 20
                focus.position.x = Math.max(posX - focus.width / 2, 0)
                focus.position.y = Math.max(posY - focus.height / 2, 0)
            }
        }, 10)
    })

    section.on('mouseenter', () => {
        // focus.width = (radius + blurSize) * 2
        if (interval) clearInterval(interval)
        interval = setInterval(() => {
            const { height } = focus
            if (height + 10 >= (radius + blurSize) * 2) {
                focus.height = (radius + blurSize) * 2
                focus.width = (radius + blurSize) * 2
                clearInterval(interval)
            } else {
                focus.height = height + 20
                focus.width = height + 20
                focus.position.x = Math.max(posX - focus.width / 2, 0)
                focus.position.y = Math.max(posY - focus.height / 2, 0)
            }
        }, 10)
    })
}

const nominationSecInint = async () => {
    // return
    const section = $('js-nomination-sec')
    if (!section) return
    const src = section.attr('data-image')
    const text = section.attr('data-text')
    const params = { background: '#040214' }
    const isMobile = detectMobile()
    const iWidth = isMobile ? innerWidth / 375 * 416 : Math.min(innerWidth / 1440 * 657, 657)
    const iHeight = isMobile ? innerWidth / 375 * 500 : Math.min(innerWidth / 1440 * 788, 788)
    const rgb = new filters.RGBSplitFilter()
    const glitch = new filters.GlitchFilter()
    const shadow = new filters.DropShadowFilter()

    let isStopped = false
    let timeout = null
    let isInView = false
    let x = 0
    let direction = false

    const stopFunc = () => {
        if (!isInView) return
        isStopped = !isStopped
        clearTimeout(timeout)
        timeout = setTimeout(stopFunc, randomIntFromInterval(400, 1600))
    }

    const obsHandler = (entry) => {
        isInView = entry
        if (isInView) stopFunc()
        else clearTimeout(timeout)
    }

    const app = await appInit({
        node: section.eq(0),
        params,
        maxFPS: 20,
        observerFn: obsHandler
    })

    await PIXI.Assets.load(src)
    const sprite = PIXI.Sprite.from(src)
    sprite.x = (innerWidth / 2 - iWidth / 2) * ratio
    sprite.y = isMobile ? (innerHeight - iHeight - 200) * ratio : (innerHeight - iHeight) * ratio
    sprite.filters = [rgb, glitch, shadow]
    sprite.width = iWidth * ratio
    sprite.height = iHeight * ratio
    sprite.zIndex = 2
    sprite.filters[2].color = '#FF00FF'
    sprite.filters[2].blur = 50
    sprite.filters[2].quality = 10
    app.stage.addChild(sprite)
    console.log(ratio);

    const fontSize = isMobile ? innerWidth / 375 * 500 : innerWidth / 1440 * 250
    const style = {
        fontFamily: 'Bender black',
        fill: params.background,
        stroke: { color: '#fff', width: 3 * ratio },
        textTransform: 'uppercase',
        align: 'center',
        lineHeight: fontSize,
        fontSize,
    }
    const textP = new PIXI.Text({ text: `${text} ${text} ${text}`, style })
    const staticX = innerWidth - textP.width
    textP.x = 0
    console.log(isMobile);
    textP.y = isMobile ? (innerHeight / 2 - textP.height / 2 + 100) * ratio : (innerHeight / 2 - textP.height / 2) * ratio
    textP.zIndex = 1
    app.stage.addChild(textP)

    const co = 15
    const so = 20

    app.ticker.add(() => {
        x += direction ? -3 : 3
        if (x > 0 && !direction) {
            direction = true
        } else if (x < staticX && direction) {
            direction = false
        }

        textP.x = x
        if (isStopped) {
            sprite.filters[0].green.x = 0
            sprite.filters[0].green.y = 0
            sprite.filters[0].red.x = 0
            sprite.filters[0].red.y = 0
            sprite.filters[0].blue.x = 0
            sprite.filters[0].blue.y = 0
            sprite.filters[1].offset = 0
            sprite.filters[1].slices = 0

            return
        }
        sprite.filters[0].red.x = randomIntFromInterval(-co, co)
        sprite.filters[0].red.y = randomIntFromInterval(-co, co)
        sprite.filters[0].green.x = randomIntFromInterval(-co, co)
        sprite.filters[0].green.y = randomIntFromInterval(-co, co)
        sprite.filters[0].blue.x = randomIntFromInterval(-co, co)
        sprite.filters[0].blue.y = randomIntFromInterval(-co, co)
        sprite.filters[1].offset = randomIntFromInterval(-so, so)
        sprite.filters[1].slices = randomIntFromInterval(1, 6)
    })

}

document.addEventListener('DOMContentLoaded', () => {
    glitchImagesInit()
    btnsInit()
    mainSecInit()
    hiddenSecInit()
    nominationSecInint()
})

