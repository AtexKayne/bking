import Swiper from 'swiper'
import { Pagination } from 'swiper/modules'
import { $, detectMobile } from './helper'

const timelineSecInit = () => {
    const timeline = $('js-timeline')
    if (!timeline) return

    const activeSlide = timeline.eq(0).$('[data-active="true"]')
    const index = [...activeSlide.eq(0).parentElement.children].indexOf(activeSlide.eq(0))

    const swiper = new Swiper(timeline.eq(0), {
        slidesPerView: 'auto',
        spaceBetween: 40,
        slideClass: 'js-timeline-item',
        wrapperClass: 'js-timeline-inner',
        slidePrevClass: 'js-timeline-item-prev',
        slideNextClass: 'js-timeline-item-next',
        slideActiveClass: 'js-timeline-item-active',
    })

    swiper.slideTo(index)
}

const priceSecInit = () => {
    const swiper = new Swiper('.js-price', {
        slidesPerView: 'auto',
        spaceBetween: 40,
        slideClass: 'js-price-item',
        wrapperClass: 'js-price-inner',
        slidePrevClass: 'js-price-item-prev',
        slideNextClass: 'js-price-item-next',
        slideActiveClass: 'js-price-item-active',
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

    swiper.on('transitionEnd', () => {
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
    items.items.forEach(item => {
        item.querySelector('.rules-sec__item-text').addEventListener('mouseenter', () => {
            $('.js-rules-item-container').rClass('active')
            const container = item.querySelector('.js-rules-item-container')
            container.classList.add('active')
        })
    })
    const itemImage = items.eq(0).querySelector('.js-rules-item-container')
    const bottomItem = itemImage.getBoundingClientRect().bottom
    const bottomImage = image.eq(0).getBoundingClientRect().bottom
    const delta = bottomItem - bottomImage
    if (delta === 0) return

    items.items.forEach(item => {
        const container = item.querySelector('.js-rules-item-container')
        container.style.bottom = `${delta}px`

    })
    window.locscroll.update()

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
                centeredSlides: false,
                spaceBetween: 40,
                slidesPerView: 3,
            }
        }
    })

    swiper.on('transitionEnd', () => {
        const { progress } = swiper

        prev.attr('data-active', progress !== 0)
        next.attr('data-active', progress !== 1)
    })

    next.on('click', () => swiper.slideNext())
    prev.on('click', () => swiper.slidePrev())
}

const workSecInit = () => {
    const section = $('js-works')
    if (!section) return
    const modal = $('js-modal[data-modal="work"]')
    const modalElem = modal.eq(0)
    const modalPrev = modalElem.$('js-work-modal-prev')
    const modalNext = modalElem.$('js-work-modal-next')
    const modalInfo = modalElem.$('js-work-modal-info')
    const modalSwiper = modalElem.$('js-work-modal-swiper')
    const modalSwiperItems = modalElem.$('js-work-modal-swiper-items')
    let modalSwiperClass

    section.each((el) => {
        const next = el.$('js-works-next')
        const prev = el.$('js-works-prev')
        const turn = el.$('js-works-turn')
        const info = el.$('js-work-info')
        const inner = el.$('js-work-inner')
        const items = el.$('js-works-swiper-item')
        let currentSide = 'main'

        prev.attr('data-active', 'false')

        const swiper = new Swiper(inner.eq(0), {
            slidesPerView: 'auto',
            wrapperClass: 'js-works-swiper-container',
            slideClass: 'js-works-swiper-item',
            slidePrevClass: 'js-works-item-prev',
            slideNextClass: 'js-works-item-next',
            slideActiveClass: 'js-works-item-active',
            spaceBetween: 12,
            breakpoints: {
                1024: {
                    spaceBetween: 40,
                    slidesPerView: 'auto',
                }
            }
        })

        if (items.length < 4) {
            prev.attr('data-is-hidden', true)
            next.attr('data-is-hidden', true)
        }

        swiper.on('transitionEnd', () => {
            const { progress } = swiper

            prev.attr('data-active', progress !== 0)
            next.attr('data-active', progress !== 1)
        })

        next.on('click', () => swiper.slideNext())
        prev.on('click', () => swiper.slidePrev())
        turn.on('click', () => {
            currentSide = currentSide === 'main' ? 'alter' : 'main'
            el.dataset.side = currentSide
        })

        const openModalHandler = ({ target }) => {
            const index = [...target.parentNode.children].indexOf(target)
            modalInfo.eq(0).innerHTML = info.eq(0).innerHTML
            modalSwiperItems.eq(0).innerHTML = ''
            if (modalSwiperClass) modalSwiperClass.destroy()
            items.each(item => {
                const src = item.$('img').attr('data-fullsize')
                const alt = item.$('img').attr('alt')
                const node = document.createElement('div')
                node.classList.add('js-work-modal-swiper-item', 'work-modal__swiper-item')
                node.innerHTML = `<img src="${src}" alt="${alt}" />`
                modalSwiperItems.eq(0).append(node)
            })

            modalSwiperClass = new Swiper(modalSwiper.eq(0), {
                slidesPerView: 1,
                wrapperClass: 'js-work-modal-swiper-items',
                slideClass: 'js-work-modal-swiper-item',
                slideActiveClass: 'active',
                centeredSlides: true,
                spaceBetween: 0,
                breakpoints: {
                    1024: { slidesPerView: 3 }
                },
                modules: [Pagination],
                pagination: {
                    dynamicBullets: true,
                    renderBullet: (index, className) => {
                        return '<span class="' + className + '">' + (index + 1) + '</span>';
                    },
                    el: '.js-work-modal-swiper-pagination',
                    clickable: true,
                },
            })

            const { progress } = modalSwiperClass
            modalPrev.attr('data-active', progress !== 0)
            modalNext.attr('data-active', progress !== 1)

            modalSwiperClass.on('transitionEnd', () => {
                const { progress } = modalSwiperClass

                modalPrev.attr('data-active', progress !== 0)
                modalNext.attr('data-active', progress !== 1)
            })

            modalSwiperClass.slideTo(index)

            setTimeout(() => modal.attr('data-open', true), 200)
        }

        items.on('click', openModalHandler)
    })

    modalNext.on('click', () => {
        if (!modalSwiperClass) return
        modalSwiperClass.slideNext()
    })

    modalPrev.on('click', () => {
        if (!modalSwiperClass) return
        modalSwiperClass.slidePrev()
    })
}

const modalsInit = () => {
    const modals = $('js-modal')
    if (!modals) return

    modals.each(modal => {
        document.body.append(modal)
        const close = modal.$('js-modal-close')
        close.on('click', () => {
            modal.dataset.open = 'false'
        })
    })
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
    workSecInit()
    judgesSecInit()
    priceSecInit()
    timelineSecInit()
    participantSecInit()
    setTimeout(rulesSecInit, 2000)
    referencesSecInit()
    modalsInit()
})
