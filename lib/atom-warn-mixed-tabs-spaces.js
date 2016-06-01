'use babel';

import AtomWarnMixedTabsSpacesView from './atom-warn-mixed-tabs-spaces-view';
import { CompositeDisposable } from 'atom';

export default {

  atomWarnMixedTabsSpacesView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomWarnMixedTabsSpacesView = new AtomWarnMixedTabsSpacesView(state.atomWarnMixedTabsSpacesViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomWarnMixedTabsSpacesView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-warn-mixed-tabs-spaces:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomWarnMixedTabsSpacesView.destroy();
  },

  serialize() {
    return {
      atomWarnMixedTabsSpacesViewState: this.atomWarnMixedTabsSpacesView.serialize()
    };
  },

  toggle() {
    console.log('AtomWarnMixedTabsSpaces was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
