
'use babel';

WarnMixedTabsSpacesView = require '././warn-mixed-tabs-spaces-view'

{CompositeDisposable} = require 'atom'

module.exports = warnMixedTabsSpaces =
    config:
        activateOnStart:
            type: 'string'
            default: 'Remember last setting'
            enum: ['Remember last setting', 'Show on start', 'Don\'t show on start']

    active: false

    activate: (state) ->
        @state = state

        @warnMixedTabsSpacesView = new WarnMixedTabsSpacesView()
        @warnMixedTabsSpacesView.init()

        # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        @subscriptions = new CompositeDisposable

        # Register command that toggles this view
        @subscriptions.add atom.commands.add 'atom-workspace',
            'warn-mixed-tabs-spaces:toggle': => @toggle()

        atom.workspace.onDidStopChangingActivePaneItem (editor) =>
            @update()
        atom.workspace.observeTextEditors (editor) =>
            editor_disposables = new CompositeDisposable
            # Editor events
            editor_disposables.add editor.onDidChangeGrammar =>
                @update()
            editor_disposables.add editor.onDidStopChanging =>
                @update()
            editor_disposables.add editor.onDidDestroy ->
                editor_disposables.dispose()

    update: () ->
        mixed = @checkMixedTabsAndSpaces()
        if mixed
            @warnMixedTabsSpacesView.setText("MIXED TABS AND SPACES", true)
        else
            @warnMixedTabsSpacesView.setText("NO MIX", false)

    checkMixedTabsAndSpaces: () ->
        foundSpaces = false
        foundTabs = false
        lines = atom.workspace.getActiveTextEditor()?.getBuffer()?.getLines()
        if lines
            for line, lineno in lines
                if line
                    c = line.charCodeAt(0)
                    if c == 0x20
                        foundSpaces = true
                    else if c == 0x09
                        foundTabs = true
        foundSpaces and foundTabs

    deactivate: ->
        @subscriptions.dispose()
        @warnMixedTabsSpacesView.destroy()
        @statusBarTile?.destroy()

    serialize: ->
        activateOnStart: atom.config.get('warn-mixed-tabs-spaces.activateOnStart'),
        active: @active

    toggle: (active = undefined) ->
        active = ! !!@active if !active?
        if active
            @warnMixedTabsSpacesView.activate()
            @statusBarTile = @statusBar?.addRightTile item: @warnMixedTabsSpacesView, priority: -1
        else
            @statusBarTile?.destroy()
            @warnMixedTabsSpacesView?.deactivate()

        @active = active

    consumeStatusBar: (statusBar) ->
        @statusBar = statusBar
        # auto activate as soon as status bar activates based on configuration
        @activateOnStart(@state)

    activateOnStart: (state) ->
        switch state.activateOnStart
            when 'Remember last setting' then @toggle state.active
            when 'Show on start' then @toggle true
            else @toggle false
