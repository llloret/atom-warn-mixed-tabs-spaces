'use babel';

import AtomWarnMixedTabsSpaces from '../lib/atom-warn-mixed-tabs-spaces';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('AtomWarnMixedTabsSpaces', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('atom-warn-mixed-tabs-spaces');
  });

  describe('when the atom-warn-mixed-tabs-spaces:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.atom-warn-mixed-tabs-spaces')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-warn-mixed-tabs-spaces:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.atom-warn-mixed-tabs-spaces')).toExist();

        let atomWarnMixedTabsSpacesElement = workspaceElement.querySelector('.atom-warn-mixed-tabs-spaces');
        expect(atomWarnMixedTabsSpacesElement).toExist();

        let atomWarnMixedTabsSpacesPanel = atom.workspace.panelForItem(atomWarnMixedTabsSpacesElement);
        expect(atomWarnMixedTabsSpacesPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'atom-warn-mixed-tabs-spaces:toggle');
        expect(atomWarnMixedTabsSpacesPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.atom-warn-mixed-tabs-spaces')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-warn-mixed-tabs-spaces:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let atomWarnMixedTabsSpacesElement = workspaceElement.querySelector('.atom-warn-mixed-tabs-spaces');
        expect(atomWarnMixedTabsSpacesElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'atom-warn-mixed-tabs-spaces:toggle');
        expect(atomWarnMixedTabsSpacesElement).not.toBeVisible();
      });
    });
  });
});
