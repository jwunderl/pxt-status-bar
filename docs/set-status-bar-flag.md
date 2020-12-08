# Set status bar flag

Enables or disables flags that change how a status bar behaves.

* smooth transition
    * If set, update bar over time; otherwise update bar immediately.
    * This is similar to the draining effect that is commonly seen in fighting games.
* label at end 
    * If set, and label exists, draw label at bottom or right side (instead of top / left side).
* constrain value
    * If set, constrain values stored in status bar between 0 and max.
    * This is set `on` by default.
* invert fill direction
    * If set, swap the direction in which a status bar is filled. 
* no auto destroy
    * if set, this status bar will persist after the sprite it is attached to is destroyed.
* ignore events
    * if set, disables `on zero` and `on status changed` events when changing values on this status bar.

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.setStatusBarFlag(StatusBarFlag.LabelAtEnd, true)
statusbar.setLabel("HP")
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```