'use strict';
//D-Padに関するクラス。方向ボタンをボタンとして機能するスプライトとして表示するためのクラス
class DPad extends Sprite { //画面表示するコントローラーもSpriteの一種
    //引数img: 画像ファイルまでのパス
    //引数size: D-Padの大きさ
    constructor (img, size) {
        super (img, size, size);
        this.size = size;
        this.arrow = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    //画面タッチされたときに呼ばれるメソッド
    //引数fingerPositionX: タッチされたX座標
    //引数fingerPositionY: タッチされたY座標
    ontouchstart (fingerPositionX, fingerPositionY) {
        this._applyToDPad (fingerPositionX, fingerPositionY);
    }

    //タッチした指が移動したときに呼ばれるメソッド
    //引数fingerPositionX: 触れている部分のX座標
    //引数fingerPositionY: 触れている部分のY座標
    ontouchmove (fingerPositionX, fingerPositionY) {
        this._applyToDPad (fingerPositionX, fingerPositionY);
    }

    //指が離れたときに呼ばれるメソッド
    //引数fingerPositionX: 指が離れた部分のX座標
    //引数fingerPositionY: 指が離れた部分のY座標
    ontouchend (fingerPositionX, fingerPositionY) {
        this.frame = 0; //画像を切り替える
        this.arrow = { //ボタンを初期化
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    //D-Padに反映させる
    //引数fingerPositionX: 指が触れている部分のX座標
    //引数fingerPositionY: 指が触れている部分のY座標
    _applyToDPad (fingerPositionX, fingerPositionY) {
        this.frame = 1; //画像を切り替える
        this.arrow = { //ボタンを初期化
            up: false,
            down: false,
            left: false,
            right: false
        };
        //以下、XY座標によってどのボタンが押されているか判定。
        //上ボタンが押されたとき、arrow.upをtrueにし、D-Padの角度を0度にする
        if (fingerPositionX > fingerPositionY && fingerPositionX < this.size - fingerPositionY) {
            this.arrow.up = true;
            this.rotate = 0;
        }
        //下ボタンが押されたとき、arrow.downをtrueにし、D-Padの角度を180度にする
        else if (fingerPositionX > this.size - fingerPositionY && fingerPositionX < fingerPositionY) {
            this.arrow.down = true;
            this.rotate = 180;
        }
        //上ボタンが押されたとき、arrow.leftをtrueにし、D-Padの角度を270度にする
        else if (fingerPositionY > fingerPositionX && fingerPositionY < this.size - fingerPositionX) {
            this.arrow.left = true;
            this.rotate = 270;
        }
        //上ボタンが押されたとき、arrow.rightをtrueにし、D-Padの角度を90度にする
        else if (fingerPositionY > this.size - fingerPositionX && fingerPositionY < fingerPositionX) {
            this.arrow.right = true;
            this.rotate = 90;
        }
    }
}