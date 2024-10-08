import * as PIXI from 'pixi.js'
import * as filters from 'pixi-filters'
import { $, createObserver, debounce, detectMobile, randomIntFromInterval } from './helper'

const ratio = window.devicePixelRatio

// Инициализация канвас контейнера.
const appInit = async (settings) => {
    const { node, effects, params, maxFPS } = settings
    const app = new PIXI.Application()
    let isInView = false

    params.width = !params.width ? node.clientWidth * ratio : params.width * ratio
    params.height = !params.height ? node.clientHeight * ratio : params.height * ratio

    await app.init(params)
    app.ticker.stop()
    app.stage.renderable = false
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
    const threshold = settings.observer ? settings.observer.threshold ?? 0 : 0

    if (settings.observer !== false) {
        const observer = createObserver(node, (entries) => {
            if (!app || !app.ticker) return observer.disconnect()
            const { isIntersecting } = entries[0]
            isInView = isIntersecting
            if (isIntersecting) {
                if (!app.stage.renderable) app.stage.renderable = true
                if (!app.ticker.started) app.ticker.start()
            } else {
                app.stage.renderable = false
                app.ticker.stop()
            }
            if (settings.observer && typeof settings.observer.handler === 'function') {
                settings.observer.handler(isIntersecting, entries[0])
            }
        }, threshold)
    }

    const blurHandler = () => {
        if (!app || !app.ticker) return window.removeEventListener('blur', blurHandler)
        if (isInView) app.ticker.stop()
    }

    const focusHandler = () => {
        if (!app || !app.ticker) return window.removeEventListener('focus', focusHandler)
        if (isInView) app.ticker.start()
    }

    window.addEventListener('blur', blurHandler)
    window.addEventListener('focus', focusHandler)

    return app
}

// Функционал для первой секции главной страницы
const getSizes = () => {
    const widthMobile = innerWidth
    const heightMobile = innerWidth / 375 * 450
    const widthDesktop = Math.min(Math.max(innerWidth / 1440 * 657, innerHeight / 700 * 657), (innerHeight - 50) * 0.83)
    const heightDesktop = Math.min(Math.max(innerWidth / 1440 * 788, innerHeight / 700 * 788), innerHeight - 50)

    const iWidth = detectMobile() ? widthMobile : widthDesktop
    const iHeight = detectMobile() ? heightMobile : heightDesktop

    return { iWidth, iHeight }
}

const checkIsNeedVideo = () => {
    const main = $('js-main-sec')
    if (!main) return
    const video = main.find('.js-video')[0]
    if (!PIXI.isMobile.phone) return video.remove()

    video.setAttribute('src', '/src/images/main/slider/BBKING.mp4')

    document.addEventListener('DOMContentLoaded', () => {
        if (video.readyState >= 3) return video.play()
        video.addEventListener('loadeddata', () => video.play())
    })
}

const calculateTextWidth = (item, style) => {
    let x, y
    const lineContainer = document.createElement('div')
    lineContainer.innerHTML = item.text.replaceAll('\n', '<br/>')
    lineContainer.style.zIndex = -1
    lineContainer.style.position = 'absolute'
    lineContainer.style.fontSize = `${style.fontSize}px`
    lineContainer.style.lineHeight = `${style.fontSize}px`
    lineContainer.style.fontFamily = style.fontFamily
    document.body.append(lineContainer)
    const textWidth = lineContainer.clientWidth * ratio
    const textHeight = lineContainer.clientHeight * ratio
    lineContainer.remove()

    if (item.x === 'left') x = textWidth / 2 + (containerRect.left + 16) * ratio
    else if (item.x === 'center') x = (innerWidth / 2) * ratio
    else if (item.x === 'right') x = (containerRect.right - 16) * ratio - textWidth / 2
    else x = (innerWidth / 2) * ratio

    if (item.y === 'top') y = textHeight / 2 + 140 * ratio
    else if (item.y === 'center') y = (innerHeight / 2) * ratio
    else if (item.y === 'bottom') y = innerHeight * ratio - (textHeight / 2) - 120 * ratio
    else y = (innerHeight / 2) * ratio

    return { x, y, textWidth, textHeight }
}

