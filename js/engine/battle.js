'use strict';
//戦闘用クラス
class Battle {
    constructor () {
        this.battlePhase = 0;
    }

    update(canvas) { //キャンバスに表示。spriteと基本的に一緒
        const _ctx = canvas.getContext ("2d");

        //テキストのフォント等を設定
        _ctx.font           = `${this.weight} ${this.size}px ${this.font}`;
        _ctx.fillStyle      = this.color;
        _ctx.textBaseline   = this.baseline;

        //テキストの幅と高さを計算
        this._width     = _ctx.measureText(this.text).width;
        this._height    = Math.abs(_ctx.measureText(this.text).actualBoundingBoxAscent) + Math.abs(_ctx.measureText(this.text).actualBoundingBoxDescent);

        this.render(canvas, _ctx);  //画像などを画面に表示するためのメソッドを呼び出す
        this.onenterframe();        //テキストを動かしたりするために使うメソッドを呼び出す

    }

    render (canvas, ctx) { //?? _ctxとctxの違い ??//
        //画面外にテキストがある時表示しない
        if (this.x < -1 * this.width || this.x > canvas.width) return;
        if (this.y < -1 * this.height || this.y > canvas.height) return;
        //テキスト表示
        if (this.battlePhase == 0) {
            ctx.fillStyle = "rgba(10, 10, 10, 1.0)";
            ctx.fillRect (0, 0, canvas.width, canvas.height);
        }
        else if (this.battlePhase == 1) {
            ctx.fillStyle = "rgba(10, 10, 10, 1.0)";
            ctx.fillRect (0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
            ctx.fillRect (10, 200, 300, 100);
            ctx.fillStyle = "white";
            ctx.fillText (this.text, this.x, this.y);
        }
    }

    onenterframe(){}

}