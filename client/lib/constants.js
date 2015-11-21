// Define App Constants

if (Meteor.App) {
  throw new Meteor.Error('Meteor.App already defined? see client/lib/constants.js');
}

Meteor.App = {
  NAME: 'BPM Designer',
  DESCRIPTION: 'A tool for quickly calculating BPM Multiples and assisting in timing for lighting design.'
};
