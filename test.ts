const status = ui.statusbar.createSprite(50, 3, 0x7, 0x5, 50)
// ui.statusbar.setFlag(status, StatusBarFlag.SmoothTransition, false);
// ui.statusbar.setFlag(status, StatusBarFlag.LabelAtEnd, true);

ui.statusbar.setCurrent(status, 40);

ui.statusbar.setLabel(status, "HP", 0x7);

ui.statusbar.setBarBorder(status, 1, 0xb);
status.top = 5;
status.left = 5;


const player = sprites.create(img`
    . . . . . . f f f f . . . . . .
    . . . . f f f 2 2 f f f . . . .
    . . . f f f 2 2 2 2 f f f . . .
    . . f f f e e e e e e f f f . .
    . . f f e 2 2 2 2 2 2 e e f . .
    . . f e 2 f f f f f f 2 e f . .
    . . f f f f e e e e f f f f . .
    . f f e f b f 4 4 f b f e f f .
    . f e e 4 1 f d d f 1 4 e e f .
    . . f e e d d d d d d e e f . .
    . . . f e e 4 4 4 4 e e f . . .
    . . e 4 f 2 2 2 2 2 2 f 4 e . .
    . . 4 d f 2 2 2 2 2 2 f d 4 . .
    . . 4 4 f 4 4 5 5 4 4 f 4 4 . .
    . . . . . f f f f f f . . . . .
    . . . . . f f . . f f . . . . .
`)

const sb2 = ui.statusbar.createSprite(20, 4, 0x7, 0x2, 40);
ui.statusbar.setBarBorder(sb2, 1, 0xb);
ui.statusbar.attachStatusBarToSprite(sb2, player, 1)
controller.moveSprite(player)

let curr = 40;
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    curr -= 5;
    ui.statusbar.setCurrent(sb2, curr)
})