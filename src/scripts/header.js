import { $, debounce, detectMobile } from './helper'

const headerInit = () => {
    const menuBtn = $('js-menu-btn')
    const menu = $('js-menu')
    const header = $('js-header')
    const inner = $('js-menu-inner')
    const isMobile = detectMobile()
    const node = header.eq(0)
    const scroll = document.querySelector('.scroll')
    let scrollTo = 0
    let isOpen = false

    const menuToggle = () => {
        isOpen = !isOpen

        menuBtn.attr('data-open', isOpen)
        menu.attr('data-open', isOpen)
        header.attr('data-open', isOpen)

        if (isOpen) {
            locscroll.stop()

            // if (isMobile) {
            //     inner.eq(0).scrollTo({ top: -20000 })
            // }
        } else {
            locscroll.start()
        }
    }

    menuBtn.on('click', menuToggle)

    if (isMobile) {
        const debounceScroll = debounce(() => {
            const y = scroll.scrollTop
            if (y < 200) return node.dataset.hidden = false
            if (y === scrollTo) return
            node.dataset.hidden = y > scrollTo
            scrollTo = y
        }, 30)
        scroll.addEventListener('scroll', debounceScroll)
    } else {
        locscroll.on('scroll', event => {
            const y = event.delta.y
            if (y < 200) return node.dataset.hidden = false
            if (y === scrollTo) return
            node.dataset.hidden = y > scrollTo
            scrollTo = y
        })
    }
}

document.addEventListener('DOMContentLoaded', headerInit)
