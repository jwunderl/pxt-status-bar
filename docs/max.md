# max

Get or set the current maximum value of the status bar.

## Get

```block
let statusbar: StatusBarSprite = null
let max = statusbar.max
```

```typescript-ignore
let max = statusbar.max
```

## Set

```block
let statusbar: StatusBarSprite = null
statusbar.max = 50
```

```typescript-ignore
statusbar.max = 50
```

## Property

* **max**: a [number](types/number) that is the maximum value for the status bar.

By default, the status bar value is kept between `0` and the **max** value. This can be changed using the `constrain value` flag. The default max value is `100`.

## Example

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.max = 50
console.log(statusbar.max)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```