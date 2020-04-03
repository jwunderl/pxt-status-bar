enum StatusBarFlag {
    None = 0,
    SmoothTransition = 1 << 0,
}

namespace ui.statusbar {
    const STATUS_BAR_DATA_FIELD = "STATUS_BAR_DATA_FIELD";
    
    class StatusBar {
        borderWidth: number;
        // if not set, use offColor
        borderColor: number;
        headerColor: number;

        protected flags: number;
        protected _header: string;
        protected _image: Image;

        protected font: image.Font;

        // hold state
        protected _current: number;
        protected target: number;

        constructor(
            protected barWidth: number,
            protected barHeight: number,
            public onColor: number,
            public offColor: number,
            protected _max: number
        ) {
            this.borderWidth = 0;
            this.borderColor = undefined;
            this.flags = StatusBarFlag.SmoothTransition;
            this._header = undefined;
            this.headerColor = 0x1;
            this.font = image.font5;

            this._current = _max;
            this.target = _max;
            this.rebuildImage();
            this.updateDisplay();
        }

        get header() {
            return this._header;
        }
        
        set header(v: string) {
            this._header = v;
            this.rebuildImage();
        }

        get max() {
            return this._max;
        }

        set max(v: number) {
            this._max = v;
            this.updateDisplay();
        }

        get current() {
            return this.target;
        }

        set current(v: number) {
            this.target = v;
            if (this.flags ^ StatusBarFlag.SmoothTransition) {
                this._current = v;
            }
        }

        setFlag(flag: StatusBarFlag, on: boolean) {
            if (on)
                this.flags |= flag
            else
                this.flags = ~(~this.flags | flag);
        }

        get image() {
            return this._image;
        }

        set image(v: Image) {
            // ignore, readonly ref outside this class
        }

        protected isVerticalBar() {
            return this.barHeight > this.barWidth;
        }

        protected isSmoothTransition() {
            return this.flags & StatusBarFlag.SmoothTransition;
        }

        protected rebuildImage() {
            let width = this.barWidth;
            let height = this.barHeight;

            if (this.header) {
                if (this.isVerticalBar()) {
                    height += this.font.charHeight;
                } else {
                    width += this.font.charWidth * this.header.length;
                }
            }

            const newImg = image.create(width, height);
            this.image = newImg;
            console.log(`dbg: ${width} ${height} ${this.image} ${newImg}`)
            this.updateDisplay();
        }

        updateDisplay() {
            const percent = Math.constrain(
                this._current / this._max,
                0,
                1.0
            );
            const fillWidth = this.barWidth - 2 * this.borderWidth;
            const fillHeight = this.barHeight - 2 * this.borderWidth;
            const barIsVertical = this.isVerticalBar();
            
            let barLeft = 0;
            let barTop = 0;
            
            if (this.header) {
                this.image.print(this.header, 0, 0, this.headerColor, this.font);
                if (barIsVertical) {
                    barTop += this.font.charHeight;
                } else {
                    barLeft += this.font.charWidth * this.header.length;
                }
            }

            this.image.fillRect(
                barLeft,
                barTop,
                this.barWidth,
                this.barHeight,
                util.isNullOrUndefined(this.borderColor) ?
                    this.offColor : this.borderColor
            );

            this.image.fillRect(
                barLeft + this.borderWidth,
                barTop + this.borderWidth,
                fillWidth,
                fillHeight,
                this.offColor
            );

            if (percent > 0) {
                this.image.fillRect(
                    barLeft + this.borderWidth,
                    barTop + this.borderWidth,
                    barIsVertical ? fillWidth: (fillWidth * percent) | 0,
                    barIsVertical ? (fillHeight * percent) | 0 : fillHeight,
                    this.onColor
                );
            }
        }
    }

    export function createSprite(
        width: number,
        height: number,
        onColor: number,
        offColor: number,
        max: number
    ) {
        const sb = new StatusBar(width, height, onColor, offColor, max);
        const output = sprites.create(sb.image, -1);
        output.setFlag(SpriteFlag.RelativeToCamera, true);
        output.setFlag(SpriteFlag.Ghost, true);
        output.data[STATUS_BAR_DATA_FIELD] = sb;
        return output;
    }

    export function setFlag(sprite: Sprite, flag: StatusBarFlag, on: boolean) {
        const sb = getStatusBar(sprite);
        if (sb) sb.setFlag(flag, on);
    }

    export function setMax(sprite: Sprite, max: number) {
        const sb = getStatusBar(sprite);
        if (sb) sb.max = max;
    }

    export function setCurrent(sprite: Sprite, current: number) {
        const sb = getStatusBar(sprite);
        if (sb) sb.current = current;
    }

    export function setHeader(sprite: Sprite, header: string) {
        const sb = getStatusBar(sprite);
        if (sb) sb.header = header;
    }

    function getStatusBar(sprite: Sprite) {
        return sprite.data[STATUS_BAR_DATA_FIELD] as StatusBar;
    }

    namespace util {
        export function isNullOrUndefined(v: any): v is null | undefined {
            return v === undefined || v === null;
        }
    }
}