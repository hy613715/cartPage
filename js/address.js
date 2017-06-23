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
        setDefault: function(addressId){
            this.addressList.forEach(function(item,index){
                if(item.addressId==addressId){
                    //发送请求到后端设为默认
                    var _this = this;
                    _this.$http.post("../data/updateAddress.json",{

                    }).then(function(){

                    })
                    item.isDefault = true;
                }else{
                    item.isDefault = false;
                }
            })
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
