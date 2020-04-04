// tests go here; this will not be compiled when this package is used as an extension.
const status = ui.statusbar.createSprite(50, 3, 0x7, 0x5, 50)
// TODO: file issue that test.ts isn't moved to be compiled last w/ same semantics as main.ts
ui.statusbar.setFlag(status, StatusBarFlag.SmoothTransition, false);
// ui.statusbar.setFlag(status, StatusBarFlag.LabelAtEnd, true);

ui.statusbar.setCurrent(status, 40);

ui.statusbar.setLabel(status, "HP", 0x7);

ui.statusbar.setBarBorder(status, 1, 0xb);
