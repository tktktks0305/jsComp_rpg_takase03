'use strict';

class Game {
    constructor (width, height) { //1.コンストラクターを設定する
        //①canvas要素を作成してhtmlのbodyに追加・表示する
        this.canvas = document.createElement('canvas'); //コンストラクタ内のthisは、new演算子で作成された新規オブジェクトを参照します。
        document.body.appendChild(this.canvas);
        this.canvas.width   = width || 320; //コンストラクタ内には、this.○○でプロパティ名を定義することができます。
        this.canvas.height  = height || 320;

        //シーンを入れておくための配列
        this.scenes = [];
        //現在のシーンを入れておくためのもの
        this.currentScene;

        //音声を入れておくためのもの
		this.sounds = [];
		//画面がすでにタッチされたかどうか
		this._isAlreadyTouched = false;
		//設定が終わったかどうか
		this._hasFinishedSetting = false;
        
        //プリロード = ゲームのメイン部分が始まる前に動かしたいものたちを入れる配列
        this._preloadPromises = [];

        //現在のシーンを一時的に入れておくためのもの。シーン切り替えの判断に使う
        this._temporaryCurrentScene;

        //ゲームに使用するキーと、そのキーが押されているかどうかを入れるための連想配列
		//例 { up: false, down: false }
        this.input = {};

        //登録されたキーに割り当てられたプロパティ名と、キー名を、関連づけるための連想配列
		//例 { up: "ArrowUp", down: "ArrowDown" }
        this._keys = {};
    }

    //プリロードのためのメソッド
    preload () {
        //引数の素材を_assetsに追加
        const _assets = arguments;
        //素材の数だけ繰り返す
        for (let i = 0; i<_assets.length; i++) {
            //Promiseのインスタンス化。_preloadPromises[i]に
            this._preloadPromises[i] = new Promise ( (resolve, reject) => {
                //そのファイルの拡張子が以下に書いてある4つのどれかの場合
                if (_assets[i].match(/\.(jpg|jpeg|png|gif)$/i)){
                    let _img = new Image();
                    _img.src = _assets[i];

                    //画像が読み込み終わったら成功。resolve()
                    _img.addEventListener("load", () => {
                        resolve();
                    }, {passive: true, once: true});

                    //読めなければ失敗。reject()
                    _img.addEventListener ("error", () => {
                        reject (`${_assets[i]}は読み込めない`);
                    }, {passive: true, once: true});
                }
                //もしそのファイルの拡張子が、wav、wave、mp3、oggのどれかのとき
				else if ( _assets[i].match( /\.(wav|wave|mp3|ogg)$/i ) ) {
					//_soundに、あなたはサウンドですよ、と教える
					let _sound = new Sound();
					//_sound.srcに、引数で指定した音声ファイルを代入
					_sound.src = _assets[i];
					//this.soundsに、読み込んだ音声を入れておく
					this.sounds[ _assets[i] ] = _sound;
					//音声を再生する準備をする
					this.sounds[ _assets[i] ].load();

					//サウンドが読み込み終わったら、成功ということで、resolve()を呼び出す
					_sound.addEventListener( 'canplaythrough', () => {
						resolve();
					}, { passive: true, once: true } );

					//サウンドが読み込めなければ、エラーということで、reject()を呼び出す
					_sound.addEventListener( 'error', () => {
						reject( `「${_assets[i]}」は読み込めないよ！` );
					}, { passive: true, once: true } );
				}
                else {
                    reject(`${_assets[i]}の形式はプリロードに対応していない`);
                }
            });
        }
    }

    //プリロードなどの設定が終わった後に実行
    //引数callback: プリロードなどの設定が終わったあとに実行したいプログラム。今回はゲームのメイン部分
    main (callback) {
        //ゲームが始まる前に実行しておきたいもの（今回はプリロード）が、すべて成功したあとに、実行したかったゲームのメイン部分「callback()」を実行
		//失敗したときはコンソールにエラーを表示
		Promise.all( this._preloadPromises ).then( result => {
			callback();
		} ).catch( reject => {
			console.error( reject );
		} );
    }


