# attach To Sprite

Attach a status bar to a sprite.

```sig
statusbars.create(0,0,StatusBarKind.Health).attachToSprite(null)
```

A status bar is attached to a sprite you specify.
The status bar will follow the sprite around the screen instead of being set in a fixed position.

When a status bar is attached to a sprite, you can use the `status bar attached to mySprite`
and `sprite that statusbar is attached to` blocks to get the sprites / status bars that are attached to each other.

## Parameters

* **toFollow**: the sprite to attach to.
* **padding**: an optional [number](types/number) of pixels to pad around the status bar.
* **offset**: an optional [number](types/number) of pixels away from the sprite to place the status bar.

## Example

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
let mySprite = sprites.create(img`
    . . . . . . . . . . b 5 b . . . 
    . . . . . . . . . b 5 b . . . . 
    . . . . . . b b b b b b . . . . 
    . . . . . b b 5 5 5 5 5 b . . . 
    . . . . b b 5 d 1 f 5 d 4 c . . 
    . . . . b 5 5 1 f f d d 4 4 4 b 
    . . . . b 5 5 d f b 4 4 4 4 b . 
    . . . b d 5 5 5 5 4 4 4 4 b . . 
    . b b d d d 5 5 5 5 5 5 5 b . . 
    b d d d b b b 5 5 5 5 5 5 5 b . 
    c d d b 5 5 d c 5 5 5 5 5 5 b . 
    c b b d 5 d c d 5 5 5 5 5 5 b . 
    c b 5 5 b c d d 5 5 5 5 5 5 b . 
    b b c c c d d d 5 5 5 5 5 d b . 
    . . . . c c d d d 5 5 5 b b . . 
    . . . . . . c c c c c b b . . . 
    `, SpriteKind.Player)
controller.moveSprite(mySprite)
statusbar.attachToSprite(mySprite)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```