// tests go here; this will not be compiled when this package is used as an extension.
const status = ui.statusbar.createSprite(50, 4, 0x2, 0x5, 50)
ui.statusbar.setFlag(status, StatusBarFlag.SmoothTransition, false)

ui.statusbar.setCurrent(status, 40);