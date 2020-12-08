# Create

Creates a new status bar sprite for use in your games!

### ~hint

Status bars are actually sprites; you can use most blocks on them that you can use with other sprites, with a few exceptions:

* Setting their image will not do anything to change the sprite.
* Status bars have enable / disable a few flags by default; for example, `ghost` and `relative to camera`

### ~

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```