'use strict';
// レイヤーに関してのクラス
class Layer {
    constructor () {
        this.objs 		= []; 
		this.texts 		= [];	//テキストは出したり消したりするので別配列に
		this.statuses 	= [];	//ステータスも出したり消したりするので別配列に
    }

    //layerにオブジェクトを追加するときに呼び出されるメソッド
    //引数はobj=追加したいオブジェクト
    add (obj) {
        this.objs.push(obj);
    }
	removeObj () { //battleLayer用
		this.objs.length = 0;
	}
	//テキストはremoveTextで配列を空にして消せるようにする（main.jsに記載）
	addText (text){
		this.texts.push(text);
	}
	removeText () {
		this.texts.length = 0;
	}
	//ステータスはremoveTextで配列を空にして消せるようにする（main.jsに記載）
	addStatus (status){
		this.statuses.push(status);
	}
	removeStatus () {
		this.statuses.length = 0;
	}

    //Gameクラスのメインループからずっと呼び出され続ける
    //引数はcanvas
    update (canvas) {
        //スプライトを動かしたり、何かのきっかけでイベントを発生させたりするために使うメソッドを呼び出す
        this.onenterframe();
    }

    /**
	 * タッチイベントを割り当てるためのメソッド
	 *
	 * 引数
	 * eventType : イベントのタイプ
	 * fingerPosition : 指の位置
	 */
	assignTouchevent( eventType, fingerPosition ) {
		//イベントのタイプによって呼び出すメソッドを変える
		switch ( eventType ) {
			case 'touchstart' :
				//現在のlayerのtouchstartメソッドを呼び出す
				this.ontouchstart( fingerPosition.x, fingerPosition.y );
				break;
			case 'touchmove' :
				//現在のlayerのtouchmoveメソッドを呼び出す
				this.ontouchmove( fingerPosition.x, fingerPosition.y );
				break;
			case 'touchend' :
				//現在のlayerのtouchendメソッドを呼び出す
				this.ontouchend( fingerPosition.x, fingerPosition.y );
				break;
		}

		//layerにあるオブジェクトの数だけ繰り返す
		for ( let i=0; i<this.objs.length; i++ ) {
			//layerにあるオブジェクトの、タッチイベントを割り当てるためのメソッドを呼び出す
			this.objs[i].assignTouchevent( eventType, fingerPosition );
		}
		//（追加）layerにあるテキストの数だけ繰り返す
		for ( let i=0; i<this.texts.length; i++ ) {
			//layerにあるオブジェクトの、タッチイベントを割り当てるためのメソッドを呼び出す
			this.texts[i].assignTouchevent( eventType, fingerPosition );
		}
		//（追加）layerにあるステータスの数だけ繰り返す
		for ( let i=0; i<this.statuses.length; i++ ) {
			//layerにあるオブジェクトの、タッチイベントを割り当てるためのメソッドを呼び出す
			this.statuses[i].assignTouchevent( eventType, fingerPosition );
		}
	}

    //常に呼び出され、スプライトの移動やイベントの発生などに使うメソッド。空なのはオーバーライド（上書き）して使うため。
    onenterframe(){}

    //タッチ・移動・離したときに呼び出される
    ontouchstart(){}
    ontouchmove(){}
    ontouchend(){}

	//layerが切り替わったときに呼び出される
	onchangelayer(){}

}