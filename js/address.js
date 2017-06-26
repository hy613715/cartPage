new Vue({
    el:"#app",
    data:function() {
        return {
            addressList: [],
            limitAddr: 2,
            curIndex: 0,
            sendWays: 1,
            curAddr:"",
            layerShow: false,
            id: '',
            inputName:"",
            inuptAddress:"",
            inputPostNum:"",
            addAddress: {
                'userName': '',
                'streetName': '',
                'postCode': ''
            }
        }
    },
    filters: {

    },
    mounted: function() {
        this.getAddr();
    },
    computed:{
        addressLimit:function(){
            return this.addressList.slice(0, this.limitAddr);
        }
    },
    methods: {
        clearData: function() {
            this.inputName = "";
            this.inuptAddress = "";
            this.inputPostNum = "";
            this.addAddress =  {
                'userName': '',
                'streetName': '',
                'postCode': ''
            };
        },
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
        },
        moveAddr:function(item){
            this.$http.post("../data/delAddress.json",{addressId: item.addressId}).then(function(res){
                var index = this.addressList.indexOf(item);
                this.addressList.splice(index,1);
                console.log(typeof JSON.parse(res.data));
                alert(JSON.parse(res.data).msg)
            })
        },

        // 显示弹窗
        showPop:function(item) {

            this.layerShow = !this.layerShow;
            //点击关闭图标或者取消，input的值清空

            this.inputName = "";
            this.inuptAddress = "";
            this.inputPostNum = "";

            // 当有参数传过来时，说明是修改，直接赋值到输入框
            if(item) {
                this.inputName = item.userName;
                this.inuptAddress = item.streetName;
                this.inputPostNum = item.postCode;
                this.id = item.addressId;
            }
        },

        getMsg: function(){

            if(this.inputName == '' || this.inuptAddress == '' || this.inputPostNum == '') {
                alert("请输入完整信息");
                return false;
            }

            // 给后端发的请求地址
            var postUrl = '../data/addAddress.json';

            // 给后端传的参数，当有参数时是修改，必须传id,to：hy,参数是和后端定的，需要让你传什么就传什么，不是想当然的传
            var data = {
                userName: this.inputName,
                streetName: this.inuptAddress,
                postCode: this.inputPostNum
            }

            if(this.id) {
                data = {
                    userName: this.inputName,
                    streetName: this.inuptAddress,
                    postCode: this.inputPostNum,
                    addressId: this.id
                }
                postUrl = '../data/updateAddress.json';
            }

            this.$http.post(postUrl, data).then(function(res) {

                // 将字符串解析为json对象
                var data = JSON.parse(res.data);
                if(data.code != '0') {
                    console.log('请求不成功');
                    return;
                }

                // 下面是添加新地址时用到的，其实平时不需要，再向后端请求就好了，这里为了方便看是否添加上了就赋值了一下
                this.addAddress['userName'] = this.inputName;
                this.addAddress['streetName'] = this.inuptAddress;
                this.addAddress['postCode'] = this.inputPostNum;

                this.addressList.push(this.addAddress);
                // end

                this.limitAddr = this.addressList.length;

                // 不管是新增还是修改，处理完后向后端请求一下，页面的数据就会变化
                // this.getAddr();

                // 关闭弹窗
                this.layerShow = !this.layerShow;

                // 清除数据
                this.clearData();
            });
        }
    }
});
