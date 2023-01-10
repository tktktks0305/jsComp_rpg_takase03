'use strict';
//キャラクタータイルに関するクラス
class CharacterTile extends Tile {
    /**
	 * 引数
	 * img : 画像ファイルまでのパス
	 * size : タイルの一辺の長さ
	 *
	 * ※注意
	 * directionやanimationを指定すると自動的にスプライト画像も変更されるが、画像自体を対応したものにする必要がある
	 * CharacterTileクラスで、frameを使うことはできない
	 */
    constructor (img, size) {
        super (img, size); //親クラスのコンストラクタを呼び出す
        this.direction = 0; //キャラクターの向き。0正面 1左 2右 3後ろ
        this.animation = 1; //スプライトのアニメーション。1が通常。0-2を切り替えることで歩いているアニメーションを作る
    }

    //画像などを画面に表示するためのメソッド
    //引数canvas
    render (canvas){
        //画面外にスプライトがある時は表示しないようにする
        if (this.x + this.shiftX < -1 * this.size || this.x + this.shiftX > canvas.width) return;
        if (this.y + this.shiftY < -1 * this.size || this.y + this.shiftY > canvas.height) return;

        const _ctx = canvas.getContext("2d");

        //スプライトを回転させる時の中心位置　を変更するためのcanvasの原点の移動量
        const _translateX = this.x + this.width/2 + this.shiftX;
        const _translateY = this.y + this.height/2 + this.shiftY;
        //描画状態を保存
        _ctx.save();
        //canvasの原点の移動
        _ctx.translate (_translateX, _translateY);
        //canvasを回転
        _ctx.rotate (this.rotate * Math.PI / 180);
        //移動したcanvasの原点を戻す
        _ctx.translate (-1 * _translateX, -1 * _translateY);

        _ctx.drawImage(
            this.img,
            this.size * this.animation,
            this.size * this.direction,
            this.size,
            this.size,
            this.x + this.shiftX,
            this.y + this.shiftY,
            this.size,
            this.size
        )

        _ctx.restore();
    }
}