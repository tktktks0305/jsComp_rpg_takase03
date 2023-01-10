'use strict';
//タイルに関するクラス
class Tile extends Sprite { //Spriteクラスを継承
    constructor(img, size) {
        super (img, size, size); //親クラスSpriteのconstructorを呼び出す
        this.size = size || 32;
        this.mapX = this.mapY = 0; //マップ座標（タイルマップの左上から何番目のタイルの位置にあるのか）に0を代入
        this.isSynchronize = true; //タイルマップと同期して動くかどうか
    }

    //タイル同士が重なっているかどうかを取得するメソッド
    //引数tile: 重なっているかを判定したいタイル
    isOverlapped (tile) {
        if (tile instanceof Tile) {
            //タイル同士が重なっているか。結果をreturnで返す
            const _isOverlapped = (this.mapX === tile.mapX && this.mapY === tile.mapY);
            return _isOverlapped;
        }
        else console.error ("Tilemapに追加できるのはTileだけです")
    }
}