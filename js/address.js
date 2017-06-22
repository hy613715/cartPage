new Vue({
    el:'.container',
    data:function() {
        return {
            addressList: [],
            limitAddr: 2,
            curIndex: 0,
            sendWays: 1,
            curAddr:'',
            layerShow: false,
            addAddress: {
                'userName':'',
                'streetName':'',
                'postCode':''
            }
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
            _this.$http.get('../data/address.json').then(function(res){
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
            this.addAddress = {
                'userName':'',
                'streetName':'',
                'postCode':''
            }

            this.layerShow = !this.layerShow;
        },
        getMsg: function(){
            this.addressList.push(this.addAddress);
            this.showPop();
            this.limitAddr = this.addressList.length;
        }
    }
});
