## SC2 Scene Switcher plugin for XSplit
Usage: In XSplit, click Extensions -> Add Custom Extension, and add `http://reapergg.xyz/SC2Switcher`. Click Extensions again, then click on `http://reapergg.xyz/SC2Switcher` to open it. 

You can also host the switcher yourself by downloading this git repo and adding the `index.html` file as the extension. 

#### If you use a separate PC to stream: 
Enter the IP address of your SC2 computer in the SC2 PC IP box.
On your SC2 PC, open the Battle.net launcher, click Options, Game Settings, and under SC2, check 'Additional Command Line Arguments', and enter `-clientapi 6119` into the text box. 

You can check that SC2 is configured correctly by going to `http://[Your SC2 PC IP]:6119/ui` in your browser on the streaming PC. It should look something like:

`{"activeScreens":["ScreenBackgroundSC2/ScreenBackgroundSC2","ScreenReplay/ScreenReplay","ScreenNavigationSC2/ScreenNavigationSC2","ScreenForegroundSC2/ScreenForegroundSC2","ScreenBattlenet/ScreenBattlenet"]}`. 