    //2.startメソッドを呼び出すことでメインループを開始させる
    start () {
        //デフォルトのキーバインドを登録する（使いたいキーを登録する）
        this.keybind("up", "ArrowUp");
        this.keybind("down", "ArrowDown");
        this.keybind("right", "ArrowRight");
        this.keybind("left", "ArrowLeft");
        this.keybind("one", "1");
        this.keybind("two", "2");
        this.keybind("three", "3");

        //currentSceneに何も入っていない時はscene[0]を代入
        this.currentScene = this.currentScene || this.scenes[0];

        //ゲーム開始時とブラウザサイズ変更時に呼び出し、canvasサイズ変更。縦横比は変えない
        const _resizeEvent = () => {
            //ブラウザとcanvasの比率を計算（縦と横）。小さい方を_ratioに代入
            const _ratio = Math.min(innerWidth / this.canvas.width, innerHeight / this.canvas.height);
            //canvasのサイズをブラウザに合わせて変更
            this.canvas.style.width = this.canvas.width * _ratio + "px";
            this.canvas.style.height = this.canvas.height * _ratio + "px";
        }

        //ブラウザサイズが変更された時_resizeを呼び出す
        addEventListener ("resize", _resizeEvent, {passive: true});
        //（ゲームがstartしたときに）_resizeを呼び出す
        _resizeEvent();

        //①メインループを呼び出す
        this._mainLoop();

        // ユーザーの操作を待つためのメソッドを呼び出す
        this._waitUserManipulation();
    }

    // イベントリスナーをセットするためのメソッドを作成
    _setEventListener () {
        //何かキーが押された時と離された時に呼ばれる
        const _keyEvent = e => {
            // デフォルトのイベントを発生させない
            e.preventDefault();
            // _keysに登録された数だけ繰り返す
            for (let key in this._keys){
                //イベントのタイプによって呼び出すメソッドを変える
                switch (e.type) {
                    case "keydown":
                        //押されたキーが登録されたキーの中に存在する時、inputのそのキーをtrueにする
                        if (e.key === this._keys[key]) this.input[key] = true;
                        break;
                    case "keyup":
                        //押されたキーが登録されたキーの中に存在する時、inputのそのキーをfalseにする
                        if (e.key === this._keys[key]) this.input[key] = false;
                        break;
                }
            }
        }
        //何かキーが押された時
        addEventListener("keydown", _keyEvent, {passive:false});
        //キーが離された時
        addEventListener("keyup", _keyEvent, {passive:false});
    
        //画面がタッチされたり、指が動いたりしたときなどに呼ばれる
		//シーンや、スプライトなどのオブジェクトの左上端から見た、それぞれの指の位置を取得できるようになる
		const _touchEvent = e => {
			//デフォルトのイベントを発生させない
			e.preventDefault();
			//タッチされた場所などの情報を取得
			const _touches = e.changedTouches[0];
			//ターゲット（今回はcanvas）のサイズ、ブラウザで表示されている部分の左上から見てどこにあるか、などの情報を取得
			const _rect = _touches.target.getBoundingClientRect();
			//タッチされた場所を計算
			const _fingerPosition = {
				x: ( _touches.clientX - _rect.left ) / _rect.width * this.canvas.width,
				y: ( _touches.clientY - _rect.top ) / _rect.height * this.canvas.height
			};
			//イベントのタイプを_eventTypeに代入
			const _eventType = e.type;
			//タッチイベントを割り当てるためのメソッドを呼び出す
			this.currentScene.assignTouchevent( _eventType, _fingerPosition );
		} 

		//タッチされたとき
		this.canvas.addEventListener( 'touchstart', _touchEvent, { passive: false } );
		//指が動かされたとき
		this.canvas.addEventListener( 'touchmove', _touchEvent, { passive: false } );
		//指がはなされたとき
		this.canvas.addEventListener( 'touchend', _touchEvent, { passive: false } );
    }

    /**
	 * ユーザーからの操作を待つためのメソッド
	 */
	_waitUserManipulation() {
		//すべての音声を再生する
		const _playAllSounds = e => {
			//デフォルトのイベントを発生させない
			e.preventDefault();
			//画面にタッチされたかどうかの変数をtrueにする
			this._isAlreadyTouched = true;

			//音声を再生するためのプロミスを入れておく配列
			const _playPromises = [];

			//this.soundsの数だけ繰り返す
			//この繰り返しは、読み込まれた音声を、最初に全て同時に再生してしまおうというもの
			//こうすることで、スマホのブラウザなどの、音声を自動で流せないという制限を解決できる
			for ( let sound in this.sounds ) {
				//音声を再生する準備をする
				this.sounds[ sound ].load();
				//音声をミュートにする
				this.sounds[ sound ].muted = true;
				//音声を再生するメソッドはPromiseを返してくれるので、soundPromiseに追加
				_playPromises.push( this.sounds[ sound ].play() );
			}

			//Promiseが成功か失敗かのチェーン
			Promise.all( _playPromises ).then( () => {
				//成功した場合は全ての音をストップする
				for ( let sound in this.sounds ) {
					this.sounds[ sound ].stop();
				}
			} ).catch( err => {
				//失敗した場合はエラーを表示
				console.log( err );
			} );

			//音声を再生するときのエラーを防ぐために、すこしだけ待つ
			setTimeout( () => {
				//イベントリスナーをセットする
				this._setEventListener();
				this._hasFinishedSetting = true;
			}, 2000 );
		} //_playAllSounds() 終了

		//タッチされたときや、なにかキーが押されたとき、_playAllSoundsを呼び出す
		this.canvas.addEventListener( 'touchstart', _playAllSounds, { passive: false, once: true } );
		addEventListener( 'keydown', _playAllSounds, { passive: false, once: true } );
	} 

