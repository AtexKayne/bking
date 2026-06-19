import { $, createObserver, detectMobile, randomIntFromInterval } from './helper'

const linesInit = () => {
    if (detectMobile()) return
    const lines = $('js-lines')
    if (!lines) return
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
    const items = section.find('.nominations-sec__item')
    if (!items || !items.length) return
    let currentActiveItem = null

    const syncItemVideos = (activeItem, shouldRestart = false) => {
        items.forEach(item => {
            const video = item.querySelector('.nominations-sec__image video')
            if (!video) return

            const isActive = item === activeItem
            video.muted = true
            video.playsInline = true
            video.loop = true

            if (!isActive) {
                video.pause()
                video.currentTime = 0
                return
            }

            if (shouldRestart) {
                video.pause()
                video.currentTime = 0
            }

            const playPromise = video.play()
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => null)
            }
        })
    }

    const setActiveItem = (activeItem) => {
        const hasChanged = currentActiveItem !== activeItem
        if (!hasChanged) return

        currentActiveItem = activeItem

        items.forEach(item => {
            item.setAttribute('data-active', String(item === activeItem))
        })
        syncItemVideos(activeItem, true)
    }

    const updateActiveByViewport = () => {
        let activeItem = null
        let maxVisibleRatio = 0

        items.forEach(item => {
            const rect = item.getBoundingClientRect()
            const visibleTop = Math.max(rect.top, 0)
            const visibleBottom = Math.min(rect.bottom, window.innerHeight)
            const visibleHeight = Math.max(0, visibleBottom - visibleTop)
            const itemHeight = Math.max(rect.height, 1)
            const visibleRatio = visibleHeight / itemHeight

            if (visibleRatio > maxVisibleRatio) {
                maxVisibleRatio = visibleRatio
                activeItem = item
            }
        })

        if (activeItem) {
            setActiveItem(activeItem)
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveByViewport()
            }
        })
    }, {
        threshold: [0, 0.25, 0.5, 0.75, 1],
    })

    items.forEach(item => observer.observe(item))
    window.addEventListener('scroll', updateActiveByViewport, { passive: true })
    window.addEventListener('resize', updateActiveByViewport)
    updateActiveByViewport()
}

const mainSectionInit = () => {
    const section = $('js-main3')
    if (!section) return

    const root = section.eq(0)
    const images = Array.from(root.querySelectorAll('.main-sec3__image'))
    const texts = Array.from(root.querySelectorAll('.main-sec3__text'))
    const nextButton = root.querySelector('.main-sec3__next')
    const currentSection = root.closest('.section')
    const nextSection = currentSection ? currentSection.nextElementSibling : null
    if (!images.length || !texts.length || !nextButton) return

    let activeIndex = texts.findIndex(item => item.getAttribute('data-active') === 'true')
    let imageTransitionTimer = null
    let slideInterval = null
    if (activeIndex < 0) activeIndex = 0

    const updateState = (previousIndex = null) => {
        texts.forEach((text, index) => {
            let slot = 'hidden'

            if (index === activeIndex) {
                slot = 'active'
            } else {
                if (index === activeIndex + 1) {
                    slot = 'next'
                } else if (index === activeIndex + 2) {
                    slot = 'last'
                } else if (index === activeIndex - 1) {
                    slot = 'prev'
                } else if (index === activeIndex - 2) {
                    slot = 'prev-last'
                }
            }

            text.setAttribute('data-slot', slot)
            text.setAttribute('data-active', String(slot === 'active'))
        })

        if (previousIndex === null || previousIndex === activeIndex) {
            images.forEach((image, index) => {
                image.setAttribute('data-active', String(index === activeIndex))
                image.removeAttribute('data-transition')
            })
            return
        }

        const prevImage = images[previousIndex]
        const nextImage = images[activeIndex]

        images.forEach((image, index) => {
            if (index !== previousIndex && index !== activeIndex) {
                image.setAttribute('data-active', 'false')
                image.removeAttribute('data-transition')
            }
        })

        if (prevImage) {
            prevImage.setAttribute('data-active', 'true')
            prevImage.setAttribute('data-transition', 'out')
        }
        if (nextImage) {
            nextImage.setAttribute('data-active', 'true')
            nextImage.setAttribute('data-transition', 'in')
        }

        clearTimeout(imageTransitionTimer)
        imageTransitionTimer = setTimeout(() => {
            if (prevImage) {
                prevImage.setAttribute('data-active', 'false')
                prevImage.removeAttribute('data-transition')
            }
            if (nextImage) {
                nextImage.setAttribute('data-active', 'true')
                nextImage.removeAttribute('data-transition')
            }
        }, 650)
    }

    const nextHandler = () => {
        const prevIndex = activeIndex
        activeIndex = activeIndex === texts.length - 1 ? 0 : activeIndex + 1
        updateState(prevIndex)
    }

    const startAutoRotate = () => {
        if (slideInterval) return
        slideInterval = setInterval(nextHandler, 4000)
    }

    const scrollToNextSection = () => {
        if (!nextSection) return

        if (detectMobile()) {
            const scrollContainer = document.querySelector('.scroll')
            if (scrollContainer && typeof scrollContainer.scrollTo === 'function') {
                scrollContainer.scrollTo({
                    top: nextSection.offsetTop,
                    behavior: 'smooth',
                })
                return
            }
        }

        if (typeof locscroll !== 'undefined' && locscroll && typeof locscroll.scrollTo === 'function') {
            locscroll.scrollTo(nextSection, { duration: 800 })
            return
        }

        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    updateState()
    nextButton.addEventListener('click', scrollToNextSection)

    const loader = document.querySelector('.js-loader')
    if (!loader || loader.getAttribute('data-hidden') === 'true' || window.isLoaderHide) {
        startAutoRotate()
        return
    }

    const observer = new MutationObserver(() => {
        if (loader.getAttribute('data-hidden') === 'true') {
            observer.disconnect()
            startAutoRotate()
        }
    })

    observer.observe(loader, {
        attributes: true,
        attributeFilter: ['data-hidden'],
    })
}

document.addEventListener('DOMContentLoaded', () => {
    linesInit()
    mainSectionInit()
    nominationsInit()
})