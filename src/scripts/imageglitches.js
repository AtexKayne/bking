import * as PIXI from 'pixi.js'
import * as filters from 'pixi-filters'
import { $, createObserver, randomIntFromInterval } from './helper'

const glitchImagesIn = async () => {
    const images = $('js-glitch-image')
    const apps = []
    images.items.forEach(async (el, index) => {
        const app = new PIXI.Application()
        await app.init({ width: el.dataset.width, height: el.dataset.height, background: '#040214' })
        apps.push(app)
        const rgb = new filters.RGBSplitFilter()
        const glitch = new filters.GlitchFilter()
        const shadow = new filters.DropShadowFilter()
        // const blur = new filters.KawaseBlurFilter()
        const canvas = app.canvas
        el.append(canvas)
        const src = el.dataset.src
        await PIXI.Assets.load(src)
        // const circle = new PIXI.Graphics().circle(250, 440, 150).fill('#CC00FF')
        // app.stage.addChild(circle)
        // circle.filters = [blur]
        // circle.filters[0].strength = 40
        // circle.filters[0].quality = 10
        // circle.filters[0].pixelSizeY = 1
        // circle.filters[0].pixelSizeX = 1

        const sprite = PIXI.Sprite.from(src)
        sprite.x = 0
        sprite.y = 50
        sprite.filters = [rgb, glitch, shadow]
        sprite.width = 483
        sprite.height = 580
        app.stage.addChild(sprite)
        app.ticker.maxFPS = 12


        sprite.filters[0].red.x = 0
        sprite.filters[0].red.y = 0
        sprite.filters[0].green.x = 0
        sprite.filters[0].green.y = 0
        sprite.filters[0].blue.x = 0
        sprite.filters[0].blue.y = 0
        sprite.filters[1].offset = 0
        sprite.filters[1].slices = 1
        sprite.filters[2].color = '#CC00FF'
        sprite.filters[2].blur = 30
        sprite.filters[2].quality = 10


        // 040214

        const intervalOffset = 20
        let intCount = 0
        let newInterval = randomIntFromInterval(20, 70)
        let isStartPos = false
        let isInView = false
        app.ticker.add((ticker) => {
            // if (elapsed > interval && elapsed < interval + intervalOffset) {
            if (isStartPos) {
                sprite.filters[1].offset = 0
                sprite.filters[1].slices = 1
                sprite.filters[0].red.x = 0
                sprite.filters[0].red.y = 0
                sprite.filters[0].green.x = 0
                sprite.filters[0].green.y = 0
                sprite.filters[0].blue.x = 0
                sprite.filters[0].blue.y = 0

                isStartPos = false
                app.ticker.stop()
            } else {
                sprite.filters[1].offset = randomIntFromInterval(-20, 20)
                sprite.filters[1].slices = randomIntFromInterval(1, 6)
                sprite.filters[0].red.x = randomIntFromInterval(-10, 10)
                sprite.filters[0].red.y = randomIntFromInterval(-10, 10)
                sprite.filters[0].green.x = randomIntFromInterval(-10, 10)
                sprite.filters[0].green.y = randomIntFromInterval(-10, 10)
                sprite.filters[0].blue.x = randomIntFromInterval(-10, 10)
                sprite.filters[0].blue.y = randomIntFromInterval(-10, 10)
            }
            // } else if (elapsed > interval + intervalOffset) {
            //     interval = randomIntFromInterval(30, 400)
            //     elapsed = 0
            // }
        })

        const inter = setInterval(() => {
            if (!isInView) return
            intCount++

            if (intCount > newInterval && intCount < newInterval + intervalOffset) {
                app.ticker.start()
            } else if (intCount > newInterval + intervalOffset) {
                intCount = 0
                newInterval = randomIntFromInterval(50, 150)
                app.ticker.stop()
                setTimeout(() => {
                    isStartPos = true
                    app.ticker.start()
                }, 80)
            }
        }, 20)

        createObserver(el, (entries) => {
            isInView = entries[0].isIntersecting
            if (isInView) {
                app.ticker.start()
            } else {
                app.ticker.stop()
            }
        })
    })

    window.addEventListener('blur', () => {
        apps.forEach(app => app.ticker.stop())
    })

    window.addEventListener('focus', () => {
        apps.forEach(app => app.ticker.start())
    })
}

const appInit = async (node, effects = [], params = {}, maxFPS = 0) => {
    const app = new PIXI.Application()

    if (!params.width) params.width = node.clientWidth
    if (!params.height) params.height = node.clientHeight

    await app.init(params)
    const canvas = app.canvas
    node.append(canvas)
    const rect = new PIXI.Graphics().rect(0, 0, params.width, params.height).fill(params.background)
    app.stage.addChild(rect)

    if (effects.length) {
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
        if (isIntersecting) app.ticker.start()
        else app.ticker.stop()
    })

    return app
}

