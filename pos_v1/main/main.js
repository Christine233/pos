'use strict';

function printReceipt(inputs) {
    var inputArr = loadAllItems();
    var commArr = [];

// #1.计算各商品总数量，计算完后将tag替换为barcode
// （调用loadAllItems()方法得到商店商品清单 inputsArr:[Object];)
//预计 10min，实际
    function calCount(inputList) {
        for (let i = 0; i < inputList.length; i++){
            let str1 = inputList[i].replace(/[^a-zA-Z]/ig,"");
            if(bc == str1) continue;
            let bc = str1;
            let countNum = 0;
            for(let j = 0 ; j < inputList.length; j++) {
                let str2 = inputList[j].replace(/[^a-zA-Z]/ig,"");
                let num = inputList[j].replace(/[^0-9]/ig,"");
                if(bc == str2) {
                    if(num != "")
                        countNum += parseInt(num);
                    else
                        countNum++;
                }
            }
            let obj = {};
            obj.barcode = bc;
            obj.count = countNum;
            commArr.push(obj);
        }
        return commArr;
    }

    //得到用户购买的详情请单
    function detList(inputList) {
        var counter = 0;
        for(let i = 0; i < inputList.length;){
            counter += 1;
            for(let j = 0; j < inputArr.length; j++) {
                if (inputList[i] == inputArr[j].barcode) {
                    commArr[counter-1].name = inputArr[j].name;
                    commArr[counter-1].unit = inputArr[j].unit;
                    commArr[counter-1].price = inputArr[j].price;
                }
            }
            i += commArr[counter-1].count;
        }
        return commArr;
    }

//#2. 计算商品“小计”钱数      预计 5min，实际2min
    function subtotal(commArray) {
        for(let i = 0; i < commArray.length; i++){
            var s = commArray[i].price*commArray[i].count;
            commArr[i].sum = s;
        }
        return commArr;
    }

//#3. 计算商品“总计”钱数     预计 5min，实际2min
    function total(commArray) {
        var totalNum = 0;
        for(let i = 0; i < commArray.length; i++) {
            totalNum += commArray[i].sum;
        }
        return totalNum;
    }

//#4. 打印输出清单           预计 15min，实际5min
    function print() {
        var final = subtotal(commArr);
        var list = '***<没钱赚商店>收据***\n';
        for(let i = 0; i < final.length; i++){
            list += '名称：' + final[i].name + '，' + '数量：' + final[i].count + final[i].unit + '，' + '单价：' + final[i].price.toFixed(2) + '(元)，小计：'+ final[i].sum.toFixed(2) + '(元)\n';
        }
        list += '----------------------\n总计：' + total(commArr).toFixed(2) +'(元)\n**********************';
        return list;
    }
    calCount(inputs);
    detList(inputs);
    console.log(print());
}