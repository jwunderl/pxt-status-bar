# get Status Bar Attached To

Gets the status bar of the given kind that is attached to a sprite.

```sig
statusbars.getStatusBarAttachedTo(StatusBarKind.Health, null))
```

The status bar of the given kind is returned if it is attached to the sprite.

## Parameters

* **kind**: the kind of the status bar to get from the sprite.
* **sprite**: the sprite to get the status bar from.

## Returns

* the status bar of the requested **kind** is return if it is attached to the **sprite**. Otherwise, `undefined` is returned.

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
statusbar.attachToSprite(mySprite)
statusbars.getStatusBarAttachedTo(StatusBarKind.Health, mySprite).say(":)")
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```