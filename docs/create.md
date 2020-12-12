# Create

Creates a new status bar sprite for use in your games!

```sig
statusbars.create(0, 0, StatusBarKind.Health)
```

### ~hint

#### Status bars are Sprites!

Status bars are actually sprites; you can use most blocks on them that you can use with other sprites, with a few exceptions:

* Setting their image will not do anything to change the sprite.
* Status bars have enable / disable a few flags by default; for example, `ghost` and `relative to camera`
* All status bars have the SpriteKind `StatusBar`

### ~

## Parameters

* **width**: a [number](types/number) that is the width of the status bar.
* **height**: a [number](types/number) that is the height of the status bar.
* **kind**: the kind of status bar to create.

## Returns

* a status bar sprite with the width and height chosen, and the kind selected.

## Example

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```
