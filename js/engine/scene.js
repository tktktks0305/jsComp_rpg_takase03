'use strict';
// シーンに関してのクラス
class Scene {
    constructor () {
		this.layers 		= [];
    }

	//sceneにlayerを追加できるようになるaddメソッドを作成
    //引数はlayer=追加したいlayer
    add (layer) {
        //引数がSceneの時、this.layersの末尾にlayerを追加
        if (layer instanceof Layer) this.layers.push(layer);
        //引数がSceneでなければコンソールにエラー表示
        else console.error ("sceneに追加できるのはlayerだけです");
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
				//現在のシーンのtouchstartメソッドを呼び出す
				this.ontouchstart( fingerPosition.x, fingerPosition.y );
				break;
			case 'touchmove' :
				//現在のシーンのtouchmoveメソッドを呼び出す
				this.ontouchmove( fingerPosition.x, fingerPosition.y );
				break;
			case 'touchend' :
				//現在のシーンのtouchendメソッドを呼び出す
				this.ontouchend( fingerPosition.x, fingerPosition.y );
				break;
		}

		//シーンにあるlayerの数だけ繰り返す
		for ( let i=0; i<this.layers.length; i++ ) {
			//シーンにあるオブジェクトの、タッチイベントを割り当てるためのメソッドを呼び出す
			this.layers[i].assignTouchevent( eventType, fingerPosition );
		}
	}

    //常に呼び出され、スプライトの移動やイベントの発生などに使うメソッド。空なのはオーバーライド（上書き）して使うため。
    onenterframe(){}

    //タッチ・移動・離したときに呼び出される
    ontouchstart(){}
    ontouchmove(){}
    ontouchend(){}

	//シーンが切り替わったときに呼び出される
	onchangescene(){}

}