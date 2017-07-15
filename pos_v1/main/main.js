'use strict';
var inputArr = loadAllItems();
var commArr = [];

function printReceipt(inputs) {
    calCount(inputs);
    detList(commArr);
    subtotal(commArr);
    whetherdis(commArr);
    total(commArr);
    console.log(print());
}

// #1.计算各商品总数量，计算完后将tag替换为barcode
// （调用loadAllItems()方法得到商店商品清单 inputsArr:[Object];)
//预计 10min，实际走了许多弯路，用了很长时间，后来经buddy点醒做的就快了
function calCount(inputList) {
    //将所有tag变为barcode，得到格式一样的对象数组  10min
    let tempArr = [];
    for(let i = 0; i < inputList.length; i++){
        let flag = inputList[i].indexOf('-');
        if(flag != -1){
            tempArr.push({barcode:inputList[i].split('-')[0], num:inputList[i].split('-')[1]});
        }
        else{
            tempArr.push({barcode:inputList[i], num:1});
        }
    }
    //计算商品总数量 20min
    for (let i = 0; i < tempArr.length;){
        let countNum = 0;
        let temp = 0;
        for(let j = 0 ; j < tempArr.length; j++) {
            if(tempArr[i].barcode == tempArr[j].barcode) {
                temp ++;
                countNum += parseFloat(tempArr[j].num);
            }
        }
        commArr.push({barcode:tempArr[i].barcode,count:countNum});
        i += temp;
    }
    return commArr;
}

//#2 得到用户购买的详情请单   预计10min，实际7min
function detList(inputList) {
    for(let i = 0; i < inputList.length;i++){
        for(let j = 0; j < inputArr.length; j++) {
            if (inputList[i].barcode == inputArr[j].barcode) {
                commArr[i].name = inputArr[j].name;
                commArr[i].unit = inputArr[j].unit;
                commArr[i].price = inputArr[j].price;
            }
        }
    }
    return commArr;
}
//#3. 计算商品“小计”钱数      预计 10min，实际3min
function subtotal(inputList) {
    for(let i = 0; i < inputList.length; i++){
        var s = inputList[i].price*inputList[i].count;
        commArr[i].sum = s;
    }
    return commArr;
}

//#4. 判断商品是否为选出用户购物的满二减一的商品的条码,并将该商品“小计”钱数减其单价得到最终小计
//（调用loadPromotions()方法，得到discBC:[String];和用户购买物品的条码比对）   预计10min,实际15min
function whetherdis(inputList) {
    let discBC = loadPromotions();
    discBC = discBC[0].barcodes;
    for(let i = 0; i < discBC.length; i++) {
        for (let j = 0; j < inputList.length; j++) {
            if(discBC[i] == inputList[j].barcode){
                commArr[j].sum = commArr[j].sum - commArr[j].price;
            }
        }
    }
    return commArr;
}

//#5. 计算商品“总计”钱数     预计 5min，实际2min
function total(commArray) {
    var totalNum = 0;
    for(let i = 0; i < commArray.length; i++) {
        totalNum += commArray[i].sum;
    }
    return totalNum;
}

//#6. 打印输出清单           预计 15min，实际15min
function print() {
    let list = `***<没钱赚商店>收据***\n`;
    let saveMouney = 0;
    for(let i = 0; i < commArr.length; i++){
        list += `名称：${commArr[i].name}，数量：${commArr[i].count}${commArr[i].unit}，单价：${commArr[i].price.toFixed(2)}(元)，小计：${commArr[i].sum.toFixed(2)}(元)\n`;
        saveMouney += commArr[i].price*commArr[i].count;
    }
    saveMouney = saveMouney - total(commArr);
    list += `----------------------\n总计：${total(commArr).toFixed(2)}(元)\n节省：${saveMouney.toFixed(2)}(元)\n**********************`;
    return list;
}