const calculateImagePosition = (pos, params) => {
    let y, x
    const bottomOffset = detectMobile() ? 100 : 0
    if (pos.x === 'left') x = (containerRect.left + 16) * ratio
    else if (pos.x === 'center') x = (innerWidth / 2 - params.width / 2) * ratio
    else if (pos.x === 'right') x = (containerRect.right - params.width) * ratio
    else x = (innerWidth / 2 - params.width / 2) * ratio

    if (pos.y === 'top') y = 0
    else if (pos.y === 'center') y = (innerHeight / 2) * ratio
    else if (pos.y === 'bottom') y = (innerHeight - params.height - bottomOffset) * ratio
    else y = (innerHeight / 2) * ratio

    return { y, x }
}

const appendText = async (app, input) => {
    const isMobile = detectMobile()
    const width = app.canvas.width
    const height = app.canvas.height
    const fontSize1 = width / 1440 * 96
    const fontSize2 = width / 1440 * 40
    const fontSize3 = width / 1440 * 58
    const fontSize4 = width / 1440 * 120
    const rgb = new filters.RGBSplitFilter()
    let textList
    const standartStyle = {
        fontFamily: 'Bender black',
        fill: '#fff',
        align: 'center',
    }

    const textes = input
        ? input.map(() => new PIXI.Container())
        : [
            new PIXI.Container(),
            new PIXI.Container(),
            new PIXI.Container(),
            new PIXI.Container()
        ]

    if (input) {
        textList = input.map((item, index) => {
            const size = isMobile ? item.size || 58 : item.size || 96
            const delim = isMobile ? innerWidth / 375 : innerWidth / 1440
            const fontSize = delim * size
            const { x, y } = calculateTextWidth(item, { fontFamily: standartStyle.fontFamily, fontSize })

            const map = {
                x, y,
                text: item.text,
                container: index + 1,
                fontSize: fontSize * ratio,
            }
            return map
        })
    } else {
        if (isMobile) {
            textList = [
                { text: 'barber king\n2o24', fontSize: fontSize1 * 2, container: 1, x: width / 2, y: height / 2 - 75 },
                { text: '21 - 22\nоkтября', fontSize: fontSize1 * 2, container: 2, x: width / 2, y: height / 2 - 75 },
                { text: 'barber king 2o24', fontSize: fontSize2 * 2, container: 2, x: width / 2, y: height / 2 + fontSize1 * 2 },
                { text: 'МТС\nLive Холл', fontSize: fontSize1 * 2, container: 3, x: width / 2, y: height / 2 - 75 },
                { text: 'barber king 2o24', fontSize: fontSize2 * 2, container: 3, x: width / 2, y: height / 2 + fontSize1 * 2 },
                { text: 'barber king', fontSize: fontSize3 * 2.5, container: 4, x: width / 3, y: height / 3 },
                { text: '2o24', fontSize: fontSize4 * 2, container: 4, x: width / 1.3, y: height / 1.5 },
            ]
        } else {
            textList = [
                { text: 'barber king\n2o24', fontSize: fontSize1, container: 1, x: width / 2, y: height / 2 },
                { text: '21 - 22 оkтября', fontSize: fontSize1, container: 2, x: width / 2, y: height / 2 },
                { text: 'barber king 2o24', fontSize: fontSize2, container: 2, x: width / 2, y: height / 2 + fontSize1 },
                { text: 'МТС Live Холл', fontSize: fontSize1, container: 3, x: width / 2, y: height / 2 },
                { text: 'barber king 2o24', fontSize: fontSize2, container: 3, x: width / 2, y: height / 2 + fontSize1 },
                { text: 'barber king', fontSize: fontSize3, container: 4, x: width / 3.8, y: height / 4 },
                { text: '2o24', fontSize: fontSize4, container: 4, x: width / 1.5, y: height / 1.2 },
            ]
        }
    }

    if (!input) {
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
    }

    textList.forEach((el, index) => {
        const align = input ? input[index].textAlign || 'left' : standartStyle.align
        const { fontSize, text, container } = el
        const style = {
            ...standartStyle,
            lineHeight: fontSize,
            fontSize,
            align,
        }

        const pixiText = new PIXI.Text({ text, style })
        pixiText.x = el.x - (pixiText.width / 2)
        pixiText.y = el.y - (pixiText.height / 2)
        pixiText.zIndex = 3
        textes[container - 1].addChild(pixiText)
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

const getSettings = (states = 4) => {
    const timePerState = 400
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

const setAnimationState = (index, textes) => {
    const prevIndex = index !== 0 ? index - 1 : textes.length - 1
    const prevText = textes[prevIndex]
    const currText = textes[index]

    prevText.renderable = false
    currText.renderable = true
    if (index === 3) {
        const images = textes[3].children.filter(el => el.label === 'Sprite')
        if (!images.length) return
        images.forEach(image => {
            image.renderable = false
        })
        const randomImage = images[randomIntFromInterval(0, 3)]
        randomImage.renderable = true
    }
}

const mainSecInit = async () => {
    const main = $('js-main-sec')
    if (!main) return
    if (PIXI.isMobile.phone) return

    const mainNode = main.eq(0)
    const app = await appInit({
        node: mainNode,
        effects: ['glitch'],
        maxFPS: 1,
        params: {
            background: '#040214',
            width: innerWidth,
            height: innerHeight
        },
    })
    const rectes = appendRect(app)
    const textes = await appendText(app)
    const states = getSettings()
    const text = textes[0]
    let current = -1

    let time = 0
    app.ticker.add((ticker) => {
        time += Math.floor(ticker.deltaMS)
        const currensState = states.find(el => time.isBetween(el.from, el.to))
        if (!currensState) return time = 0

        const { effect, state } = currensState
        if (state !== current) {
            current = state
            setAnimationState(current, textes)
        }

        tickerHandler(app, text, effect)
    })

    window.appMainSection = app

    const debounceResize = debounce(() => {
        window.appMainSection.canvas.remove()
        window.appMainSection.destroy()

        setTimeout(mainSecInit, 500)

        window.removeEventListener('resize', debounceResize)
    }, 2000)

    window.addEventListener('resize', debounceResize)
}

// Первая секция на странице победителей
const winnerSecInit = async () => {
    const section = $('js-winner-sec')
    const settings = window.winnerData

    if (!section || !settings) return
    const { textInfo, imageInfo } = settings
    const textOutput = PIXI.isMobile.phone ? textInfo.mobile : textInfo.desktop
    const mainNode = section.eq(0)
    const app = await appInit({
        node: mainNode,
        effects: ['glitch'],
        maxFPS: 1,
        params: {
            background: '#040214',
            width: innerWidth,
            height: innerHeight
        },
    })

    await PIXI.Assets.load(imageInfo.src)
    const rgb = new filters.RGBSplitFilter()
    const glitch = new filters.GlitchFilter()
    const sprite = PIXI.Sprite.from(imageInfo.src)
    const { iWidth, iHeight } = getSizes()
    sprite.width = iWidth * ratio
    sprite.height = iHeight * ratio
    const pos = {
        y: PIXI.isMobile.phone ? imageInfo.imagePosition.mobyleY : imageInfo.imagePosition.desktopY,
        x: PIXI.isMobile.phone ? imageInfo.imagePosition.mobyleX : imageInfo.imagePosition.desktopX,
    }
    const { y, x } = calculateImagePosition(pos, { width: iWidth, height: iHeight })
    sprite.x = x
    sprite.y = y
    sprite.filters = [rgb]
    app.stage.addChild(sprite)

    const overlayHeight = PIXI.isMobile.phone ? 300 : 400
    const overlay = new PIXI.Graphics().rect(0, 0, (innerWidth + 600) * ratio, overlayHeight * ratio).fill('#040214')
    overlay.x = -300 * ratio
    overlay.y = (innerHeight - overlayHeight / 1.5) * ratio
    overlay.filters = [new PIXI.BlurFilter({ strength: overlayHeight, quality: 60 })]
    app.stage.addChild(overlay)

    const textes = await appendText(app, textOutput)
    const states = getSettings(textOutput.length)
    const text = textes[0]

    let current = -1
    let time = 0



    app.ticker.add((ticker) => {
        time += Math.floor(ticker.deltaMS)
        const currentState = states.find(el => time.isBetween(el.from, el.to))
        if (!currentState) return time = 0

        const { effect, state } = currentState
        if (state !== current) {
            current = state
            setAnimationState(current, textes)
        }

        tickerHandler(app, text, effect)
    })

    window.appMainSection = app

    const debounceResize = debounce(() => {
        window.appMainSection.canvas.remove()
        window.appMainSection.destroy()

        setTimeout(winnerSecInit, 500)

        window.removeEventListener('resize', debounceResize)
    }, 2000)

    window.addEventListener('resize', debounceResize)
}

// Первая секция на странице номинации
const nominationSecInint = async () => {
    const section = $('js-nomination-sec')
    if (!section) return
    const src = section.attr('data-image')
    const text = section.attr('data-text').trim().toUpperCase()
    const params = { background: '#040214' }
    const isMobile = detectMobile()

    const { iWidth, iHeight } = getSizes()
    const rgb = new filters.RGBSplitFilter()
    const glitch = new filters.GlitchFilter()
    const shadow = new filters.DropShadowFilter()

    let isStopped = false
    let timeout = null
    let isInView = false
    let x = 0

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
        resizeTo: window,
        observer: {
            handler: obsHandler
        }
    })

    await PIXI.Assets.load(src)
    const sprite = PIXI.Sprite.from(src)
    sprite.x = (innerWidth / 2 - iWidth / 2) * ratio
    sprite.y = isMobile ? (innerHeight - iHeight - 150) * ratio : (innerHeight - iHeight) * ratio
    sprite.filters = [rgb, glitch, shadow]
    sprite.width = iWidth * ratio
    sprite.height = iHeight * ratio
    sprite.zIndex = 2
    sprite.filters[2].color = '#FF00FF'
    sprite.filters[2].blur = 50
    sprite.filters[2].quality = 10
    app.stage.addChild(sprite)

    const fontSize = isMobile ? 250 : (innerWidth / 1440 * 250) * ratio
    const style = {
        fontFamily: 'Bender black',
        fill: params.background,
        stroke: { color: '#fff', width: 3 * ratio },
        textTransform: 'uppercase',
        align: 'center',
        lineHeight: fontSize,
        letterSpacing: 20,
        fontSize,
    }
    const textRefract = text.length > 15 ? text : `${text} ${text} ${text}`
    const textP = new PIXI.Text({ text: textRefract, style })
    const staticX = innerWidth - textP.width - 300
    const centerY = (innerHeight / 2) * ratio - (textP.height / 2)
    textP.x = 0
    textP.y = isMobile ? centerY - 50 * ratio : centerY
    textP.zIndex = 1
    app.stage.addChild(textP)

    const co = 15
    const so = 20

    app.ticker.add(() => {
        x += -3
        if (x < staticX) x = 0

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

    window.appMainSection = app

    const debounceResize = debounce(() => {
        window.appMainSection.canvas.remove()
        window.appMainSection.destroy()

        setTimeout(nominationSecInint, 500)

        window.removeEventListener('resize', debounceResize)
    }, 2000)

    if (!detectMobile()) {
        window.addEventListener('resize', debounceResize)
    }
    window.locscroll.update()
}

// Номинации
const glitchImagesInit = async () => {
    const images = $('js-glitch-image')
    if (!images) return
    const image = images.eq(0)
    const width = image.clientWidth
    const height = image.clientHeight
    const pixiImages = {}
    const rgb = new filters.RGBSplitFilter()
    const glitch = new filters.GlitchFilter()
    const shadow = new filters.DropShadowFilter()
    const params = {
        node: image,
        maxFPS: 6,
        observer: false,
        params: {
            width,
            height,
            background: '#040214',
        },
    }
    const app = await appInit(params)

    let isStopped = false
    let currentRender = -1
    let timeout = null
    let timeout1 = null
    let timeout2 = null

    const stopFunc = () => {
        isStopped = !isStopped
        clearTimeout(timeout)
        timeout = setTimeout(stopFunc, randomIntFromInterval(400, 1600))
    }

    stopFunc()

    app.canvas.style.transition = '1.4s'
    app.canvas.style.opacity = 0

    images.items.forEach(async (el, index) => {
        const src = el.dataset.src
        const image = document.createElement('img')
        image.setAttribute('src', src)
        el.append(image)

        const p = await PIXI.Assets.load(src)
        const sprite = PIXI.Sprite.from(src)
        sprite.x = 0
        sprite.y = 50 * 0.996 * ratio
        sprite.filters = [rgb, glitch, shadow]
        sprite.width = width * 0.996 * ratio
        sprite.height = height * 0.996 * ratio
        sprite.filters[2].color = '#CC00FF'
        sprite.filters[2].blur = 30
        sprite.filters[2].quality = 10
        app.stage.addChild(sprite)
        sprite.renderable = false
        pixiImages[index] = sprite

        const obsHandler = (entries) => {
            const isInView = entries[0].isIntersecting
            if (!isInView) return
            if (currentRender === index) return
            isStopped = false
            app.canvas.style.transition = '0.2s'
            app.canvas.style.opacity = 0
            clearTimeout(timeout1)
            clearTimeout(timeout2)
            timeout1 = setTimeout(() => {
                isStopped = false
                app.canvas.style.transition = '1.4s'
                if (currentRender !== -1) {
                    pixiImages[currentRender].renderable = false
                }
                currentRender = index
                pixiImages[currentRender].renderable = true
                el.append(app.canvas)
            }, 50)
            timeout2 = setTimeout(() => {
                app.canvas.style.opacity = 1
                app.ticker.start()
            }, 200)
        }

        createObserver(el, obsHandler, 0.9)
    })

    const setFilters = (sprite, co, so, bo) => {
        sprite.filters[0].red.x = randomIntFromInterval(-co, co)
        sprite.filters[0].red.y = randomIntFromInterval(-co, co)
        sprite.filters[0].green.x = randomIntFromInterval(-co, co)
        sprite.filters[0].green.y = randomIntFromInterval(-co, co)
        sprite.filters[0].blue.x = randomIntFromInterval(-co, co)
        sprite.filters[0].blue.y = randomIntFromInterval(-co, co)
        sprite.filters[1].offset = randomIntFromInterval(-so, so)
        sprite.filters[1].slices = randomIntFromInterval(1, 6)
        sprite.filters[2].blur = bo
    }

    app.ticker.add((ticker) => {
        if (isStopped) return setFilters(pixiImages[0], 0, 0, 30)
        setFilters(pixiImages[0], 10, 20, 30)
    })
}

// Кнопки
const btnsInit = () => {
    if (detectMobile()) return
    const btns = $('js-btn')
    if (!btns) return

    btns.items.forEach(async btn => {
        let force = 0
        let forceInterval = null
        let forceTimeout = null
        let isHovered = false
        const cDark = '#040214'
        const cLight = '#ffffff'
        const text = btn.innerHTML.trim().toUpperCase().replaceAll('<BR>', '\n').replaceAll('&AMP;', '&')
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
        const fz = +fontSize.replace('px', '') * ratio

        const style = new PIXI.TextStyle({
            fontSize: fz,
            fontFamily,
            fontWeight,
            lineHeight: fz * 1.4,
            fill: color,
            align: 'center',
            letterSpacing: +letterSpacing.replace('px', ''),
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
    })
}

// Секция перед футером
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

checkIsNeedVideo()

document.addEventListener('DOMContentLoaded', async () => {
    mainSecInit()
    winnerSecInit()
    nominationSecInint()
    btnsInit()
    glitchImagesInit()
    hiddenSecInit()
})

