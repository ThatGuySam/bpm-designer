
//Access rules
App.accessRule('*://p.typekit.net/*');//Typekit Fonts

// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.bpm-designer.samcarlton',
  name: 'BPM designer',
  description: 'Tool for designing lightshows based on bpm',
  author: 'Sam Carlton',
  email: 'contact@samcarlton.com',
  website: 'samcarlton.com'
});

// Set up resources such as icons and launch screens.
App.icons({
  'iphone': 'public/assets/icon/apple-touch-icon-60x60.png',
  'iphone_2x': 'public/assets/icon/apple-touch-icon-120x120.png',
  // ... more screen sizes and platforms ...
});

/*
App.launchScreens({
  'iphone': 'splash/Default~iphone.png',
  'iphone_2x': 'splash/Default@2x~iphone.png',
  // ... more screen sizes and platforms ...
});
*/

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0x282828ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');