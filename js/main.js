'use strict';

//1.ブラウザがページを読み込むのを待つ
addEventListener ("load", () => {
    //①Gameクラスをインスタンス化
    const game = new Game(); //サイズ変更したければwidth, heightsの順に引数入れる
    //プリロード
    game.preload( 'img/hero.png', 'img/heroine.png', 'img/cat.png', 'img/tent.png', 'img/village.png','img/mansion.png','img/treasure.png','img/sword.png','img/noSword.png','img/boss.png', 'img/tile.png', 'img/dpad.png','img/01_cheese.png', 'img/02_memo.png', 'img/03_LINE.png', 'img/04_firebase.png', 'img/05_js.png', 'sound/bgm.mp3', 'sound/start.mp3', 'sound/clear.mp3', 'sound/01_title.mp3', 'sound/02_opening.mp3', 'sound/03_field.ogg', 'sound/04_battle.ogg', 'sound/05_boss.ogg', 'sound/06_requiem.mp3', 'sound/07_ending.mp3' );

    game.keybind ("space", " "); //spaceキーを登録 //?? なぜ第二引数は半角スペース ??//

    //②ゲームをスタート。準備ができた後に実行する
    game.main( () => {
        //タイトルシーン
        const titleScene = () => {
            const scene         = new Scene();
            const titleLayer    = new Layer(); 
            const titleText1    = new Text ("MIL QUEST IV"); 
                titleText1.size = 36;
                titleText1.center().middle();
            const titleText2     = new Text ("Press Space Key"); 
                titleText2.center();

            scene.add(titleLayer);
            titleLayer.addText(titleText1);
            titleLayer.addText(titleText2);


            //シーンが切り替わったときに、一度だけ呼ばれる
			scene.onchangescene = () => {
                //clear.mp3をストップ
                game.sounds[ 'sound/06_requiem.mp3' ].stop();
                game.sounds[ 'sound/07_ending.mp3' ].stop();
                //start.mp3を再生
                game.sounds[ 'sound/01_title.mp3' ].start();
			}

            //シーンがタッチされたとき
            scene.ontouchstart = () => {
                game.currentScene = openingScene(); //mainSceneに切り替える
            }

            scene.onenterframe = () => { //常に呼び出されるonenterframeでspaceキーが押されるのを待つ
                if (game.input.space) {
                    game.currentScene = openingScene();
                    game.input.space = false;
                }
            }

            return scene;
        }

        const openingScene = () => {
            const scene         = new Scene();
            const openingLayer  = new Layer(); 
            const openingText1  = new Text ("年末に実家に帰省したMIL生。", "久々に休めると思ったのも束の間、", "気づくと、この秋苦しめられた課題に");
                openingText1.x      = 10;
                openingText1.y      = 15;
            const openingText2  = new Text ("周りを囲まれていた...。","彼は無事、この世界から抜け出し",  "原宿に帰って来れるのだろうか...。"); 
                openingText2.x      = 10;
                openingText2.y      = 90;
            const openingText3  = new Text ("※1 どこかにいるラスボスを倒せばクリアです", "※2 移動は矢印キー、決定はスペースキーです", "※3 HPが0になるとゲームオーバーです");
                openingText3.x      = 10;
                openingText3.y      = 190;
                openingText3.size   = 14;
            const openingText4  = new Text ("※4 仲間がいるように見えますが戦闘は1人です", "※5 ゲームバランスのおかしさはご容赦を"); 
                openingText4.x      = 10;
                openingText4.y      = 265;
                openingText4.size   = 14;

            scene.add(openingLayer);
            openingLayer.addText(openingText1);
            openingLayer.addText(openingText2);
            openingLayer.addText(openingText3);
            openingLayer.addText(openingText4);

			scene.onchangescene = () => {
                game.sounds[ 'sound/01_title.mp3' ].stop();
                game.sounds[ 'sound/02_opening.mp3' ].start();
			}

            scene.ontouchstart = () => {
                game.currentScene = mainScene(); //mainSceneに切り替える
            }

            scene.onenterframe = () => { //常に呼び出されるonenterframeでspaceキーが押されるのを待つ
                if (game.input.space) {
                    game.currentScene = mainScene();
                    game.input.space = false;
                }
            }
            return scene;
        }

        //メインシーン
        const mainScene = () => {
            //タイルのサイズ
            const TILE_SIZE = 32;
            // 歩く速さ
            const WALKING_SPEED = 2;

            //Sceneクラスをインスタンス化→fieldLayerインスタンス化→sceneに追加
            const scene = new Scene ();
            const fieldLayer = new Layer ();
            scene.add(fieldLayer);
            //battleLayerを準備しておく
            const battleLayer = new Layer();
            scene.add(battleLayer);

            //Tilemapクラスをインスタンス化
            const tilemap = new Tilemap ("img/tile.png");
            //tilemap.dataに表示したいマップ（map.jsで宣言）情報を渡す
            tilemap.data = map;
            //マップ全体の位置をずらす
            tilemap.x = TILE_SIZE*-7 - TILE_SIZE/2;
            tilemap.y = TILE_SIZE*-10 - TILE_SIZE/2;
            //移動できないタイルを指定する
            tilemap.obstacles = [96, 104, 112, 120, 125];
            //マップをfieldLayerに登録する
            fieldLayer.add(tilemap);

            //Tileクラスをインスタンス化
            //村
            const village = new Tile("img/village.png", 64);
            village.x = TILE_SIZE*12;
            village.y = TILE_SIZE*15;
            tilemap.add(village);
            //テント
            const tent = new Tile("img/tent.png");
            tent.x = TILE_SIZE*26;
            tent.y = TILE_SIZE*11;
            tilemap.add(tent);
            //豪邸
            const mansion = new Tile("img/mansion.png");
            mansion.x = TILE_SIZE*22;
            mansion.y = TILE_SIZE*27;
            tilemap.add(mansion);
            //宝箱
            const treasure = new Tile("img/treasure.png");
            treasure.x = TILE_SIZE*32;
            treasure.y = TILE_SIZE*28;
            tilemap.add(treasure);
            //伝説の剣
            const sword = new Tile("img/sword.png");
            sword.x = TILE_SIZE*6;
            sword.y = TILE_SIZE*22;
            tilemap.add(sword);
            //剣を抜いた後
            const noSword = new Tile("img/noSword.png");
            noSword.x = TILE_SIZE*6;
            noSword.y = TILE_SIZE*22;
            //ラスボス
            const boss = new Tile("img/boss.png");
            boss.x = TILE_SIZE*12;
            boss.y = TILE_SIZE*32;
            tilemap.add(boss);

            //CharacterTileクラスをインスタンス化
            //キャラ１追加
            const hero = new CharacterTile("img/hero.png");
            hero.x = TILE_SIZE*5 - TILE_SIZE/2
            hero.y = TILE_SIZE*6 - TILE_SIZE/2 //キャラを画面中央に配置
            hero.isSynchronize = false; //タイルマップの動きと同期させない
            tilemap.add(hero); //tilemapにhero画像を追加してとお願い
            //キャラ２追加
            const heroine = new CharacterTile("img/heroine.png");
            heroine.x = TILE_SIZE*6 - TILE_SIZE/2 //キャラを配置
            heroine.y = TILE_SIZE*6 - TILE_SIZE/2 
            heroine.isSynchronize = false; //タイルマップの動きと同期させない
            tilemap.add(heroine); //tilemapにheroine画像を追加してとお願い
            //キャラ３追加
            const cat = new CharacterTile("img/cat.png");
            cat.x = TILE_SIZE*7 - TILE_SIZE/2
            cat.y = TILE_SIZE*6 - TILE_SIZE/2 
            cat.isSynchronize = false; //タイルマップの動きと同期させない
            tilemap.add(cat); //tilemapにcat画像を追加してとお願い

            //キャラステータス追加//
            let setStatusHero = new SetStatus();
            let statusHero = new Status(setStatusHero.HP, setStatusHero.MP, setStatusHero.Lv);
            fieldLayer.addStatus(statusHero);
            
            //Partyクラスをインスタンス化
            const party = new Party (hero, heroine, cat);
            party.speed = WALKING_SPEED; //歩く速さ設定

            //DPadインスタンス化しdpad追加  //!!戦闘シーンをタッチ仕様で作りきれなかったためカット!!//
            // const dpad = new DPad ("img/dpad.png", 80);
            // // dpad.x = 10;
            // // dpad.y = 230;
            // fieldLayer.add(dpad);

            //モンスターの画像追加
            //01cheese
            const monster0 = new Sprite("img/01_cheese.png", 128, 128)
            monster0.x = TILE_SIZE*3
            monster0.y = TILE_SIZE*3 - TILE_SIZE/2
            //02memo
            const monster1 = new Sprite("img/02_memo.png", 128, 128)
            monster1.x = TILE_SIZE*3
            monster1.y = TILE_SIZE*3 - TILE_SIZE/2 
            //03LINE
            const monster2 = new Sprite("img/03_LINE.png", 128, 128)
            monster2.x = TILE_SIZE*3
            monster2.y = TILE_SIZE*3 - TILE_SIZE/2 
            //04_firebase
            const monster3 = new Sprite("img/04_firebase.png", 128, 128)
            monster3.x = TILE_SIZE*3
            monster3.y = TILE_SIZE*3 - TILE_SIZE/2 
            //05js
            const monster4 = new Sprite("img/05_js.png", 128, 128)
            monster4.x = TILE_SIZE*3
            monster4.y = TILE_SIZE*3 - TILE_SIZE/2 

            //シーンが切り替わったときに、一度だけ呼ばれる
            scene.onchangescene = () => {
                game.sounds[ 'sound/02_opening.mp3' ].stop();
                game.sounds[ 'sound/03_field.ogg' ].loop();
            }

            //↓↓↓↓↓↓共通で使う定数・変数まとめ↓↓↓↓↓↓//
            let toggleForAnimation  = 0; //キャラクターのアニメーションのための変数
            let isMovable           = true; //移動可能かどうかの変数
            let isTreasureOpened    = false; //宝箱取得済判定
            let isSwordTaken        = false; //剣取得済判定
            let encounter           = 100; //エンカウント判定用変数
            let battlePhase         = 0; //バトル内での場面切り替え用変数
            let monsterType         = 0; //敵のタイプ判定
            let monsterName;
            let monsterStatus;
            
            const battle = new Battle();
            const encountered   = new Text (`課題が現れた!`);
            const commandText   = new Text ("1.こうげき", "2.ひっさつ", "3.にげる");
            const clearText     = new Text ("MIL生は見事にJS選手権を", "突破した!");
            const monsterNames = ["チーズアカデミー", "メモ帳アプリ", "L○NE", "Firebase", "JS選手権"];
            let monsterStatuses = [
                new SetStatus(1, 8, 0, 3, 1, 1, 2),
                new SetStatus(2, 20, 0, 7, 5, 2, 4),
                new SetStatus(3, 30, 0, 13, 11, 4, 8),
                new SetStatus(4, 40, 0, 16, 14, 8, 16),
                new SetStatus(5, 60, 0, 20, 17, 16, 32),
            ];
            //↑↑↑↑↑↑共通で使う定数・変数まとめ↑↑↑↑↑↑//


            //↓↓↓↓↓↓戦闘関連の関数まとめ↓↓↓↓↓↓//
            function addExp (val) {
                setStatusHero.Exp += val;
                while (setStatusHero.Lv * (setStatusHero.Lv + 1) * 2 <= setStatusHero.Exp) {
                    setStatusHero.Lv++;                                         //Lvアップ
                    setStatusHero.maxHP     += 4 + Math.floor(Math.random()*3); //最大HPアップ
                    setStatusHero.maxMP     += 2 + Math.floor(Math.random()*2); //最大MPアップ
                    setStatusHero.attack    += 1 + Math.floor(Math.random()*2); //攻撃力アップ
                    setStatusHero.defense   += 1 + Math.floor(Math.random()*2); //守備力アップ
                    setStatusHero.speed     += 1 + Math.floor(Math.random()*2); //すばやさアップ
                }
            }

            function action () {
                scene.ontouchstart = () => {
                    battlePhase = 2;
                }
                if (game.input.one) { 
                    battlePhase = 2;
                    game.input.one = false;
                }
                else if (game.input.two) {
                    if (setStatusHero.MP < 3) {
                        battlePhase = 10;
                        game.input.two = false;
                    }
                    else {
                        setStatusHero.MP -= 3;
                        updStatusB();
                        battlePhase = 3;
                        game.input.two = false;
                    }
                }
                else if (game.input.three) {

                    let escaper = Math.random(); 
                    if (monsterType == 4) {
                        battlePhase = 7;
                        game.input.three = false;
                    }
                    else {
                        if (escaper < 0.5) { //にげる成功
                            battlePhase = 6;
                            game.input.three = false;
                        }
                        else { //にげる失敗
                            battlePhase = 7;
                            game.input.three = false;
                        }
                    }
                }
            }

            function judgeMonsterType () {
                monsterType = Math.abs((tilemap.x + hero.x) / TILE_SIZE) + Math.abs((tilemap.y * 1.5 + hero.y) / TILE_SIZE);
                monsterType = Math.floor(monsterType / 16);
                monsterType = Math.min(monsterType, monsterNames.length - 2);
                if (hero.isOverlapped(boss))  monsterType = 4;
                return monsterType;
            }

            function appearMonster () {
                battleLayer.add(battle);
                battleLayer.addText(commandText);
                
                if (monsterType == 0) {
                    battleLayer.add(monster0);
                    monsterName = monsterNames[0];
                    monsterStatus = monsterStatuses[0];
                }
                else if (monsterType == 1) {
                    battleLayer.add(monster1);
                    monsterName = monsterNames[1];
                    monsterStatus = monsterStatuses[1];
                }
                else if (monsterType == 2) {
                    battleLayer.add(monster2);
                    monsterName = monsterNames[2];
                    monsterStatus = monsterStatuses[2];
                }
                else if (monsterType == 3) {
                    battleLayer.add(monster3);
                    monsterName = monsterNames[3];
                    monsterStatus = monsterStatuses[3];
                }
                else if (monsterType == 4) {
                    battleLayer.add(monster4);
                    monsterName = monsterNames[4];
                    monsterStatus = monsterStatuses[4];
                }
            }

            function updStatusB (){
                battleLayer.removeStatus();
                let statusHero = new Status(setStatusHero.HP, setStatusHero.MP, setStatusHero.Lv);
                battleLayer.addStatus(statusHero);
            }

            function updStatusF (){
                fieldLayer.removeStatus();
                let statusHero = new Status(setStatusHero.HP, setStatusHero.MP, setStatusHero.Lv);
                fieldLayer.addStatus(statusHero);
            }
            //↑↑↑↑↑↑戦闘関連の関数まとめ↑↑↑↑↑↑//


            // 常に呼び出される
            scene.onenterframe = () => {
                //タイルマップの位置がタイルのサイズで割り切れる時だけ移動
                if((tilemap.x - TILE_SIZE/2) % TILE_SIZE === 0 && (tilemap.y - TILE_SIZE/2) % TILE_SIZE === 0){
                    //タイルマップの移動速度に0を代入する。これがないとずっと移動を続ける（ピンボールみたいな動きになった）
                    tilemap.vx = tilemap.vy = 0;

                    for (let i in party.member) { //パーティ全員分繰り返し
                        party.member[i].vx = party.member[i].vy = 0; //パーティ全員の移動速度に0を代入
                        party.member[i].animation = 1; //画像を切り替える
                    }

                    //村に入るイベント
                    if (hero.isOverlapped(village)) {
                        let villageText = new Text ("ゆっくり休んで全回復!", "東に向かえば川を渡れるらしい");
                        fieldLayer.addText (villageText);
                        isMovable = false;
                        // scene.ontouchstart = () => { //touchしても動かん
                        //     fieldLayer.removeText();
                        //     setStatusHero.HP = setStatusHero.maxHP;
                        //     setStatusHero.MP = setStatusHero.maxMP;
                        //     fieldLayer.removeStatus();
                        //     let statusHero = new Status(setStatusHero.HP, setStatusHero.MP, setStatusHero.Lv);
                        //     fieldLayer.addStatus(statusHero);
                        //     isMovable = true;
                        //     tilemap.vy = -1 * WALKING_SPEED;
                        // }
                        if (game.input.space){ 
                            fieldLayer.removeText();
                            setStatusHero.HP = setStatusHero.maxHP;
                            setStatusHero.MP = setStatusHero.maxMP;
                            updStatusF();
                            isMovable = true;
                            tilemap.vy = -1 * WALKING_SPEED;
                            hero.direction = 0;
                        }
                    }

                    //テントに入るイベント
                    if (hero.isOverlapped(tent)) {
                        let tentText = new Text ("ゆっくり休んで全回復!", "南に豪邸があるらしい");
                        fieldLayer.addText (tentText);
                        isMovable = false;
                        if (game.input.space){ 
                            fieldLayer.removeText();
                            setStatusHero.HP = setStatusHero.maxHP;
                            setStatusHero.MP = setStatusHero.maxMP;
                            updStatusF();
                            isMovable = true;
                            tilemap.vy = -1 * WALKING_SPEED;
                            hero.direction = 0;
                        }
                    }

                    //豪邸に入るイベント
                    if (hero.isOverlapped(mansion)) {
                        let mansionText = new Text ("川を西に越えた先にヤツがいるぞ", "東には貴重な宝が眠っている");
                        fieldLayer.addText (mansionText);
                        isMovable = false;
                        if (game.input.space){ 
                            fieldLayer.removeText();
                            setStatusHero.HP = setStatusHero.maxHP;
                            setStatusHero.MP = setStatusHero.maxMP;
                            updStatusF();
                            isMovable = true;
                            tilemap.vx = -1 * WALKING_SPEED;
                            hero.direction = 2;
                        }
                    }

                    //宝箱イベント
                    if (hero.isOverlapped(treasure)) {
                        if (!isTreasureOpened) {
                            let treasureText = new Text ("MIL生は宝箱を開けた!","なんと秘伝の技を見つけた!","経験値を100獲得!");
                            fieldLayer.addText (treasureText);
                            isMovable = false;
                            if (game.input.space){ 
                                fieldLayer.removeText();
                                addExp(100);
                                updStatusF();
                                isMovable = true;
                                tilemap.vx = 1 * WALKING_SPEED;
                                hero.direction = 1;
                                isTreasureOpened = true;
                                game.input.space = false;
                            }
                        }
                        else {
                            let treasureDoneText = new Text ("宝箱は空っぽのようだ");
                            fieldLayer.addText (treasureDoneText);
                            isMovable = false;
                            if (game.input.space){ 
                                fieldLayer.removeText();
                                isMovable = true;
                                tilemap.vx = 1 * WALKING_SPEED;
                                hero.direction = 1;
                                game.input.space = false;
                            }
                        }
                    }

                    //剣イベント
                    if (hero.isOverlapped(sword)) {
                        if (!isSwordTaken) {
                            let swordText = new Text ("MIL生は伝説の剣を見つけた!","攻撃力が20アップ!");
                            fieldLayer.addText (swordText);
                            isMovable = false;
                            if (game.input.space){ 
                                fieldLayer.removeText();
                                setStatusHero.attack += 20;
                                updStatusF();
                                isMovable = true;
                                tilemap.vx = -1 * WALKING_SPEED;
                                hero.direction = 2;
                                isSwordTaken = true;
                                tilemap.add(noSword);
                                game.input.space = false;
                            }
                        }
                        else {
                            let swordDoneText = new Text ("足元には何もない");
                            fieldLayer.addText (swordDoneText);
                            isMovable = false;
                            if (game.input.space){ 
                                fieldLayer.removeText();
                                isMovable = true;
                                tilemap.vx = -1 * WALKING_SPEED;
                                hero.direction = 2;
                                game.input.space = false;
                            }
                        }
                    }

                    //ラスボス
                    if (hero.isOverlapped(boss)) {
                        fieldLayer.addText(encountered);
                        isMovable = false;
                        monsterType = 4;
                    
                        scene.ontouchstart = () => {
                            battlePhase = 1;
                        }
                        if (game.input.space) { 
                            battlePhase = 1;
                            game.input.space = false; //onenterframeで常に読み込んでいるため、space一回押すだけで複数回押している判定になりbattlePhaseが進んでしまう。それを防ぐために1行追加。
                        }
                    }

                    if (isMovable){ //isMovableがtrueの時のみ移動ができる
                        //キーが押された時またはD-Padが押された時、setMemberVelocityメソッドを呼び出し、タイルマップの移動速度とキャラクターの向きにそれぞれ値を代入。
                        //??elseは斜め移動をさせないためのもの??//
                        if(game.input.left) {
                            party.setMemberVelocity("left");
                            tilemap.vx = WALKING_SPEED;
                            hero.direction = 1;
                            encounter -= Math.random()*2;
                        }
                        else if(game.input.right) {
                            party.setMemberVelocity("right");
                            tilemap.vx = -1 * WALKING_SPEED;
                            hero.direction = 2;
                            encounter -= Math.random()*2;
                        }
                        else if(game.input.up) {
                            party.setMemberVelocity("up");
                            tilemap.vy = WALKING_SPEED;
                            hero.direction = 3;
                            encounter -= Math.random()*2;
                        }
                        else if(game.input.down) {
                            party.setMemberVelocity("down");
                            tilemap.vy = -1 * WALKING_SPEED;
                            hero.direction = 0;
                            encounter -= Math.random()*2;
                        }

                        //移動後のマップ座標を求める。動けないかどうかは移動後のマップ座標で判断するため。
                        const heroCoordinateAfterMoveX = hero.mapX - tilemap.vx / WALKING_SPEED;
                        const heroCoordinateAfterMoveY = hero.mapY - tilemap.vy / WALKING_SPEED;
                        //移動後のマップ座標に障害物があるなら
                        if (tilemap.hasObstacle(heroCoordinateAfterMoveX, heroCoordinateAfterMoveY)) {
                            tilemap.vx = tilemap.vy = 0; //移動量に0を代入
                            for (let i in party.member) { //パーティ全員の移動速度に0を代入
                                party.member[i].vx = party.member[i].vy = 0;
                            }
                        }
                        //タイルマップが動いているとき、パーティメンバーの向きを変える
                        if (tilemap.vx !== 0 || tilemap.vy !== 0) party.setMemberDirection();
                    }
                }
                //タイルマップのXとY座標両方がタイルのサイズで割り切れる時以外で、かつタイルの半分のサイズで割り切れる時
                else if ((tilemap.x + TILE_SIZE/2) % (TILE_SIZE/2) === 0 && (tilemap.y + TILE_SIZE/2) % (TILE_SIZE/2) === 0) {
                    toggleForAnimation ^= 1; //0と1を交互に取得する
                    for (let i in party.member) { //パーティメンバーの数だけ繰り返す
                    //toggleForAnimationの数値に応じてキャラの画像を切り替える
                        if (toggleForAnimation === 0) party.member[i].animation = 2;
                        else party.member[i].animation = 0;
                    }
                }
                //エンカウント係数が一定以下になると戦闘開始
                if (battlePhase == 0 && encounter <= 90) {
                    fieldLayer.addText(encountered);
                    isMovable = false;
                    judgeMonsterType();
                    
                    scene.ontouchstart = () => {
                        battlePhase = 1;
                    }
                    if (game.input.space) { 
                        battlePhase = 1;
                        game.input.space = false; //onenterframeで常に読み込んでいるため、space一回押すだけで複数回押している判定になりbattlePhaseが進んでしまう。それを防ぐために1行追加。
                    }
                }

                else if (battlePhase == 1) { //戦闘コマンド選択フェーズ
                    fieldLayer.removeText();
                    updStatusB();
                    game.sounds[ 'sound/03_field.ogg' ].stop();
                    game.sounds[ 'sound/04_battle.ogg' ].loop();
                    appearMonster();
                    action();
                    if (hero.isOverlapped(boss)) tilemap.vy = WALKING_SPEED;
                }

                else if (battlePhase == 2) { //MIL生こうげきフェーズ
                    battleLayer.removeText();
                    let damage = Math.floor(setStatusHero.attack / 2 - monsterStatus.defense / 4 + 1);
                    damage = Math.max(0, damage);
                    let hAttackText = new Text (`MIL生のこうげき!`, `${monsterName}に${damage}のダメージ!`);
                    battleLayer.addText(hAttackText);
                    if (game.input.space) {
                        monsterStatus.HP -= damage;
                        if (monsterStatus.HP <= 0) {
                            battlePhase = 5;
                            game.input.space = false;
                        }
                        else {
                            battlePhase = 4;
                            game.input.space = false;
                        }
                    }
                }

                else if (battlePhase == 3) { //MIL生ひっさつフェーズ
                    battleLayer.removeText();
                    let damage = Math.floor(setStatusHero.attack / 2 - monsterStatus.defense / 4 + 1) * 2;
                    damage = Math.max(0, damage);
                    let hSpecialText = new Text (`MIL生のひっさつ!`, `${monsterName}に${damage}のダメージ!`);
                    battleLayer.addText(hSpecialText);
                    if (game.input.space) {
                        monsterStatus.HP -= damage;
                        if (monsterStatus.HP <= 0) {
                            battlePhase = 5;
                            game.input.space = false;
                        }
                        else {
                            battlePhase = 4;
                            game.input.space = false;
                        }
                    }
                }

                else if (battlePhase == 4) { //敵こうげきフェーズ
                    battleLayer.removeText();
                    let damage = Math.floor(monsterStatus.attack / 2 - setStatusHero.defense / 4 + 1);
                    damage = Math.max(0, damage);
                    let mAttackText = new Text (`${monsterName}のこうげき!`, `${damage}のダメージ!`);
                    battleLayer.addText(mAttackText);
                    if (game.input.space) {
                        setStatusHero.HP -= damage;
                        setStatusHero.HP = Math.max (0, setStatusHero.HP);
                        updStatusB();
                        if(setStatusHero.HP <= 0){
                            battlePhase = 8;
                            game.input.space = false;
                        }
                        else {
                            battlePhase = 1;
                            game.input.space = false;
                        }
                    }
                }

                else if (battlePhase == 5) { //勝利・経験値獲得フェーズ
                    battleLayer.removeText();
                    const winText = new Text (`${monsterName}を倒した!`);
                    battleLayer.addText(winText);
                    if (game.input.space) {
                        addExp(monsterStatus.Exp);
                        battlePhase = 9;
                        game.input.space = false;
                    }
                }

                else if (battlePhase == 6) { //にげる成功フェーズ
                    battleLayer.removeText();
                    const escapeText = new Text (`MIL生は逃げ出した!`);
                    battleLayer.addText(escapeText);
                    if (game.input.space) {
                        battlePhase = 9;
                        game.input.space = false;
                    }
                }
                
                else if (battlePhase == 7) { //にげる失敗フェーズ
                    battleLayer.removeText();
                    const escapeText = new Text (`MIL生は逃げ出した!`, `しかし回り込まれてしまった!`);
                    const escapeBossText = new Text (`JS選手権からは逃げられない!`);
                    
                    if(monsterType == 4) {
                        battleLayer.addText(escapeBossText);
                    }
                    else {
                        battleLayer.addText(escapeText);
                    }

                    if (game.input.space) {
                        battlePhase = 4;
                        game.input.space = false;
                    }
                }

                else if (battlePhase == 8) {
                    battleLayer.removeText();
                    const deadText = new Text (`MIL生は死んでしまった!`);
                    battleLayer.addText(deadText);
                    if (game.input.space) {
                        game.currentScene = gameoverScene();
                        game.input.space = false;
                    }
                }

                else if (battlePhase == 9) {
                    battleLayer.removeText();
                    battleLayer.removeObj();
                    battleLayer.removeStatus();
                    game.sounds[ 'sound/04_battle.ogg' ].stop();
                    encounter = 100;
                    if (monsterType == 4) {
                        fieldLayer.addText (clearText);
                        game.sounds[ 'sound/05_boss.ogg' ].stop();
                        if (game.input.space) {
                            game.currentScene = endingScene();
                            game.input.space = false;
                        }
                    }
                    else {
                        battlePhase = 0;
                        isMovable = true;  
                        updStatusF();
                        monsterStatuses = [ //ここで配列を初期化しないと、同じモンスターが出た時に前回の戦闘で減ったHPそのままで登場してしまう
                            new SetStatus(1, 8, 0, 3, 1, 1, 2),
                            new SetStatus(2, 20, 0, 7, 5, 2, 4),
                            new SetStatus(3, 30, 0, 13, 11, 4, 8),
                            new SetStatus(4, 40, 0, 16, 14, 8, 16),
                            new SetStatus(5, 100, 0, 20, 25, 16, 32),
                        ];
                    }
                }

                else if (battlePhase == 10) {
                    battleLayer.removeText();
                    const missSpecialText = new Text (`MPが足りない!`);
                    battleLayer.addText(missSpecialText);
                    if (game.input.space) {
                        battlePhase = 1;
                        game.input.space = false;
                    }
                }

                else {
                    game.sounds[ 'sound/03_field.ogg' ].loop();
                }
            }
            return scene;
        }

        const endingScene = () => {
            const scene         = new Scene();
            const endingLayer    = new Layer(); 
            const endingText1  = new Text ("こうして、無事JS選手権を突破し、", "MIL生は原宿に帰ってきた。", "次の課題と卒業制作に向け、");
                endingText1.x      = 10;
                endingText1.y      = 90;
            const endingText2  = new Text ("また眠れぬ日々が始まる...。","がんばれMIL生、負けるなMIL生!"); 
                endingText2.x      = 10;
                endingText2.y      = 165;
            const endingText3  = new Text ("画像: https://pipoya.net/sozai/","BGM: https://music.storyinvention.com/"); 
                endingText3.x      = 10;
                endingText3.y      = 240;
                endingText3.size   = 14;
            scene.add(endingLayer);
            endingLayer.addText(endingText1);
            endingLayer.addText(endingText2);
            endingLayer.addText(endingText3);

            scene.onchangescene = () => {
                game.sounds[ 'sound/04_battle.ogg' ].stop();
                game.sounds[ 'sound/05_boss.ogg' ].stop();
                game.sounds[ 'sound/07_ending.mp3' ].start();
			}

            scene.ontouchstart = () => {
                game.currentScene = titleScene(); //mainSceneに切り替える
            }

            scene.onenterframe = () => { //常に呼び出されるonenterframeでspaceキーが押されるのを待つ
                if (game.input.space) {
                    game.currentScene = titleScene();
                    game.input.space = false;
                } 
            }

            return scene;
        }

        const gameoverScene = () => {
            const scene             = new Scene();
            const gameoverLayer     = new Layer(); 

            const gameoverText1  = new Text ("GAME OVER");
                gameoverText1.center().middle();
                gameoverText1.size   = 36;
            const gameoverText2  = new Text ("レベルを上げて再チャレンジしよう!","スペースキーを押してね!"); 
                gameoverText2.center();
                gameoverText2.size   = 14;

            scene.add(gameoverLayer);
            gameoverLayer.addText(gameoverText1);
            gameoverLayer.addText(gameoverText2);

            scene.onchangescene = () => {
                game.sounds[ 'sound/04_battle.ogg' ].stop();
                game.sounds[ 'sound/05_boss.ogg' ].stop();
                game.sounds[ 'sound/06_requiem.mp3' ].start();
			}

            scene.ontouchstart = () => {
                game.currentScene = titleScene(); //mainSceneに切り替える
            }

            scene.onenterframe = () => { //常に呼び出されるonenterframeでspaceキーが押されるのを待つ
                if (game.input.space) {
                    game.currentScene = titleScene();
                    game.input.space = false;
                } 
            }

            return scene;
        }

        game.add(titleScene()); //Sceneを追加
        game.add(openingScene()); 
        game.add(mainScene()); 
        game.add(endingScene()); 
        game.add(gameoverScene()); 

        //gameにゲームスタート指示
        game.start();
    })

})
