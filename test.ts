const status = statusbars.createSprite(50, 3, 50)
statusbars.setColor(status, 0x7, 0x5)
// statusbars.setFlag(status, StatusBarFlag.InvertFillDirection, true);
// statusbars.setFlag(status, StatusBarFlag.SmoothTransition, false);
// statusbars.setFlag(status, StatusBarFlag.LabelAtEnd, true);

statusbars.setValue(status, 40);

statusbars.setLabel(status, "HP", 0x7);

statusbars.setBarBorder(status, 1, 0xb);
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

const sb2 = statusbars.createSprite(4, 20, 40);
statusbars.setBarBorder(sb2, 1, 0xb);
statusbars.attachStatusBarToSprite(sb2, player, -4, - (image.font5.charHeight / 2))
controller.moveSprite(player)
statusbars.setLabel(sb2, "HP", 0x7);

let curr = 40;
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    curr -= 5;
    statusbars.setValue(sb2, curr)
})

scene.setBackgroundColor(0x1)