'use strict'
//仲間・敵キャラステータス設定用のクラス
class SetStatus {
    constructor (Lv, HP, MP, attack, defense, speed, Exp) {
        this.Lv         = Lv || 1;
        this.HP         = HP || 20;
        this.maxHP      = 20;
        this.MP         = MP || 0;
        this.maxMP      = 0;
        this.attack     = attack || 3;
        this.defense    = defense || 1;
        this.speed      = speed || 1;
        this.Exp         = Exp || 0;
    }

    //イベントによるステータス増減を表示させるためのメソッド必要。
    //
}