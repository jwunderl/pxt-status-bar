# position Direction

Sets the direction in which a status bar is placed.

```sig
statusbars.create(20, 4, StatusBarKind.Health).positionDirection(CollisionDirection.Left)
```

If the status bar is attached to a sprite, it will be placed on the given side of the sprite.

If the status bar is not attached to a sprite, it will be placed on the side of the screen the matches the direction chosen.

## Parameters

* **dir**: the direction for the position of the status bar with it's attached sprite.

The exact positioning can be adjusted using ``||statusbars:set offset||`` and ``||statusbars:padding||``.

## Example

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.positionDirection(CollisionDirection.Left)
statusbar.setBarSize(5, 20)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```
