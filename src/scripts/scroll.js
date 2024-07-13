import locomotiveScroll from 'locomotive-scroll'
import { $ } from './helper'

window.locscroll = new locomotiveScroll({
    el: document.querySelector('.scroll'),
    smooth: true,
    tablet: {
        smooth: true
    },
    smartphone: {
        smooth: true
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const scrollLinks = $('js-main-scroll')
    if (!scrollLinks) return

    scrollLinks.on('click', function () {
        const sectionTo = $(this.dataset.scroll).eq(0)
        locscroll.scrollTo(sectionTo, {
            offset: -100,
            duration: 400
        })
    })
})