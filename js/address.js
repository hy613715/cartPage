new Vue({
    el: '.container',
    data: function() {
        return {
            addressList: [],
            limitAddr: 2,
            curIndex: 0,
            sendWays: 1,
            curAddr: '',
            layerShow: false,
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
    computed: {
        addressLimit: function() {
            return this.addressList.slice(0, this.limitAddr);
        }
    },
    methods: {
        getAddr: function() {
            var _this = this;
            _this.$http.get('../data/address.json').then(function(res) {
                this.addressList = res.body.result;
            })
        },
        showMore: function() {
            if (this.limitAddr == 2) {
                this.limitAddr = this.addressList.length;
            } else {
                this.limitAddr = 2;
            }
        },
        setDefault: function(addressId) {
            this.addressList.forEach(function(item, index) {
                if (item.addressId == addressId) {
                    item.isDefault = true;
                } else {
                    item.isDefault = false;
                }
            })
        },
        moveAddr: function(item) {
            var index = this.addressList.indexOf(item);
            this.addressList.splice(index, 1)
        },
        showPop: function() {
            var _this = this;
            _this.addAddress = {
                'userName': '',
                'streetName': '',
                'postCode': ''
            }

            this.layerShow = !this.layerShow;
        },
        getMsg: function() {
            var _this = this;

            this.$http({
                url: '../data/addAddress.json',
                method: 'POST',
                data: {
                    userName: '22',
                    streetName: this.addAddress['streetName'],
                    postCode: this.addAddress['postCode']
                },
                headers: {"X-Requested-With": "XMLHttpRequest"},
                emulateJSON: true
            }).then(function(res) {

                // 将字符串解析为json对象
                var data = JSON.parse(res.data);
                if(data.code != '0') {
                    console.log('请求不成功');
                    return;
                }

                _this.addressList.push(_this.addAddress);
                this.limitAddr = this.addressList.length;
                this.getAddr();
                
                // 关闭弹窗
                this.layerShow = !this.layerShow;
            });
        }
    }
});
