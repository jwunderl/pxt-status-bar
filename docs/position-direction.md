# Position direction

Sets the direction in which a status bar is placed.

If the status bar is attached to a sprite, it will be placed on the given side of the sprite.

If the status bar is not attached to a sprite, it will be placed on that side of the screen.

The exact positioning can be adjusted using `set offset { } padding { }`.

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.positionDirection(CollisionDirection.Left)
statusbar.setBarSize(5, 20)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```
