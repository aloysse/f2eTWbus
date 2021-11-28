const cityData = [
    { name: '臺北市', value: 'Taipei' },
    { name: '新北市', value: 'NewTaipei' },
    { name: '桃園市', value: 'Taoyuan' },
    { name: '臺中市', value: 'Taichung' },
    { name: '臺南市', value: 'Tainan' },
    { name: '高雄市', value: 'Kaohsiung' },
    { name: '基隆市', value: 'Keelung' },
    { name: '新竹市', value: 'Hsinchu' },
    { name: '新竹縣', value: 'HsinchuCounty' },
    { name: '苗栗縣', value: 'MiaoliCounty' },
    { name: '彰化縣', value: 'ChanghuaCounty' },
    { name: '南投縣', value: 'NantouCounty' },
    { name: '雲林縣', value: 'YunlinCounty' },
    { name: '嘉義縣', value: 'ChiayiCounty' },
    { name: '嘉義市', value: 'Chiayi' },
    { name: '屏東縣', value: 'PingtungCounty' },
    { name: '宜蘭縣', value: 'YilanCounty' },
    { name: '花蓮縣', value: 'HualienCounty' },
    { name: '臺東縣', value: 'TaitungCounty' },
    { name: '金門縣', value: 'KinmenCounty' },
    { name: '澎湖縣', value: 'PenghuCounty' },
    { name: '連江縣', value: 'LienchiangCounty' },
]

// 選取地區
const citySelect = document.querySelector('#citySelect');

function select() {
    let str = `<option value="" disabled selected hidden>請選擇縣市地區</option>`;
    cityData.forEach((item) => {
        str += `<option value="${item.value}">${item.name}</option>`
    })
    citySelect.innerHTML = str;
}
select();

// 路線名稱
const routeSearch = document.querySelector('#searchBus');

let city = '';
let routeName = '';

citySelect.addEventListener('change', function(e) {
    city = e.target.value;
    console.log('city', city)
})

// routeSearch.addEventListener('blur', function(e) {
//     routeName = e.target.value;
//     console.log('routeName', routeName)
// })


//切換鍵盤
function displayKey() {
    const numKey = document.querySelector('#numKeyboard');
    const otherKey = document.querySelector('#otherKeyboard');
    if (numKey.style.display == 'none') {
        numKey.style.display = 'block';
        otherKey.style.display = 'none';
    } else {
        numKey.style.display = 'none';
        otherKey.style.display = 'block';
    }
}

//顯示縣市選取標籤 (停用)
// function displayCitySelect() {
//     const citySelector = document.querySelector('#citySelector');
//     console.log(citySelector);
//     if (citySelector.style.display != 'none') {
//         citySelector.style.display = 'none';
//     } else {
//         citySelector.style.display = 'block';
//     }
// }

let searchBus = document.querySelector('#searchBus');

//偵測按鈕內容
function addText(btn) {
    const btnText = btn.innerHTML;
    let searchText = searchBus.value;
    searchText = searchText + btnText;
    searchBus.value = searchText;
    //賦予路線名稱變數
    routeName = routeSearch.value;
    console.log('routeName', routeName);
    getRoute();
}

//按鈕去掉一個字元
function deleteText() {
    let searchText = searchBus.value;
    searchText = searchText.substring(0, searchText.length - 1);
    searchBus.value = searchText;
    //賦予路線名稱變數
    routeName = routeSearch.value;
    console.log('routeName', routeName);
    getRoute();
}

//按鈕清楚所有文字
function reomveText() {
    let searchBus = document.querySelector('#searchBus');
    searchBus.value = "";
    //賦予路線名稱變數
    routeName = routeSearch.value;
    console.log('routeName', routeName);
}

//取得站牌資訊
function getRoute() {
    axios({
            method: 'get',
            //url: `https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/${city}/${routeName}`,
            url: `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${city}/${routeName}`,
            headers: GetAuthorizationHeader()
        })
        .then((response) => {
            // console.log('列表', response);
            const data = response.data;
            console.log(data.FareBufferZoneDescriptionZh);
            getStopInfo(data);
        })

}
searchBus.addEventListener('input', getRoute());


// citySelect.value.addEventListener('change', getRoute());



// API 驗證用
function GetAuthorizationHeader() {
    var AppID = '06e0002ba5fd4e73ac937592ec178fff';
    var AppKey = 'HDu_4NboqWQgCqqBIBCbzfCYaMo';

    var GMTString = new Date().toGMTString();
    var ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    var HMAC = ShaObj.getHMAC('B64');
    var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
    return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/ }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}



//整理站牌資訊
function getStopInfo(idata) {
    let stopList = document.querySelector('#stopList');
    let newData = {};
    let newDataItem = "";
    let NewstopList = '';
    let stopCardContent = '';
    if (routeSearch.value.length > 1 && citySelect.value != '') {
        idata.forEach(function(item) {
            newData.routeName = item.RouteName.Zh_tw;
            newData.city = item.City;
            newData.zone = item.FareBufferZoneDescriptionZh;
            newDataItem = item.RouteName.Zh_tw;
            // console.log(newDataItem);
            //渲染函式
            console.log(item.FareBufferZoneDescriptionZh);
            stopCardContent = renderStopCard(newData);
            NewstopList += stopCardContent;
        })
        stopList.innerHTML = NewstopList;
        console.log(newData);
    }

}


//渲染站牌卡片
function renderStopCard(dataContent) {
    // let cityTw = toZhCity(cityData, dataContent.city, cityTw);
    // console.log(cityTw);
    return `
    <li class="card border-2 rounded-12p border-main my-2 ">
    <div class="card-header d-flex justify-content-between bg-main-m">
        <span>${dataContent.routeName}</span>
        <span class="text-sec">${dataContent.city}</span>
    </div>
    <div class="card-body py-2">${dataContent.zone}</div>
</li>`;

}


//顯示資料縣市中文名稱
function toZhCity(arr, cityEn, cityZh) {
    arr.forEach(function(item) {
        if (item.value == cityEn) {
            cityZh = item.name;

        }
    })
    return cityZh;
}