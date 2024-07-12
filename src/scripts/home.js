import { $, createObserver, randomIntFromInterval } from './helper'

const linesInit = () => {
    const lines = $('js-lines')
    if (!lines.items.length) return
    const y = lines.eq(0).getBoundingClientRect().top - innerHeight
    const pathes = lines.find('path')
    console.log(pathes);

    const scrollHandler = event => {
        const deltaY = event.scroll.y - y
        if (deltaY > 0 && deltaY < innerHeight * 2) {
            pathes.forEach(path => {
                path.style.strokeDashoffset = 35000 - (deltaY * 10)
            })
            console.log(deltaY);
        }
    }

    const observerHandler = (entries) => {
        const { isIntersecting } = entries[0]
        console.log(isIntersecting);
        if (isIntersecting) {
            locscroll.on('scroll', scrollHandler)
        } else {
            locscroll.off('scroll', scrollHandler)
        }
    }

    createObserver(lines.eq(0), observerHandler)

    
}

document.addEventListener('DOMContentLoaded', () => {
    linesInit()
})