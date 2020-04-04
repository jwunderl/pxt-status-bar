enum StatusBarFlag {
    None = 0,
    SmoothTransition = 1 << 0, // if set, update bar over time; otherwise update bar immediately
    LabelAtEnd = 1 << 1, // if set, and label exists, draw label at bottom or right side
}

namespace SpriteKind {
    export const StatusBar = SpriteKind.create();
}

namespace ui.statusbar {
    const STATUS_BAR_DATA_FIELD = "STATUS_BAR_DATA_FIELD";
    
    class StatusBar {
        borderWidth: number;
        // if not set, use offColor
        borderColor: number;
        labelColor: number;

        protected flags: number;
        protected _label: string;
        protected _image: Image;

        protected font: image.Font;
        // todo: 'rounded border' / border-radius option? just 1px or 2px

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
            this._label = undefined;
            this.labelColor = 0x1;
            this.font = image.font5;

            this._current = _max;
            this.target = _max;
            this.rebuildImage();
        }

        get label() {
            return this._label;
        }
        
        set label(v: string) {
            this._label = v;
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
            const isDifferent = this.target != v;
            this.target = v;
            if (!(this.flags & StatusBarFlag.SmoothTransition)) {
                this._current = v;
            }
            if (isDifferent)
                this.updateDisplay();
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

            if (this.label) {
                const labelWidth = this.font.charWidth * this.label.length;
                if (this.isVerticalBar()) {
                    width = Math.max(width, labelWidth);
                    height += this.font.charHeight + 1;
                } else {
                    width += labelWidth;
                    height = Math.max(height, this.font.charHeight);
                }
            }

            if (!this.image || width !== this.image.width || height !== this.image.height) {
                const newImg = image.create(width, height);
                this._image = newImg;
            }

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
            const borderColor = util.isNullOrUndefined(this.borderColor) ?
                    this.offColor : this.borderColor;
    
            let barLeft = 0;
            let barTop = 0;
            
            if (this.label) {
                const textWidth = this.font.charWidth * this.label.length;
                const textHeight = this.font.charHeight;
                let textX = 0;
                let textY = 0;
                if (barIsVertical) {
                    barTop += textHeight + 1;
                    if (this.barWidth > textWidth) {
                        textX = (this.barWidth - textWidth) >> 1;
                    } else if (this.barWidth < textWidth) {
                        barLeft = (textWidth - this.barWidth) >> 1;
                    }
                } else {
                    barLeft += textWidth;
                    if (this.barHeight > textHeight) {
                        textY = (this.barHeight - textHeight) >> 1;
                    } else if (this.barHeight < textHeight) {
                        barTop = (textHeight - this.barHeight) >> 1;
                    }
                }

                this.image.print(
                    this.label,
                    textX,
                    textY,
                    this.labelColor,
                    this.font
                );
            }

            this.image.fillRect(
                barLeft,
                barTop,
                this.barWidth,
                this.barHeight,
                borderColor
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
                    barIsVertical ? fillWidth : Math.round(fillWidth * percent),
                    barIsVertical ? Math.round(fillHeight * percent) : fillHeight,
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
        const output = sprites.create(sb.image, SpriteKind.StatusBar);
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

    export function setLabel(sprite: Sprite, label: string, color?: number) {
        const sb = getStatusBar(sprite);
        if (sb) {
            if (color)
                sb.labelColor = color;
            sb.label = label;
            sprite.setImage(sb.image);
        }
    }

    export function setBarBorder(sprite: Sprite, borderWidth: number, color: number) {
        const sb = getStatusBar(sprite);
        if (sb) {
            sb.borderColor = color;
            sb.borderWidth = borderWidth;
            sb.updateDisplay();
        }
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