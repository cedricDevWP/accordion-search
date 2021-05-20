export class DOMAnimations{
    static slideUp( element, duration = 500 ){
        element.style.height = element.offsetHeight + 'px'
        element.offsetHeight  // redraw
        element.style.overflow = 'hidden'
        element.style.height = 0
        element.style.paddingTop = 0
        element.style.paddingBottom = 0
        element.style.marginTop = 0
        element.style.marginBottom = 0
        element.style.transitionProperty = 'height, margin, padding'
        element.style.transitionDuration = duration + 'ms'

        setTimeout(() => {
            element.classList.add( 'as-d-none' )
            element.style.removeProperty('height')
            element.style.removeProperty('padding-top')
            element.style.removeProperty('padding-bottom')
            element.style.removeProperty('margin-top')
            element.style.removeProperty('margin-bottom')
            element.style.removeProperty('overflow')
            element.style.removeProperty('transition-duration')
            element.style.removeProperty('transition-property')
        }, duration);

    }

    static slideDown( element, duration = 500 ){
        element.classList.remove( 'as-d-none' )
        element.style.overflow = 'hidden'
        element.style.paddingTop = 0
        element.style.paddingBottom = 0
        element.style.marginTop = 0
        element.style.marginBottom = 0
        let height = element.offsetHeight
        element.style.height = 0
        element.offsetHeight // redraw
        element.style.transitionProperty = 'height, margin, padding'
        element.style.transitionDuration = duration + 'ms'
        element.style.height = height + 'px'
        element.style.removeProperty('padding-top')
        element.style.removeProperty('padding-bottom')
        element.style.removeProperty('margin-top')
        element.style.removeProperty('margin-bottom')

        setTimeout(() => {
            element.style.removeProperty('height')
            element.style.removeProperty('overflow')
            element.style.removeProperty('transition-duration')
            element.style.removeProperty('transition-property')
        }, duration);

    }
}