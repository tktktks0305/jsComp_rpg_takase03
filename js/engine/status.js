'use strict';
//キャラステータスを画面に表示するクラス
class Status {
    //引数status1, 2, 3: 順に1行目、2行目、3行目
	//!!2人目、3人目追加するときは表示位置のx座標を調整するために別途プロパティ設定する!!//
    constructor (status1, status2, status3) {
        this.status1 = `HP: ${status1}`; //this.textに表示する文字列を代入
        this.status2 = `MP: ${status2}`; //this.textに表示する文字列を代入
        this.status3 = `Lv: ${status3}`; //this.textに表示する文字列を代入
        //以下、フォント等の指定（初期値）
        this.font = 'DotGothic16, sans-serif';
        this.x = 15;
		this.y = 15;
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
    
    update(canvas) { //キャンバスに表示。spriteと基本的に一緒
        const _ctx = canvas.getContext ("2d");

        //テキストのフォント等を設定
        _ctx.font           = `${this.weight} ${this.size}px ${this.font}`;
        _ctx.fillStyle      = this.color;
        _ctx.textBaseline   = this.baseline;

        //テキストの幅と高さを計算
        this._width     = _ctx.measureText(this.status1).width;
        this._height    = Math.abs(_ctx.measureText(this.status1).actualBoundingBoxAscent) + Math.abs(_ctx.measureText(this.status).actualBoundingBoxDescent);

        this.render(canvas, _ctx);  //画像などを画面に表示するためのメソッドを呼び出す
        this.onenterframe();        //テキストを動かしたりするために使うメソッドを呼び出す

        //テキストを中央に配置したいときの座標計算
        if (this._isCenter) this.x = (canvas.width - this._width) / 2;
        if (this._isMiddle) this.y = canvas.height / 2;

        //テキストを移動する
        this.x += this.vx;
        this.y += this.vy;
    }

    render (canvas, ctx) { //?? _ctxとctxの違い ??//
        //画面外にテキストがある時表示しない
        if (this.x < -1 * this.width || this.x > canvas.width) return;
        if (this.y < -1 * this.height || this.y > canvas.height) return;
        //テキスト表示
		ctx.fillStyle = "rgba(10, 10, 10, 0.5)";
		ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
		ctx.fillRect (5, 10, 75, 75); 
		ctx.fillStyle = "white";
        ctx.fillText (this.status1, this.x, this.y+5);
        ctx.fillText (this.status2, this.x, this.y+25);
        ctx.fillText (this.status3, this.x, this.y+45);
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