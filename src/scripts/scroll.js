import locomotiveScroll from 'locomotive-scroll'
import { $, detectMobile } from './helper'

window.locscroll = new locomotiveScroll({
    el: document.querySelector('.scroll'),
    smooth: true,
    // tablet: {
    //     smooth: true
    // },
    // smartphone: {
    //     smooth: true
    // }
})

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