    //3.メインループを呼び出すメソッドを設定
    _mainLoop (){ //参考：https://teratail.com/questions/108541; canvas要素における"コンテキスト"はそのものズバリ「文脈」と考え, そういうものだと思って下さい. (設計をした人がそのように名付けただけなので, さほど深い理由があるとも思えません)
        //2Dコンテキスト(文脈＝2Dの手法)を呼んで黒で画面サイズ分を塗りつぶす
        const ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        //もし、ユーザーがまだ画面をタッチしていない（画面を操作していない）とき、スタートパネルを表示
		if ( !this._isAlreadyTouched ) this.startPanel();
		//設定がすでに終了しているとき
		else if ( this._hasFinishedSetting ) {
            //現在のシーンのupdateメソッドを呼び出す
            this.currentScene.update();

            //一時的に入れておいたシーンが現在のシーンではないとき（シーンが切り替わったとき）、現在のシーンのonchangescene()メソッドを呼び出す
            if (this._temporaryCurrentScene !== this.currentScene) this.currentScene.onchangescene();

            //現在のシーンの、ゲームに登場するすべてのlayerの数だけ繰り返す
            for (let i = 0; i<this.currentScene.layers.length; i++) {
                //現在のシーンの全てのlayerのスプライトなどのオブジェクトのupdateメソッドを呼び出す。それぞれobj, text, statusの数だけ繰り返す
                for (let j = 0; j<this.currentScene.layers[i].objs.length; j++) {
                    this.currentScene.layers[i].objs[j].update (this.canvas);
                }
                for (let j = 0; j<this.currentScene.layers[i].texts.length; j++) {
                    this.currentScene.layers[i].texts[j].update (this.canvas);
                }
                for (let j = 0; j<this.currentScene.layers[i].statuses.length; j++) {
                    this.currentScene.layers[i].statuses[j].update (this.canvas);
                }
            }
                
            //現在のシーンを覚えておいてもらう
            this._temporaryCurrentScene = this.currentScene;
        }
        //自分自身を呼び出してループ
        requestAnimationFrame(this._mainLoop.bind(this));
    }

    /**
	 * ゲームを開始して一番最初に表示される画面をつくるメソッド。ここでユーザーに操作してもらい、音声を出せるようにする
	 */
	startPanel() {
		//表示したいテキストを_textに代入
		const _text = '何かキーを押してね!'
		//表示したいテキストのフォントを_fontに代入
		const _font = 'DotGothic16, sans-serif';
		//フォントサイズは、ゲーム画面の横幅を20で割ったもの。（今回は表示したい文字が18文字なので、左右の余白も考え、20で割る）
		const _fontSize = this.canvas.width/20;
		//画家さん（コンテキスト）を呼ぶ
		const _ctx = this.canvas.getContext( '2d' );
		//テキストの横幅を取得
		const _textWidth = _ctx.measureText( _text ).width;
		//フォントの設定
		_ctx.font = `normal ${_fontSize}px ${_font}`;
		//ベースラインを文字の中央にする
		_ctx.textBaseline = 'middle';
		//テキストの色をグレーに設定
		_ctx.fillStyle = '#aaaaaa';
		//テキストを上下左右中央の位置に表示
		_ctx.fillText( _text, ( this.canvas.width - _textWidth )/2, this.canvas.height/2 );
	} //startPanel() 終了
    
    //ゲームにシーンを追加できるようになるaddメソッドを作成
    //引数はscene=追加したいシーン
    add (scene) {
        //引数がSceneの時、this.scenesの末尾にsceneを追加
        if (scene instanceof Scene) this.scenes.push(scene);
        //引数がSceneでなければコンソールにエラー表示
        else console.error ("Gameに追加できるのはSceneだけです");
    }

    // 使いたいキーを登録できるようになるkeybindメソッドを作成
    keybind (name, key) {
        //キーの名前とキーコードを関連づける
        this._keys[name] = key;
        //キーが押されているかどうかの状態を入れておく変数に、まずはfalseを代入しておく
        this.input[name] = false;
    }
}