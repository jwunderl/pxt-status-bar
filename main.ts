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

        protected flags: StatusBarFlag;
        protected _header: string;
        protected _image: Image;

        protected font: image.Font;

        constructor(
            public barWidth: number,
            public barHeight: number,
            public onColor: number,
            public offColor: number,
        ) {
            this.image = image.create(barWidth, barHeight);
            this.borderWidth = 0;
            this.borderColor = undefined;
            this.flags = StatusBarFlag.SmoothTransition;
            this._header = undefined;
            this.headerColor = 0x1;
            this.font = image.font5;
        }


        get header() {
            return this._header;
        }
        
        set header(v: string) {
            this._header = v;
            this.rebuildImage();
        }

        setFlag(flag: StatusBarFlag, on: boolean) {
            if (on) this.flags |= flag
            else this.flags = ~(~this.flags | flag);

            if (this.isVerticalBar()) {
                this.rebuildImage();
            }
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

            this.image = image.create(width, height);
        }

        // percent between 0 and 1.0
        update(percent: number) {
            percent = Math.constrain(percent, 0, 1.0);
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
        offColor: number
    ) {
        const sb = new StatusBar(width, height, onColor, offColor);
        const output = sprites.create(sb.image, -1);
        output.setFlag(SpriteFlag.RelativeToCamera, true);
        output.setFlag(SpriteFlag.Ghost, true);
        output.data[STATUS_BAR_DATA_FIELD] = sb;
    }

    function getStatusBar(sprite: Sprite) {
        return sprite.data[STATUS_BAR_DATA_FIELD];
    }

    namespace util {
        export function isNullOrUndefined(v: any): v is null | undefined {
            return v === undefined || v === null;
        }
    }
}