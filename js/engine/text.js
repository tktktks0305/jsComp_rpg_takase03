'use strict';
//テキストに関するクラス
class Text {
    //引数text: 表示する文字列
    constructor (text1, text2, text3) {
        this.text1 = text1; //1行目
        this.text2 = text2; //2行目
        this.text3 = text3; //3行目
        //以下、フォント等の指定（初期値）
        this.font = 'DotGothic16, sans-serif';
        this.x = 15;
		this.y = 205;
        this.vx = this.vy = 0;
        this.baseline = "top";
        this.size = 18;
        this.color = "#ffffff";
        this.weight = "normal";
        this._width = 0; //_を頭に入れる: 外から変更してはいけないということを示す慣例
        this._height = 0;
        this._isCenter = false; //テキストを左右中央の位置にするかどうか
        this._isMiddle = false; //テキストを上下中央の位置にするかどうか
    }
    
    /**
	 * 呼び出すと、テキストを左右・上下中央の位置に配置できるメソッドたち
	 */
    center () {
        this._isCenter = true;
        return this; //?? thisを返すことでメソッドをチェーンにすることができる ??//
    }
    middle () {
        this.baseline = "middle"
        this._isMiddle = true;
        return this;
    }

    update(canvas) { //キャンバスに表示。spriteと基本的に一緒
        const _ctx = canvas.getContext ("2d");

        //テキストのフォント等を設定
        _ctx.font           = `${this.weight} ${this.size}px ${this.font}`;
        _ctx.fillStyle      = this.color;
        _ctx.textBaseline   = this.baseline;

        //テキストの幅と高さを計算
        this._width     = _ctx.measureText(this.text1).width;
        this._height    = Math.abs(_ctx.measureText(this.text1).actualBoundingBoxAscent) + Math.abs(_ctx.measureText(this.text).actualBoundingBoxDescent);

        this.render(canvas, _ctx);  //画像などを画面に表示するためのメソッドを呼び出す
        this.onenterframe();        //テキストを動かしたりするために使うメソッドを呼び出す

        //テキストを中央に配置したいときの座標計算
        if (this._isCenter) this.x = (canvas.width - this._width) / 2;
        if (this._isMiddle) this.y = canvas.height / 2;

        //テキストを移動する
        this.x += this.vx;
        this.y += this.vy;
    }

    render (canvas, ctx) { 
        //画面外にテキストがある時表示しない
        if (this.x < -1 * this.width || this.x > canvas.width) return;
        if (this.y < -1 * this.height || this.y > canvas.height) return;
        //テキスト表示
		ctx.fillStyle = "rgba(10, 10, 10, 0.5)";
		ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
		ctx.fillRect (10, 200, 300, 100);
		ctx.fillStyle = "white";
        ctx.fillText (this.text1, this.x, this.y);
        if (this.text2) ctx.fillText (this.text2, this.x, this.y+25);
        if (this.text3) ctx.fillText (this.text3, this.x, this.y+50);
    }

    /**
	 * タッチした指の、相対的な位置（タッチしたオブジェクトの左上からの位置）を取得できるメソッド
	 *
	 * 引数
	 * fingerPositionX : 指の位置の座標
	 */
	getRelactiveFingerPosition( fingerPosition ) {
		//タッチしたテキストの、左上部分からの座標。テキストのbaselineによって位置を調節する
		let _relactiveFingerPosition = {
			x: fingerPosition.x - this.x,
			y: fingerPosition.y - this.y + this._height
		};
		if ( this.baseline === 'top' || this.baseline === 'hanging' ) {
			_relactiveFingerPosition = {
				x: fingerPosition.x - this.x,
				y: fingerPosition.y - this.y
			};
		}
		if ( this.baseline === 'middle' ) {
			_relactiveFingerPosition = {
				x: fingerPosition.x - this.x,
				y: fingerPosition.y - this.y + this._height/2
			};
		}

		//数値が範囲内にあるかどうかを取得できる関数
		const inRange = ( num, min, max ) => {
			//数値が範囲内にあるかどうか
			const _inRange = ( min <= num && num <= max );
			//結果を返す
			return _inRange;
		}

		//タッチした位置がオブジェクトの上の場合、相対的な位置を返す
		if ( inRange( _relactiveFingerPosition.x, 0, this._width ) && inRange( _relactiveFingerPosition.y, 0, this._height ) ) return _relactiveFingerPosition;
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

		//イベントのタイプによって呼び出すメソッドを変える
		switch ( eventType ) {
			case 'touchstart' :
				//指の場所がテキストの上にあるとき、ontouchstartメソッドを呼び出す
				if ( _relactiveFingerPosition ) this.ontouchstart( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
			case 'touchmove' :
				//指の場所がテキストの上にあるとき、ontouchmoveメソッドを呼び出す
				if ( _relactiveFingerPosition ) this.ontouchmove( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
			case 'touchend' :
				//ontouchendメソッドを呼び出す
				this.ontouchend( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
		}
	}

    onenterframe(){}

    //タッチ・移動・離したときに呼び出される
    ontouchstart(){}
    ontouchmove(){}
    ontouchend(){}
}