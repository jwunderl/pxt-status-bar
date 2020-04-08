namespace myTiles {
    //% blockIdentity=images._tile
    export const tile0 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
}
function test1() {
    const status = statusbars.create(50, 3, 50, StatusBarKind.Health)
    status.setColor(0x7, 0x5)
    // statusbars.setFlag(status, StatusBarFlag.InvertFillDirection, true);
    // statusbars.setFlag(status, StatusBarFlag.SmoothTransition, false);
    // statusbars.setFlag(status, StatusBarFlag.LabelAtEnd, true);

    status.value = 40;
    status.setLabel("HP", 0x7)

    status.setBarBorder(1, 0xb);
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

    const sb2 = statusbars.create(4, 20, 40, StatusBarKind.Health);
    sb2.setBarBorder(1, 0xb);
    sb2.attachToSprite(player, -4, - (image.font5.charHeight / 2))
    controller.moveSprite(player)
    sb2.setLabel("HP", 0x7);

    let curr = 40;
    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        curr -= 5;
        sb2.value = curr;
    })

    scene.setBackgroundColor(0x1)
}

function testIcon() {
    let health: StatusBarSprite = null
    let enemySb: StatusBarSprite = null
    tiles.setTilemap(tiles.createTilemap(
                hex`0a0008000101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101`,
                img`
    . . . . . . . . . . 
    . . . . . . . . . . 
    . . . . . . . . . . 
    . . . . . . . . . . 
    . . . . . . . . . . 
    . . . . . . . . . . 
    . . . . . . . . . . 
    . . . . . . . . . . 
    `,
                [myTiles.tile0,sprites.castle.tileGrass3],
                TileScale.Sixteen
            ))
    let player_character = sprites.create(img`
    . . . . . . . f f . . . . . . . . . . . 
    . . . . f f f f 2 f f . . . . . . . . . 
    . . f f e e e e f 2 f f . . . . . . . . 
    . f f e e e e e f 2 2 f f . . . . . . . 
    . f e e e e f f e e e e f . . . . . . . 
    . f f f f f e e 2 2 2 2 e f . . . . . . 
    f f f e 2 2 2 f f f f e 2 f . . . . . . 
    f f f f f f f f e e e f f f . . . . . . 
    f e f e 4 4 e b f 4 4 e e f . . . . . . 
    . f e e 4 d 4 b f d d e f . . . . . . . 
    . . f e e e 4 d d d e e . c . . . . . . 
    . . . f 2 2 2 2 e e d d e c c c c c c c 
    . . . f 4 4 4 e 4 4 d d e c d d d d d . 
    . . . f f f f f e e e e . c c c c c . . 
    . . f f f f f f f f . . . c . . . . . . 
    . . f f f . . f f . . . . . . . . . . . 
    `, SpriteKind.Player)
    player_character.x += -15
    let enemy = sprites.create(img`
    . . . . f f f f f . . . . . . 
    . . f f 1 1 1 1 b f f . . . . 
    . f b 1 1 1 1 1 1 1 b f . . . 
    . f 1 1 1 1 1 1 1 1 1 f . . . 
    f d 1 1 1 1 1 1 1 f f f f . . 
    f d 1 1 1 d d 1 c 1 1 1 b f . 
    f b 1 1 f c d f 1 b 1 b f f . 
    f 1 1 1 1 1 b f b f b f f . . 
    f 1 b 1 b d f c f f f f . . . 
    f b f b f c f c c c f . . . . 
    f f f f f f f f f f . . . . . 
    . . . f f f f f f . . . . . . 
    . . . f f f f f f . . . . . . 
    . . . f f f f f f f . . f . . 
    . . . . f f f f f f f f f . . 
    . . . . . f f f f f f f . . . 
    `, SpriteKind.Enemy)
    enemySb = statusbars.create(
    20,
    4,
    50,
    StatusBarKind.EnemyHealth
    )
    enemySb.setBarBorder(1, 12)
    enemySb.attachToSprite(enemy, 3)
    enemySb.value = 11
    health = statusbars.create(
    5,
    40,
    100,
    StatusBarKind.Health
    )
    let magic = statusbars.create(
    40,
    5,
    100,
    StatusBarKind.Magic
    )
    health.setBarBorder(1, 12)
    magic.setBarBorder(1, 11)
    health.x = player_character.left - 7
    health.y += -3
    health.value = 75
    magic.bottom = health.bottom
    magic.left = health.right + 1
    magic.value = 30

    statusbars.onZero(StatusBarKind.EnemyHealth, function (status) {
        status.spriteAttachedTo().destroy()
    })
    controller.B.onEvent(ControllerButtonEvent.Pressed, () => {
        health.value += -10
    })
    controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
        enemySb.value += Math.randomRange(-10, 5)
    })
    statusbars.onZero(StatusBarKind.Health, (status) => {
        game.over(false)
    })
}

testIcon()