'use strict';
//タイルマップに関するクラス
class Tilemap { //画像表示のクラスなのでSpriteに近い構造

    //引数img: 画像ファイルまでのパス
    //引数size: タイル一つの大きさ(辺の長さ)。タイル一つは正方形
    constructor (img, size){
        //Imageのインスタンス作成
        this.img = new Image();
        this.img.src = img;
        this.x = this.y = 0;
        //数値によってタイルマップを移動させることができる（移動速度）
        this.vx = this.vy = 0;
        //引数sizeが指定されていない場合、this.sizeに32を代入
        this.size = size || 32;
        //二次元配列で数値を入力するとマップを作ることができる
        this.data = []; //?? なんでdataはy座標, x座標の順にしてるんだ??//
        //タイルマップに重ねるように置きたいタイルを追加できる
        this.tiles = [];
        //壁などの移動できないタイル指定
        this.obstacles = [0];
    }

    //タイルマップの上にタイルを重ねるように追加するメソッド
    //引数tile:追加したいタイル
    add (tile) {
        if (tile instanceof Tile) { //引数がTileの時
            //タイルのマップ座標を計算
            tile.mapX = tile.x - this.size;
            tile.mapY = tile.y - this.size;
            //もしタイルがタイルマップと同期していない時（!でfalseの意味）はマップ座標を計算し直す
            if (!tile.isSynchronize){
                tile.mapX = (tile.x - this.x) / this.size; 
                tile.mapY = (tile.y - this.y) / this.size; 
            }
            this.tiles.push(tile); //tiles配列の末尾にtileを追加
        }
        else console.error("Tilemapに追加できるのはTileだけです");
    }

    //指定された場所のタイルが移動不可かどうかを取得するメソッド
    //引数mapX: タイルマップ上のX座標
    //引数mapY: タイルマップ上のY座標
    hasObstacle (mapX, mapY) {
        //指定された場所のタイルが移動不可かどうか
        const _isObstacleTile = this.obstacles.some(obstacle => obstacle === this.data[mapY][mapX]);
        //some: コールバック関数を引数として、Arrayオブジェクトの各要素に対してコールバック関数を都度実行します。コールバック関数で定義した条件を、1つでも満たす要素が存在した場合にtrueを、全て満たしていない場合はfalseを返します。
        return _isObstacleTile; //移動不可かどうか返す
    }

    //Gameクラスのメインループからずっと呼び出されるやつ
    update(canvas) {
        this.render(canvas);
        this.onenterframe();
        
        //タイルマップを移動する
        this.x += this.vx;
        this.y += this.vy;

        //タイルの数だけ繰り返す
        for (let i =0; i<this.tiles.length; i++) {
            if(this.tiles[i].isSynchronize){ //タイルとタイルマップの位置を同期させる、がtrueの時のみに限定
                //タイルマップの位置の分、それぞれのタイルの位置をずらす
                this.tiles[i].shiftX = this.x;
                this.tiles[i].shiftY = this.y;
            }
            this.tiles[i].update(canvas); //それぞれのタイルのupdateメソッドを呼び出す

            //タイルのマップ座標を計算。追加時だけでなく常に
            this.tiles[i].mapX = this.tiles[i].x / this.size;
            this.tiles[i].mapY = this.tiles[i].y / this.size;
            //もしタイルがタイルマップと同期していない時（!でfalseの意味）はマップ座標を計算し直す
            if(!this.tiles[i].isSynchronize){
                this.tiles[i].mapX = (this.tiles[i].x - this.x) / this.size;
                this.tiles[i].mapY = (this.tiles[i].y - this.y) / this.size;
            }
        }
    }

    //上のupdateメソッドで書いた、画像表示用のずっと呼び出されるメソッド
    render(canvas){
        //マップの縦方向の数だけ繰り返す
        for (let y = 0; y<this.data.length; y++){
            const _tileY = this.size * y + this.y; //タイルの縦の位置
            //タイルが画面から縦にはみ出している時、この下をスキップして次から繰り返し
            if (_tileY < -1 * this.size || _tileY > canvas.height) continue;

            //マップの横方向の数だけ繰り返す
            for (let x = 0; x<this.data[y].length; x++){
                const _tileX = this.size * x + this.x; //タイルの横の位置
            //タイルが画面から横にはみ出している時、この下をスキップして次から繰り返し
                if (_tileX < -1 * this.size || _tileX > canvas.width) continue;

                const _frameX = this.data[y][x] % (this.img.width / this.size);
                const _frameY = ~~(this.data[y][x] / (this.img.width / this.size));

                const _ctx = canvas.getContext ("2d");
                _ctx.drawImage( //説明: https://www.pazru.net/html5/Canvas/100.html
                    this.img,
                    this.size * _frameX,
                    this.size * _frameY,
                    this.size,
                    this.size,
                    _tileX,
                    _tileY,
                    this.size,
                    this.size
                )
            }
        }
    }

    /**
	 * タッチした指の、相対的な位置（タッチしたオブジェクトの左上からの位置）を取得できるメソッド
	 *
	 * 引数
	 * fingerPositionX : 指の位置の座標
	 */
	getRelactiveFingerPosition( fingerPosition ) {
		//タッチしたものの、左上部分からの座標
		const _relactiveFingerPosition = {
			x: fingerPosition.x - this.x,
			y: fingerPosition.y - this.y
		};

		//数値が範囲内にあるかどうかを取得できる関数
		const inRange = ( num, min, max ) => {
			//数値が範囲内にあるかどうか
			const _inRange = ( min <= num && num <= max );
			//結果を返す
			return _inRange;
		}

		//タッチした位置がオブジェクトの上の場合、相対的な位置を返す
		if ( inRange( _relactiveFingerPosition.x, 0, this.size*this.data[0].length ) && inRange( _relactiveFingerPosition.y, 0, this.size*this.data.length ) ) return _relactiveFingerPosition;
		//オブジェクトから外れていれば、falseを返す
		return false;
	}

	/**
	 * タッチイベントを割り当てるためのメソッド
	 *
	 * 引数
	 * eventType : イベントのタイプ
	 * fingerPosition : 指の位置
	 */
	assignTouchevent( eventType, fingerPosition ) {
		//相対的な座標（タッチしたオブジェクトの、左上からの座標）を取得
		const _relactiveFingerPosition = this.getRelactiveFingerPosition( fingerPosition );

		//目的のオブジェクト以外の場所がタッチされた場合は、この下をスキップして、次から繰り返し
		if ( !_relactiveFingerPosition ) return;

		//イベントのタイプによって呼び出すメソッドを変える
		switch ( eventType ) {
			case 'touchstart' :
				//現在のシーンのオブジェクトの、touchstartメソッドを呼び出す
				this.ontouchstart( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
			case 'touchmove' :
				//現在のシーンのオブジェクトの、touchmoveメソッドを呼び出す
				this.ontouchmove( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
			case 'touchend' :
				//現在のシーンのオブジェクトの、touchendメソッドを呼び出す
				this.ontouchend( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
		}

		//タイルマップの上の、タイルの数だけ繰り返す
		for ( let i=0; i<this.tiles.length; i++ ) {
			//タイルマップの上のタイルの、タッチイベントを割り当てるためのメソッドを呼び出す
			this.tiles[i].assignTouchevent( eventType, fingerPosition );
		}
	}

    onenterframe(){}

    //タッチ・移動・離したときに呼び出される
    ontouchstart(){}
    ontouchmove(){}
    ontouchend(){}
}