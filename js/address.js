new Vue({
    el:".container",
    data:function() {
        return{
            addressList: [],
            limitAddr: 2,
            curIndex: 0,
            sendWays: 1,
            curAddr:"",
            layerShow: false,
            inputName:"",
            inuptAddress:"",
            inputPostNum:""
        }
    },
    filters: {

    },
    mounted: function(){
        this.getAddr();
    },
    computed:{
        addressLimit:function(){
            return this.addressList.slice(0, this.limitAddr);
        }
    },
    methods: {
        getAddr: function(){
            var _this = this;
            _this.$http.get("../data/address.json").then(function(res){
                this.addressList = res.body.result;
            })
        },
        showMore: function(){
            if(this.limitAddr==2){
                this.limitAddr = this.addressList.length;
            }else{
                this.limitAddr=2;
            }
        },

        // 设置默认地址
        setDefault: function(item){
            // this.addressList.forEach(function(item,index){
            //     if(item.addressId==addressId){
            //
            //     }else{
            //         item.isDefault = false;
            //     }
            // });

            this.$http.post("../data/setDefaultAddress.json", {addressId: item.addressId}).then(function(res){

                // 这里感觉写的不太合适，不过能实现功能
                this.addressList.forEach(function(item){
                    item.isDefault = false;
                });

                // 此处应该是有弹窗，提示成功，先用log代替吧,不知道为啥json是个字符串，只能先转成对象去获取
                console.log(JSON.parse(res.data).msg);
                item.isDefault = true;
            });

        },
        moveAddr:function(item){
            var index = this.addressList.indexOf(item);
            this.addressList.splice(index,1)
        },
        showPop:function(){
            this.layerShow = !this.layerShow;
        },
        getMsg: function(){
            if(this.inputName!="" && this.inuptAddress != "" &&this.inputPostNum!=""){
                this.addressList.push({
                    userName:this.inputName,
                    streetName:this.inuptAddress,
                    postCode:this.inputPostNum,
                    isDefault:false,
                    addressId: 100000+this.addressList.length+1
                });

                this.addressList.forEach(function(item) {
                    console.log(item.addressId);
                });
                this.inputName = "";
                this.inuptAddress = "";
                this.inputPostNum = "";
            }else{
                alert("请输入完整信息");
                return false;
            }

            this.showPop();
            this.limitAddr = this.addressList.length;
        }
    }
})
