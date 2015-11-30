
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
  'iphone_3x': 'public/assets/icon/apple-touch-icon-180x180.png',
  // ... more screen sizes and platforms ...
});

App.launchScreens({
	'iphone': 'public/assets/launch/Default-portrait~iphone.png',
	'iphone_2x': 'public/assets/launch/Default-portrait@2x~iphone4.png',
	'iphone5': 'public/assets/launch/Default-portrait@2x~iphone5.jpg',
	'iphone6': 'public/assets/launch/Default-portrait@2x~iphone6.png',
	'iphone6p_portrait': 'public/assets/launch/Default-portrait@3x~iphone6+.png',
//	'iphone6p_landscape': 'public/assets/launch/',
//	'ipad_portrait': 'public/assets/launch/Default-Portrait~ipad.png',
//	'ipad_portrait_2x': 'public/assets/launch/Default-Portrait@2x~ipad.png',
//	'ipad_landscape': 'public/assets/launch/Default-Landscape~ipad.png',
//	'ipad_landscape_2x': 'public/assets/launch/Default-Landscape@2x~ipad.png'
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0x282828ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');