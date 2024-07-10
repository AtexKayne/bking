import { $, createObserver, randomIntFromInterval } from './helper'

const linesInit = () => {
    const lines = $('js-lines')
    if (!lines.items.length) return

    const observerHandler = (entries) => {
        const { isIntersecting } = entries[0]
        if (isIntersecting) {
            lines.attr('data-active', 'true')
        }
    }

    createObserver(lines.eq(0), observerHandler)
}

document.addEventListener('DOMContentLoaded', () => {
    linesInit()
})