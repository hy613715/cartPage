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
            userName:"",
            streetName:"",
            postCode:""
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
        //修改地址
        editAddr:function(item){
            var _this = this;
            // 因为关闭弹窗的时候需要清空input的值，所以this.showPop();要放在最前面执行
            _this.showPop(item);
            // 给input赋值，取当前点击的地址相应的值
            // this.inputName = item.userName;
            // this.inuptAddress = item.streetName;
            // this.inputPostNum = item.postCode;
            // console.log(item.addressId)
        },
        moveAddr:function(item){
            var index = this.addressList.indexOf(item);
            this.addressList.splice(index,1)
        },
        showPop:function(item) {
            this.layerShow = !this.layerShow;
            //点击关闭图标或者取消，input的值清空
            if(item) {
                this.userName = item.userName;
                this.streetName = item.streetName;
                this.postCode = item.postCode;
                this.isDefault = item.isDefault;
                this.addressId = item.addressId;
            } else {
                this.userName = "";
                this.streetName = "";
                this.postCode = "";
            }
        },
        getMsg: function(item){
            if(this.userName!="" && this.inuptAddress != "" &&this.postCode!=""){
                this.addressList.push({
                    userName:this.userName,
                    streetName:this.streetName,
                    postCode:this.postCode,
                    isDefault:false,
                    addressId: 100000+this.addressList.length+1
                });

                // this.addressList.forEach(function(item) {
                //     console.log(item.addressId);
                // });

                var data = {
                    userName: this.userName,
                    streetName: this.streetName,
                    postCode: this.postCode,
                    isDefault: false
                }
                this.$http.post("../data/updateAddress.json",data).then(function(res){
                    console.log(1);
                });
            }else{
                alert("请输入完整信息");
                return false;
            }

            this.showPop();
            this.limitAddr = this.addressList.length;
        }
    }
})