const appendText = async (app) => {
    await PIXI.Assets.load('/src/fonts/bf2d136f158c0796316e.woff')
    const width = app.canvas.clientWidth
    const height = app.canvas.clientHeight
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
        fontFamily: 'Bender regular',
        fontWeight: 'bold',
        fill: '#fff',
        wordWrap: true,
        align: 'center',
        wordWrapWidth: width / 1440 * 500,
    }
    const textList = [
        { text: 'ㅤbarber kingㅤ 2o24', fontSize: fontSize1, container: 1, x: width / 2, y: height / 2 },
        { text: 'ㅤ21 - 22 оkтябряㅤ', fontSize: fontSize1, container: 2, x: width / 2, y: height / 2 },
        { text: 'barber king 2o24', fontSize: fontSize2, container: 2, x: width / 2, y: height / 2 + 100 },
        { text: 'ㅤМТС Live Холлㅤ', fontSize: fontSize1, container: 3, x: width / 2, y: height / 2 },
        { text: 'barber king 2o24', fontSize: fontSize2, container: 3, x: width / 2, y: height / 2 + 100 },
        { text: 'barber king', fontSize: fontSize3, container: 4, x: width / 3.8, y: height / 4 },
        { text: '2o24', fontSize: fontSize4, container: 4, x: width / 1.5, y: height / 1.2 },
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
        const imageWidth = width / 1440 * 658
        const imageHeight = width / 1440 * 538
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
    const radius = height / 700 * 90
    const coordX = width / 2
    const coordY = height / 2
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
    const timePerState = 1000
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
    const co = 1
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

const mainSecInit = async () => {
    const main = $('js-main-sec')
    if (!main.items.length) return
    const mainNode = main.eq(0)
    const params = { background: '#040214', resizeTo: window }
    const app = await appInit(mainNode, ['glitch'], params, 1)
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
    if (!btns.items.length) return

    btns.items.forEach(async btn => {
        let force = 0
        let forceInterval = null
        let forceTimeout = null
        const cDark = '#040214'
        const cLight = '#ffffff'
        const text = btn.innerHTML.trim().toUpperCase()
        const type = btn.classList.contains('btn--primary') ? 'primary' : 'secondary'
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
        const app = await appInit(btn, ['glitch'], params, 40)
        app.stage.filters[0].fillMode = 0

        const rect = new PIXI.Graphics()
        rect.rect(0, 0, cWidth, cHeight)
        rect.fill(backgroundColor)

        if (type === 'secondary') {
            rect.filters = [new filters.ColorOverlayFilter]
            rect.filters[0].color = cDark
        }

        app.stage.addChild(rect)

        await PIXI.Assets.load('/src/fonts/d59df5a538d671a54c79.woff2')
        const style = new PIXI.TextStyle({
            fontSize,
            fontFamily,
            fontWeight,
            fill: color,
            wordWrap: true,
            align: 'center',
            wordWrapWidth: cWidth - 40,
            letterSpacing: +letterSpacing.replace('px', ''),
            // align: 'center',
        })
        const btnText = new PIXI.Text({ text, style })
        btnText.x = (cWidth / 2) - (btnText.width / 2)
        btnText.y = (cHeight / 2) - (btnText.height / 2)
        app.stage.addChild(btnText)

        // app.ticker.stop()
        app.ticker.add(() => {
            const of = Math.max(Math.floor(20 * force), 0)
            const sl = Math.max(Math.floor(60 * force), 0)
            app.stage.filters[0].direction = randomIntFromInterval(-20, 20)
            app.stage.filters[0].offset = randomIntFromInterval(-of, of)
            app.stage.filters[0].slices = randomIntFromInterval(sl, sl * 2)
        })

        btn.addEventListener('mouseenter', () => {
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
            force = 0
            if (forceTimeout) clearTimeout(forceTimeout)
            if (forceInterval) clearInterval(forceInterval)
            forceTimeout = null
            forceInterval = null

            if (type === 'secondary') {
                rect.filters[0].color = cDark
                btnText.style.fill = cLight
            }
        })
    })
}

const hiddenSecInit = async () => {
    const section = $('js-hidden-sec')
    if (!section.items.length) return
    const src = section.attr('data-src')
    const node = section.eq(0)
    const width = node.clientWidth
    const height = node.clientHeight
    const params = { background: '#040214', resizeTo: window, width, height }
    const app = await appInit(node, [], params)
    const backgroundImage = await PIXI.Assets.load(src)
    const background = new PIXI.Sprite(backgroundImage)
    const blurSize = 32
    const radius = 100

    app.stage.addChild(background)
    background.width = width
    background.height = height

    const circle = new PIXI.Graphics().circle(radius + blurSize, radius + blurSize, radius).fill({ color: 0xff0000 });
    // { strength, quality, resolution, kernelSize }
    circle.filters = [new PIXI.BlurFilter({ strength: blurSize + 20, quality: 10 })];
    const bounds = new PIXI.Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2);
    const texture = app.renderer.generateTexture({
        target: circle,
        resolution: 1,
        frame: bounds,
    });
    const focus = new PIXI.Sprite(texture);
    app.stage.addChild(focus);
    background.mask = focus;

    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointermove', (event) => {
        focus.position.x = event.global.x - focus.width / 2;
        focus.position.y = event.global.y - focus.height / 2;
    });

    section.on('mouseleave', () => {
        focus.x = -260
    })
}

document.addEventListener('DOMContentLoaded', () => {
    glitchImagesIn()
    mainSecInit()
    btnsInit()
    hiddenSecInit()
})

