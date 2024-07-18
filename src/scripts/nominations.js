import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import { $, detectMobile } from './helper'

const timelineSliderInit = () => {
    const swiper = new Swiper('.js-timeline', {
        slidesPerView: 'auto',
        spaceBetween: 40,
        slideClass: 'js-timeline-item',
        // slidesOffsetBefore: 60,
        wrapperClass: 'js-timeline-inner',
        slidePrevClass: 'js-timeline-item-prev',
        slideNextClass: 'js-timeline-item-next',
        slideActiveClass: 'js-timeline-item-active',
        // pagination: {
        //     el: '.swiper-pagination',
        //     clickable: true,
        // },
    })
}

const participantSecInit = () => {
    const items = $('js-participant-item')
    if (!items) return

    const next = $('js-participant-next')
    const prev = $('js-participant-prev')
    prev.attr('data-active', 'false')

    items.items.forEach(item => {
        const btn = item.querySelector('.js-participant-item-switch')
        const desc = item.querySelector('.js-participant-item-desc')
        let isOpen = false

        btn.addEventListener('click', () => {
            isOpen = !isOpen
            item.dataset.open = isOpen
        })

        desc.addEventListener('wheel', event => {
            event.stopPropagation()
        })
    })

    const swiper = new Swiper('.js-participant', {
        slidesPerView: 'auto',
        spaceBetween: 40,
        slideClass: 'js-participant-col',
        // slidesOffsetBefore: 60,
        wrapperClass: 'js-participant-inner',
        slidePrevClass: 'js-participant-col-prev',
        slideNextClass: 'js-participant-col-next',
        slideActiveClass: 'js-participant-col-active',
        modules: [Pagination],
        pagination: {
            dynamicBullets: true,
            renderBullet: (index, className) => {
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
            el: '.js-participant-pagination',
            clickable: true,
        },
    })

    swiper.on('slideChange', () => {
        const { progress } = swiper

        prev.attr('data-active', progress !== 0)
        next.attr('data-active', progress !== 1)
    })

    next.on('click', () => swiper.slideNext())
    prev.on('click', () => swiper.slidePrev())
}

const rulesSecInit = () => {
    const image = $('js-rules-image')
    const items = $('js-rules-item')
    if (!image || !items) return

    if (detectMobile()) {
        const imageNode = image.eq(0).querySelector('img')
        let imageHeight = imageNode.getBoundingClientRect().height + 20
        if (!imageNode.complete) {
            imageNode.addEventListener('load', () => {
                imageHeight = imageNode.getBoundingClientRect().height + 20
            })
        }
        items.items.forEach((item) => {
            let isOpen = false
            const container = item.querySelector('.js-rules-item-container')

            item.addEventListener('click', () => {
                isOpen = !isOpen
                item.dataset.active = isOpen
                const height = isOpen ? imageHeight : 0
                container.style.height = `${height}px`
            })
        })

        
        return
    }

    const itemImage = items.eq(0).querySelector('.js-rules-item-container')
    const bottomItem = itemImage.getBoundingClientRect().bottom
    const bottomImage = image.eq(0).getBoundingClientRect().bottom
    const delta = bottomItem - bottomImage
    if (delta === 0) return

    items.items.forEach(item => {
        const container = item.querySelector('.js-rules-item-container')
        container.style.bottom = `${delta}px`
    })
}

const judgesSecInit = () => {
    const section = $('js-judges')
    if (!section) return
    const next = $('js-judges-next')
    const prev = $('js-judges-prev')
    prev.attr('data-active', 'false')

    const swiper = new Swiper('.js-judges', {
        slidesPerView: 'auto',
        wrapperClass: 'js-judges-inner',
        slideClass: 'js-judges-item',
        slidePrevClass: 'js-judges-item-prev',
        slideNextClass: 'js-judges-item-next',
        slideActiveClass: 'js-judges-item-active',
        centeredSlides: true,
        spaceBetween: 10,
        slidesPerView: 1.2,
        breakpoints: {
            1024: {
                spaceBetween: 40,
                slidesPerView: 3,
            }
        }
    })

    swiper.on('slideChange', () => {
        const { progress } = swiper

        prev.attr('data-active', progress !== 0)
        next.attr('data-active', progress !== 1)
    })

    next.on('click', () => swiper.slideNext())
    prev.on('click', () => swiper.slidePrev())
}

const referencesSecInit = () => {
    if (!detectMobile()) return
    const swiper = new Swiper('.js-references', {
        slidesPerView: 'auto',
        wrapperClass: 'js-references-inner',
        slideClass: 'js-references-item',
        slidePrevClass: 'js-references-item-prev',
        slideNextClass: 'js-references-item-next',
        slideActiveClass: 'js-references-item-active',
        spaceBetween: 10,
        slidesPerView: 'auto',
    })
}

document.addEventListener('DOMContentLoaded', () => {
    timelineSliderInit()
    participantSecInit()
    rulesSecInit()
    judgesSecInit()
    referencesSecInit()

    // $('js-const').eq(0).innerHTML = devicePixelRatio
})