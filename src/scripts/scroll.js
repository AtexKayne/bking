import locomotiveScroll from 'locomotive-scroll'
import { $, debounce, detectMobile } from './helper'

const scrollEl = document.querySelector('.scroll')

window.locscroll = new locomotiveScroll({
    el: scrollEl,
    smooth: true,
    // tablet: {
    //     smooth: true
    // },
    // smartphone: {
    //     smooth: true
    // }
})

const updateScroll = debounce(() => {
    window.locscroll?.update()
}, 100)

const bindImageLoadUpdates = (root = scrollEl) => {
    if (!root) return

    root.querySelectorAll('img').forEach(img => {
        if (img.complete) return
        img.addEventListener('load', updateScroll, { once: true })
        img.addEventListener('error', updateScroll, { once: true })
    })
}

const bindScrollHeightUpdates = () => {
    if (!scrollEl) return

    bindImageLoadUpdates()
    updateScroll()

    window.addEventListener('load', updateScroll)
    window.addEventListener('resize', updateScroll)

    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(updateScroll).observe(scrollEl)
    }

    if (document.fonts?.ready) {
        document.fonts.ready.then(updateScroll)
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindScrollHeightUpdates)
} else {
    bindScrollHeightUpdates()
}

document.addEventListener('DOMContentLoaded', () => {
    const scrollLinks = $('js-scroll-to')
    if (!scrollLinks) return

    scrollLinks.on('click', function () {
        const sectionTo = $(this.dataset.scroll).eq(0)
        if (detectMobile()) {
            const scroll = document.querySelector('.scroll')
            scroll.scrollTo({
                top: sectionTo.offsetTop,
                behavior: 'smooth',
            })
        } else {
            locscroll.scrollTo(sectionTo, {
                offset: -100,
                duration: 400
            })
        }
    })
})