import { $, createObserver, randomIntFromInterval } from './helper'

const linesInit = () => {
    const lines = $('js-lines')
    if (!lines.items.length) return
    const y = lines.eq(0).getBoundingClientRect().top - innerHeight
    const pathes = lines.find('path')

    const scrollHandler = event => {
        const deltaY = event.scroll.y - y
        if (deltaY > 0 && deltaY < innerHeight * 2) {
            pathes.forEach(path => {
                path.style.strokeDashoffset = 35000 - (deltaY * 10)
            })
        }
    }

    const observerHandler = (entries) => {
        const { isIntersecting } = entries[0]
        if (isIntersecting) {
            locscroll.on('scroll', scrollHandler)
        } else {
            locscroll.off('scroll', scrollHandler)
        }
    }

    createObserver(lines.eq(0), observerHandler)
}

const nominationsInit = () => {
    const section = $('js-nominations')
    if (!section) return
    const items = section.find('.nominations__item')
    let index = -1
    let isScrolling = false

    const wheelHandler = (event) => {
        if (isScrolling) return 
        isScrolling = true
        const { deltaY } = event

        if (deltaY > 0) {
            index++
        } else {
            index--
        }
        if (index >= 0 && index < items.length) {
            locscroll.stop()
            locscroll.scrollTo(items[index], {
                offset: -100,
                duration: 300,
            })
        }

        setTimeout(() => {
            isScrolling = false
            locscroll.start()
        }, 500)
    }

    const observerHandler = (entries) => {
        const { isIntersecting } = entries[0]
        if (isIntersecting) {
            window.addEventListener('wheel', wheelHandler)
        } else {
            isScrolling = false
            window.removeEventListener('wheel', wheelHandler)
        }
    }

    createObserver(section.eq(0), observerHandler)
}

document.addEventListener('DOMContentLoaded', () => {
    linesInit()
    nominationsInit()
})