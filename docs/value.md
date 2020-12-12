# value

Gets or sets the current value of the status bar.

## Get

```block
let statusbar: StatusBarSprite = null
let value = statusbar.value
```

```typescript-ignore
let value = statusbar.value
```

## Set

```block
let statusbar: StatusBarSprite = null
statusbar.value = 50
```

```typescript-ignore
statusbar.value = 50
```

## Property

* **value**: a [number](types/number) to set as the current value for the status bar. The default value is `100`.

By default, this is constrained between `0` and the **max** value; this can be changed using the `constrain value` flag.

## Example

```blocks
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.value = 50
console.log(statusbar.value)
```

```package
pxt-status-bar=github:jwunderl/pxt-status-bar
```