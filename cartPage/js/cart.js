/*  date 6/18
    author hy
*/

var vm = new Vue({
    el:"#app",
    data: {
        goodsList:[],
        checkAllFlag:false,
        allMoney: 0,
        layerShow: false,
        curGoods:""
    },
    // 过滤器
    filters:{
        formatMoney: function(value,type){
            return "￥" + value.toFixed(2) + type;
        }
    },
    mounted: function(){
        this.cartView();
    },
    // 方法
    methods: {
        cartView: function(){
            var _this = this;
            _this.$http.get("../data/cart.json").then(function(res){
                _this.goodsList = res.body.result.list;
            });
        },
        changeMoney: function(num,way){
            if(way>0){
                num.goodsNum ++;
            }else{
                num.goodsNum --;
                if(num.goodsNum<2) {
                    num.goodsNum = 1;
                }
            }
            this.calcMoney();
        },
        chooseGoods: function(item){
            var _this = this;
            if(typeof item.goodsCheck == "undefined") {
                _this.$set(item,"goodsCheck",true);
            }else {
                item.goodsCheck = !item.goodsCheck;
            }
            this.calcMoney();
        },
        checkAll: function(flag){
            this.checkAllFlag = flag;
            var _this = this;
            _this.goodsList.forEach(function(item,index){
                if(typeof item.goodsCheck == "undefined") {
                    _this.$set(item,"goodsCheck",_this.checkAllFlag);
                }else {
                    item.goodsCheck = _this.checkAllFlag;
                }
            })
            this.calcMoney();
        },
        calcMoney: function(){
            var _this = this;
            _this.allMoney = 0;
            this.goodsList.forEach(function(item,index){
                if(item.goodsCheck) {
                    _this.allMoney += item.goodsPrice*item.goodsNum;
                }
            })
        },
        delGoods: function(item){
            this.layerShow = !this.layerShow;
            this.curGoods = item;
        },
        delGood: function(){
            var index = this.goodsList.indexOf(this.curGoods);
            this.goodsList.splice(index, 1);
            this.layerShow = !this.layerShow;
            this.calcMoney();
        }
    }
});