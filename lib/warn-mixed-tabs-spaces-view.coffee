'use babel';

class WarnMixedTabsSpacesView extends HTMLElement
    init: ->
        @classList.add('warn-mixed-tabs-spaces', 'inline-block')
        @activate()

    activate: ->

    deactivate: ->

    setText: (text, error) ->
        if error
            @classList.add('highlight-error')
        else
            @classList.remove('highlight-error')
        @textContent = text


module.exports = document.registerElement('status-bar-mixed-tabs-spaces', prototype: WarnMixedTabsSpacesView.prototype, extends: 'div')
