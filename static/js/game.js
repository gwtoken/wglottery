import React from 'react';
import Tool from '../../src/common/tools';

let curChoiceNum = [[],[],[],[],[]];//数字
let starType = 1;//星级
let smallDouble = [0,0];//大小单双
const getLanguage = Tool.GetLanguage;
const offsetValue = Tool.offsetValue;
const curWidth = Tool.curWidth;
const curHeight = Tool.curHeight;
const mobileWidth = Tool.mobileWidth;
const mobileHeight = Tool.mobileHeight;
const textColorJson = Tool.textColorJson;


let contract = null;
let identity = null;
let eosInfo = null;
if(!Tool.CheckCurrentOs().isPc){
    window.netInfo = null;
    window.gameInfo = {};  
}


let isStartChange = false;
let needChangeNum = 0;
let starSecond = null;
let starTime = null;

const network = {
    blockchain: 'eos',
    host: '180.76.108.100',
    port: 8000,
    protocol: 'http',
    chainId: '1c6ae7719a2a3b4ecb19584a30ff510ba1b6ded86e1fd8b8fc22f1179c622a32'
}

document.addEventListener('scatterLoaded', async() => {   
    if(Tool.CheckCurrentOs().isPc){
        return;
    }
    console.log('scatterLoaded');
    const scatter = window.scatter;

    const eosOptions = {};
    const eos = window.eos = scatter.eos(network, Eos, eosOptions);

    netInfo = await eos.contract("eosiosscgame");
    console.log(netInfo);
    contract = await eos.contract('eosio.token');
    console.log(contract);

    identity = await scatter.getIdentity({ "accounts": [network] }).catch(function(error) {
        console.log(error);
    });
    if (identity) {
        gameInfo.accountsInfo = identity.accounts[0];
        console.log(identity.accounts[0]);
    }

    initEosInfo();
});

async function initEosInfo() {
    console.log("initEosInfo");

    if(!window.scatter){
    	return;
    }

    //平台信息
    var platform = await eos.getTableRows(true, "eosiosscgame", "eosiosscgame", "platform");
    gameInfo.platform = platform.rows[0];

    //console.log("gameInfo.platform",gameInfo.platform);

    //下级信息
    var accountinfor = await eos.getTableRows({"json":true,"code":"eosiosscgame","scope":"eosiosscgame","table":"accountinfor","limit":1000000});
    var rowInfo = accountinfor.rows;
    gameInfo.accountinfor = [];
    if(gameInfo.accountsInfo && rowInfo){
    	for(var i = 0; i < rowInfo.length; i++){
    		if(rowInfo[i].visitor == gameInfo.accountsInfo.name){
    			gameInfo.accountinfor.push(rowInfo[i]);
    		}
    		if(!gameInfo.superior && rowInfo[i].name == gameInfo.accountsInfo.name){
    			gameInfo.superior = rowInfo[i].visitor;
    		}	
    	}
    }
    //console.log("gameInfo.accountinfor",gameInfo.accountinfor);
    
    //投注信息
    if(gameInfo.accountsInfo){
	    var bethistoryer = await eos.getTableRows({"json":true, "code":"eosiosscgame","scope":gameInfo.accountsInfo.name,"table":"bettemprs","limit":100});
	    gameInfo.bethistoryer = bethistoryer.rows;
	    //console.log("gameInfo.bethistoryer",gameInfo.bethistoryer);   	
    }

    //开奖信息
    gameInfo.openWinInfo = [];
    var openWinInfo = await eos.getTableRows({"json":true, "code":"eosiosscgame", "scope":"eosiosscgame", "table":"lotttemps","limit":200});
    gameInfo.openWinInfo = openWinInfo.rows;
    //console.log("gameInfo.openWinInfo",openWinInfo.rows);

    if(gameInfo.accountsInfo){
    	await eos.getCurrencyBalance({"code":"eosio.token","account":gameInfo.accountsInfo.name,"symbol":"EOS"}).then(function(resp){eosInfo = resp});
    	//console.log(eosInfo[0]);
    }   
}

if(!Tool.CheckCurrentOs().isPc){
    if(window.initEosInfo){
        clearInterval(window.initEosInfo);
    }
    window.initEosInfo = setInterval(initEosInfo, 5000);  
}


class Game extends React.Component {
    constructor(...args){
        super(...args);
        this.state = {
                        gameInfo:getLanguage("gameInfo"),//奖池信息
                        lotteryNum:[{"lottery":"","num":""},{"lottery":"","num":""}],//开奖信息
                        blockInfo:[{'blockNum':'','blockValue':'','createTime':'','isStart':false,'lastStr':''},
                                   {'blockNum':'','blockValue':'','createTime':'','isStart':false,'lastStr':''},
                                   {'blockNum':'','blockValue':'','createTime':'','isStart':false,'lastStr':''}],
                        buttonName:getLanguage("buttonName"),//星级文本
                        choiceItem:getLanguage("choiceItem"),//个十百千万
                        choiceType:getLanguage("choiceType"),//大小单双
                        choiceNum:[0,1,2,3,4,getLanguage("choiceNum"),5,6,7,8,9,10],
                        choiceText:["","","","",""],
                        eosMax:[100,100,10,1,0.1],
                        inputText:0,//输入框金额
                        betNum:0,//注数
                        allBlaceNum:0,//下注所需总金额
                        pageName:getLanguage("itemInfo")[0],//当前页面名称
                        useName:"",//玩家名称
                        userBal:0,//玩家账户余额
                        balance:getLanguage("balance"),//金额文本
                        results:getLanguage("results"),//最新开奖文本
                        no:getLanguage("No"),
                        stage:getLanguage("stage"),
                        curSeconds:0,//秒数倒计时
                        curTime:0,//当前时间
                        balanceName:"",
                       	balanceNum:0,//奖池金额
                       	curBetBalance:0,//已下注金额,
                       	blockInfoText:getLanguage("blockInfo"),//区块链信息文本
                       	selection:getLanguage("selection"),//选择号码文本
                       	count:getLanguage("count"),//当前注数文本
                       	userBalText:getLanguage("useBal"),//余额文本
                       	buyTypeSty:["1/2","2X","MAX"],//购买类型文本,
                       	selectNum:getLanguage("selectNum"),//已选号码文本,
                       	confirm:getLanguage("confirm"),//确定文本
        };
		let webS = new WebSocket('ws://180.76.167.228:8080/v1/p2p');
		webS.onmessage = (evt) =>{
			gameInfo.eosMessage = [];
			gameInfo.eosMessage.unshift(evt);
			this.changeEosInfo();
		}
    }

    componentDidMount(){

        let initButtonName = document.getElementsByName("buttonName");
        initButtonName[0].style.color = textColorJson.textColor_5;
        this.buttonName = initButtonName[0];

        let initChoiceItem = document.getElementsByName("choiceItem");
        this.choiceItem = initChoiceItem[0];
        this.choiceItem.style.color = textColorJson.textColor_5;

        var choiceItemImg = document.getElementsByName("choiceItemImg");
        choiceItemImg[0].style.backgroundImage = "url(./static/img/example/daxiao_cur.png)";

        let choiceItemPage = document.getElementById("choiceItemPage");
        choiceItemPage.style.display = "none";
    }

    changeSeconds = () => {
    	//console.log("刷新时间");
    	var sec = "";
    	var curTimeStr = "";  	
    	if(starSecond > 0){
    		starSecond--;
    		sec = starSecond < 10?("00:0" + starSecond):("00:" + starSecond);
    		if(starSecond == 0){
    			starSecond = 60;
    		}
    		starTime += 1000;
    		var timeDate = new Date(starTime);
    		curTimeStr = (timeDate.getHours() < 10?("0" + timeDate.getHours()):timeDate.getHours()) 
    					+ ":" + (timeDate.getMinutes() < 10?("0" + timeDate.getMinutes()):timeDate.getMinutes());
    	}else{
    		var curDate = new Date();
    		sec = 60 - curDate.getSeconds();
    		sec = sec == 60?"01:00":(sec < 10?"00:0"+sec:"00:"+sec);
    		curTimeStr = (curDate.getHours() >= 10?curDate.getHours():"0"+curDate.getHours()) + "：" + (curDate.getMinutes() >= 10?curDate.getMinutes():"0"+curDate.getMinutes());
    	}

    	var thisName = this.state.useName;
    	if(gameInfo.accountsInfo && this.state.useName == ""){
    		thisName = gameInfo.accountsInfo.name;
    	}

    	var thisUserBal = this.state.userBal;
    	if(eosInfo){
    		thisUserBal = Number(eosInfo[0].replace(" EOS",""));
    	}

    	var thisBalanceName = this.state.balanceName;
    	var thisBalanceNum = this.state.balanceNum;
    	var thisCurBetBalance = this.state.curBetBalance;
    	if(gameInfo.platform){
    		thisBalanceNum = Number(gameInfo.platform.all_balance.replace(" EOS",""));
    		thisCurBetBalance = gameInfo.platform.buylimit*0.0001;
    		if(this.state.balanceName == ""){
    			thisBalanceName = gameInfo.platform.owner;
    		}
    	}

    	var lotteryNum = this.state.lotteryNum;
    	if(gameInfo.openWinInfo && gameInfo.openWinInfo.length > 0){
            var openWin = gameInfo.openWinInfo.slice(0);
            //console.log("********************",openWin);
    		for(var i = 0;i < 2;i++){
    			var openInfo = openWin[openWin.length - 1 - i];
    			if(openInfo){
    				lotteryNum[i].lottery = openInfo.idlott;
    				lotteryNum[i].num = openInfo.numinfo;
    			}    			
    		}
    	}
    	this.setState({
    		useName:thisName,
    		userBal:thisUserBal,
    		balanceName:thisBalanceName,
    		balanceNum:thisBalanceNum,
    		curBetBalance:thisCurBetBalance,
    		curSeconds:sec,
    		curTime:curTimeStr,
    		lotteryNum:lotteryNum
    	});
    	//this.props.refreshState();
    }

    changeEosInfo = () => {
    	var thisBlockInfo = this.state.blockInfo.slice(0);
    	//console.log("******************");
    	var myReg = new RegExp("^[0-9]*$");
    	var curEosMessage = gameInfo.eosMessage.slice(0);
    	if(thisBlockInfo.length == 3){
    		thisBlockInfo = thisBlockInfo.slice(0,2);
    	}
    	if(curEosMessage && curEosMessage.length > 0){
    		var eosMesData = JSON.parse(curEosMessage[0].data);
    		if(eosMesData.type == 2){
	    		//游戏开奖
	    		isStartChange = true;    			
    		}else if(eosMesData.type == 3){
    			//系统时间戳
    			var dateInfo = new Date(eosMesData.now + "Z");
    			starSecond = 60 - dateInfo.getSeconds();
    			starTime = dateInfo.getTime();
    			console.log("时间戳信息",eosMesData);
				if(window.changeTime){
				    clearInterval(window.changeTime);
				}
				window.changeTime = setInterval(this.changeSeconds,1000);
    		}else{
    			var info = {};
    			if(eosMesData.data){
	    			info.blockNum = eosMesData.data.block_num;
	    			var blockValue = "..." + ((Tool.CheckCurrentOs().isPc == true)?eosMesData.data.id.substr(30):eosMesData.data.id.substr(45));
	    			info.blockValue = blockValue.substr(0,blockValue.length - 1);
	    			var lastStr = blockValue[blockValue.length - 1];
	    			info.isStart = false;
	    			if(myReg.test(lastStr) && isStartChange){
	    				info.isStart = true;
	    				needChangeNum++;
	    			}
	    			info.lastStr = lastStr;
	    			if(needChangeNum == 5){
	    				needChangeNum = 0;
	    				isStartChange = false;
	    			}
	    			var lastTime = eosMesData.data.timestamp.substr(eosMesData.data.timestamp.length - 4,2);
	    			var timestamp = eosMesData.data.timestamp + "Z";
	    			var curTampTime = new Date(timestamp);
	    			var curPmAm = curTampTime.toLocaleTimeString().substr(0,2);
	    			curTampTime = curTampTime.toLocaleTimeString().substr(2) + lastTime;
	    			if(curPmAm == "下午"){
	    				var timeList = curTampTime.split(":");
	    				timeList[0] = Number(timeList[0]) + 12;
	    				var time = "";
	    				for(var i = 0; i < timeList.length; i++){
	    					time += i < timeList.length - 1 ? (timeList[i] + ":") : timeList[i];
	    				}
	    				curTampTime = time;
	    			}
	    			info.createTime = curTampTime;
	    			thisBlockInfo.unshift(info);
    			}
    			this.setState({blockInfo:thisBlockInfo});
    		}
    	}
    }

    initGame(){

        let initButtonName = document.getElementsByName("buttonName");
        for(var i = 0; i < initButtonName.length; i++){
        	var curBut = initButtonName[i];
        	curBut.style.color = textColorJson.textColor_1;
        }

        initButtonName[0].style.color = textColorJson.textColor_5;
        this.buttonName = initButtonName[0];

        let initChoiceItem = document.getElementsByName("choiceItem");
        var choiceItemImg = document.getElementsByName("choiceItemImg");
        for(var i = 0; i < initChoiceItem.length;i++){
        	var curItem = initChoiceItem[i];
        	curItem.style.color = textColorJson.textColor_1;
        	choiceItemImg[i].style.backgroundImage = "url(./static/img/example/daxiao.png)";
        }

        this.choiceItem = initChoiceItem[0];
        this.choiceItem.style.color = textColorJson.textColor_5;
        
        choiceItemImg[0].style.backgroundImage = "url(./static/img/example/daxiao_cur.png)";

        let choiceItemPage = document.getElementById("choiceItemPage");
        choiceItemPage.style.display = "none";

        let choiceTypePage = document.getElementById("choiceTypePage");
        choiceTypePage.style.display = "block";

        let choiceType = document.getElementsByName("choiceType");
        var choiceTypeImg = document.getElementsByName("choiceTypeImg");
        for(var i = 0; i < choiceType.length;i++){
            let curDoc = choiceType[i];
            curDoc.style.color = textColorJson.textColor_1; 
            if(choiceTypeImg[i]){
            	choiceTypeImg[i].style.backgroundImage = "url(./static/img/example/daxiao.png)";
            }            
        }

        if(this.starImg == null){
            this.starImg = document.getElementById("starImg");
        }
        this.starImg.style.left = (curWidth/5 - offsetValue(1,100))*0.5 + "px";

        curChoiceNum = [[],[],[],[],[]];
        starType = 1;
        smallDouble = [0,0];
        this.setState({choiceText:["","","","",""],inputText:0,betNum:0,allBlaceNum:0});
        this.initNumBtn();       
    }

    initNumBtn(){
        let choiceNum = document.getElementsByName("choiceNum");
        for(var i = 0;i < choiceNum.length;i++){
            let curDoc = choiceNum[i];
            curDoc.style.color = "white";
            curDoc.style.backgroundImage = "url(./static/img/example/shuzi.png)";
        }

        let index = parseInt(this.choiceItem.getAttribute("data-index"));
        let curNumInfo = curChoiceNum[index - 1];
        if(curNumInfo.length > 0){
            for(var i = 0;i < choiceNum.length;i++){
                let curDoc = choiceNum[i];
                if(curNumInfo.indexOf(i) > -1){
                    curDoc.style.color = textColorJson.textColor_5;
                    curDoc.style.backgroundImage = "url(./static/img/example/shuzi_cur.png)";
                }           
            }            
        }
    }

    //刷新注数和金额
    refreshBet = (curV) => {

        let curdigitIndex = this.buttonName.getAttribute("data-index");
        let curBetNum = 1;
        if(curdigitIndex == 1){
            curBetNum = curChoiceNum[0].length;
            for(var i = 0; i < smallDouble.length; i++){
                if(smallDouble[i] > 0){
                    curBetNum++;
                }
            }
        }else{

            for(var i = 0; i < curdigitIndex;i++){
                curBetNum *= curChoiceNum[i].length;
            }            
        }
        let value = curV >= 0?(curBetNum*curV):(curBetNum*this.state.inputText);
        console.log("当前下注金额是",value,curBetNum,this.state.inputText,curChoiceNum);
        this.setState({betNum:curBetNum});
        this.setState({allBlaceNum:value.toFixed(4)});
        this.setState({choiceText:["","","","",""]});
        if(curBetNum > 0){
            if(curdigitIndex == 1){
                var str = "";
                if(smallDouble[0] > 0 && smallDouble[1] > 0){
                	str = smallDouble[0] == 1?this.state.choiceType[0]:this.state.choiceType[1];
                	str += "," + (smallDouble[1] == 1?this.state.choiceType[2]:this.state.choiceType[3]);
                }else{
                	str = smallDouble[0] > 0?(smallDouble[0] == 1?this.state.choiceType[0]:this.state.choiceType[1]):(smallDouble[1] > 0?(smallDouble[1] == 1?this.state.choiceType[2]:this.state.choiceType[3]):"");                	
                }
                str += (curChoiceNum[0] != null && curChoiceNum[0] != "")?((str != "")?("," + curChoiceNum[0].join("")):curChoiceNum[0].join("")):"";
                console.log(str);
				this.setState({choiceText:[str,"","","",""]}); 
            }else{
                let curA = [];
                for(var i = 0; i < curChoiceNum.length; i++){
                	curA.push((i <= curdigitIndex - 1)?curChoiceNum[i].join(""):"");
                }
                console.log(curA);
                this.setState({choiceText:curA});
            }
        }else{

            let curA = [];
            for(var i = 0; i < curChoiceNum.length; i++){
               	curA.push((i <= curdigitIndex - 1)?curChoiceNum[i].join(""):"");
            }
            console.log(curA);
            this.setState({choiceText:curA});
        }
    }

    //星级选择
    starClick = (event) =>{
        let index = parseInt(event.target.getAttribute('data-index'));
        
        if(this.buttonName){
        	let lostIndex = parseInt(this.buttonName.getAttribute('data-index'));
        	if(index == lostIndex){
        		return;
        	}
        	this.buttonName.style.color = textColorJson.textColor_1;
        }
        console.log(index);
        var choiceItemImg = document.getElementsByName("choiceItemImg");
        this.buttonName = event.target;
        this.buttonName.style.color = textColorJson.textColor_5;

        if(this.starImg == null){
            this.starImg = document.getElementById("starImg");
        }
        this.starImg.style.left = (curWidth/5 - offsetValue(1,100))*0.5 + curWidth/5*(index - 1) + "px";

        let choiceItemPage = document.getElementById("choiceItemPage");
        let choiceTypePage = document.getElementById("choiceTypePage");
                
        if(index > 1){	        
	        choiceItemPage.style.display = "block";	        
	        choiceTypePage.style.display = "none";
	        var choiceItemDiv = document.getElementsByName("choiceItemDiv");
	        for(var i = 0; i < choiceItemDiv.length;i++){
	        	var item = choiceItemDiv[i];
	        	item.style.display = i <= index - 1?"block":"none";
	        }
	        if(this.choiceItem != null && this.choiceItem.getAttribute("data-index") > index){
	        	var itemIndex = parseInt(this.choiceItem.getAttribute("data-index"));
	            this.choiceItem.style.color = textColorJson.textColor_1;
	            choiceItemImg[itemIndex - 1].style.backgroundImage = "url(./static/img/example/daxiao.png)";
	            var choiceItem = document.getElementsByName("choiceItem");
	            this.choiceItem = choiceItem[index - 1];
	            this.choiceItem.style.color = textColorJson.textColor_5;
	            choiceItemImg[index - 1].style.backgroundImage = "url(./static/img/example/daxiao_cur.png)";
	            this.initNumBtn();
	        }
        }else{
	        choiceItemPage.style.display = "none";	        
	        choiceTypePage.style.display = "block";        	
        }

        starType = index;
        if(this.state.inputText > this.state.eosMax[index - 1]){
            this.setState({inputText:this.state.eosMax[index - 1]});
            this.refreshBet(this.state.eosMax[index - 1]);
        }else{
            this.refreshBet();
        }
    }

    //位数类型选择 个 十 百 千 万
    digitClick = (event) => {
    	let index = parseInt(event.target.getAttribute('data-index'));
    	var choiceItemImg = document.getElementsByName("choiceItemImg");
        if(this.buttonName != null && this.buttonName.getAttribute('data-index') < event.target.getAttribute('data-index')){            
            return;
        }
        if(this.choiceItem != null){
        	let lostIndex = parseInt(this.choiceItem.getAttribute('data-index'));
        	if(index == lostIndex){
        		return;
        	}
            this.choiceItem.style.color = textColorJson.textColor_1;           
            choiceItemImg[lostIndex - 1].style.backgroundImage = "url(./static/img/example/daxiao.png)";
        }
        console.log(index);
        this.choiceItem = event.target;
        this.choiceItem.style.color = textColorJson.textColor_5;
        choiceItemImg[index - 1].style.backgroundImage = "url(./static/img/example/daxiao_cur.png)";
        this.initNumBtn();        
    }

    //大小单双选择
    numTypeClick = (event) => {
        console.log(event.target.getAttribute('data-index'));
       	let index = parseInt(event.target.getAttribute('data-index'));
       	var choiceTypeImg = document.getElementsByName("choiceTypeImg");
        if(index < 3){
            if(this.smallType != null){
                if(index == this.smallType.getAttribute("data-index")){
                    this.smallType = null;
                    event.target.style.color = textColorJson.textColor_1;
                    choiceTypeImg[index - 1].style.backgroundImage = "url(./static/img/example/daxiao.png)";
                    smallDouble[0] = 0;
                }else{
                	var lostIndex = this.smallType.getAttribute("data-index");
                    this.smallType.style.color = textColorJson.textColor_1;
                    choiceTypeImg[lostIndex - 1].style.backgroundImage = "url(./static/img/example/daxiao.png)";
                    this.smallType = event.target;
                    this.smallType.style.color = textColorJson.textColor_5;
                    choiceTypeImg[index - 1].style.backgroundImage = "url(./static/img/example/daxiao_cur.png)";
                    smallDouble[0] = index;
                }
            }else{
                this.smallType = event.target;
                this.smallType.style.color = textColorJson.textColor_5;
                choiceTypeImg[index - 1].style.backgroundImage = "url(./static/img/example/daxiao_cur.png)";
                smallDouble[0] = index;               
            }
            //大或小
        }else{
        	if(index == 5){
        		var choiceType = document.getElementsByName("choiceType");
        		for(var i = 0;i < choiceType.length - 1;i++){
        			var curBtn = choiceType[i];
        			curBtn.style.color = textColorJson.textColor_1;
        			if(choiceTypeImg[i]){
        				choiceTypeImg[i].style.backgroundImage = "url(./static/img/example/daxiao.png)";
        			}        			
        		}
        		smallDouble[0] = smallDouble[1] = 0;
        	}else{
	            if(this.doubleType != null){
	                if(index == this.doubleType.getAttribute("data-index")){
	                    this.doubleType = null;
	                    event.target.style.color = textColorJson.textColor_1;
	                    choiceTypeImg[index - 1].style.backgroundImage = "url(./static/img/example/daxiao.png)";
	                    smallDouble[1] = 0;
	                }else{
	                	var lostIndex = this.doubleType.getAttribute("data-index");
	                    this.doubleType.style.color = textColorJson.textColor_1;
	                    choiceTypeImg[lostIndex - 1].style.backgroundImage = "url(./static/img/example/daxiao.png)";
	                    this.doubleType = event.target;
	                    this.doubleType.style.color = textColorJson.textColor_5;
	                    smallDouble[1] = index - 2;
	                    choiceTypeImg[index - 1].style.backgroundImage = "url(./static/img/example/daxiao_cur.png)";
	                }
	            }else{
	                this.doubleType = event.target;
	                this.doubleType.style.color = textColorJson.textColor_5; 
	                smallDouble[1] = index - 2; 
	                choiceTypeImg[index - 1].style.backgroundImage = "url(./static/img/example/daxiao_cur.png)";             
	            }         		
        	}                        
        }
        console.log("大小单双数组",smallDouble);
        this.refreshBet();
    }

    //数字选择 0-9
    numClick = (event) => {
        console.log(event.target.getAttribute('data-index'));
        let curEvent = event.target;
        let index = parseInt(curEvent.getAttribute('data-index'));
        let curdigitIndex = this.choiceItem.getAttribute("data-index");
        let curNumInfo = curChoiceNum[curdigitIndex - 1];
        if(curNumInfo.length > 0 && curNumInfo.indexOf(index) > -1){
            curNumInfo.splice(curNumInfo.indexOf(index),1);
            console.log(curNumInfo);
        }else{
			curNumInfo.push(index);           
            curNumInfo.sort();
        }
        curChoiceNum[curdigitIndex - 1] = curNumInfo;
        curEvent.style.color = (curEvent.style.color != "white")?"white":textColorJson.textColor_5;
        var imgUrl = "url(./static/img/example/";
        console.log(curEvent.style.color);
        curEvent.style.backgroundImage = (curEvent.style.color != "white")?(imgUrl + "shuzi_cur.png)"):(imgUrl + "shuzi.png)");
        this.refreshBet();
    }

    //选择注数翻倍情况
    betsTypeClick = (event) =>{
        console.log(event.target.getAttribute('data-index'));
        let index = parseInt(event.target.getAttribute('data-index'));        
        let curdigitIndex = parseInt(this.buttonName.getAttribute("data-index"));
        let maxValue = this.state.eosMax[curdigitIndex - 1];
        let value = 0;
        if(index == 3){
        	if(Number(this.state.inputText == maxValue)){
        		this.startShowMsg(getLanguage("TIP_15"));
        		return;
        	}
            value = maxValue;
        }else if(index == 2){
        	if(Number(this.state.inputText == maxValue)){
        		this.startShowMsg(getLanguage("TIP_15"));
        		return;
        	}
        	if(this.state.inputText == 0){
        		this.startShowMsg(getLanguage("TIP_9"));
        		return;
        	}
            let curValue = this.state.inputText*2;
            value = curValue > maxValue?maxValue:curValue;
        }else{
        	if(Number(this.state.inputText) > 0 &&  Number(this.state.inputText) <= 0.1){
        		this.startShowMsg(getLanguage("TIP_16"));
        		return;
        	}
            let curValue = this.state.inputText*0.5;
            value = curValue > 0.1?curValue:0.1;
        }
        console.log("注数翻倍导致的金额变化为",value);
        this.setState({inputText:Number(value.toFixed(4))});
        this.refreshBet(value);
    }

    //全选
    allNumChoice = (event) => {
        
        let curdigitIndex = this.choiceItem.getAttribute("data-index");       
        let curNumInfo = curChoiceNum[curdigitIndex - 1];
        curNumInfo = [];
        let choiceNum = document.getElementsByName("choiceNum");
        for(var i = 0;i < choiceNum.length;i++){
            let curDoc = choiceNum[i];
            curDoc.style.color = textColorJson.textColor_5;
            curDoc.style.backgroundImage = "url(./static/img/example/shuzi_cur.png)";
            curNumInfo.push(i);
        }
        curChoiceNum[curdigitIndex - 1] = curNumInfo;
        
        console.log("全选",curdigitIndex,curNumInfo,curChoiceNum);
        this.refreshBet();
    }

    //撤销
    noNumChoice = (event) => {
        console.log("撤销选择");
        let choiceNum = document.getElementsByName("choiceNum");
        let curdigitIndex = this.choiceItem.getAttribute("data-index");
        curChoiceNum[curdigitIndex - 1] = [];
        for(var i = 0;i < choiceNum.length;i++){
            let curDoc = choiceNum[i];
            curDoc.style.color = "white";
            curDoc.style.backgroundImage = "url(./static/img/example/shuzi.png)";
        }
        this.refreshBet();
    }

    //输入框
    inputChange = (event) => {
        console.log(event.target.value);
        let value = event.target.value;
        var myReg = new RegExp("^[0-9.]*$");
        if (!myReg.test(value)){
            value = "";
        }else{
            if(value.indexOf(".") == 0){
                value = "0" + value;
            }else if(value.indexOf(".") > 0){
                var index = 0;
                for(var i = 0; i < value.length;i++){
                    if(value.charAt(i) == "."){
                        index++;
                        if(index > 1){
                            value = value.substr(0,i);
                            break;
                        }
                    }
                }
            }
        }
        let starIndex = parseInt(this.buttonName.getAttribute("data-index"));
        let eosMax = this.state.eosMax[starIndex - 1];
        let curValue = Number(value);
        if(curValue == 0){
            curValue = value;
        }else{
            if(value.length > 1 && curValue >= 1){
                curValue = curValue > eosMax?eosMax:(Number(value[0]) != 0 ? value:curValue);

            }else{
                curValue = (curValue > 0 && curValue < 0.1)?0.1:(curValue > eosMax?eosMax:curValue); 
            } 
            if(typeof(curValue) == "number"){
                if(curValue.toString().length > 6){
                    curValue = Number(curValue.toFixed(4));
                }                
            }else{
                if(curValue.length > 6){
                    curValue = Number(Number(curValue).toFixed(4));
                }
            }         

            console.log("输入框的内容是",curValue);
        }       
        if(curValue == ""){
        	curValue = 0;
        }
        this.setState({inputText:curValue});
        this.refreshBet(curValue);
    }

    //下注
    buyClick = async (event) => {

        if(!gameInfo.accountsInfo || !contract){
        	this.startShowMsg(getLanguage("TIP_19"));
            return;
        }

    	if(parseInt(this.state.betNum) == 0){
    		this.startShowMsg(getLanguage("TIP_12"));
    		return;
    	}

        //console.log("当前下注确定",Number(this.state.allBlaceNum),this.state.inputText,gameInfo.accountsInfo,contract);
        if(Number(this.state.allBlaceNum) == 0 || this.state.inputText == 0){
        	this.startShowMsg(getLanguage("TIP_8"));
            return;
        }

        if(this.state.userBal < Number(this.state.allBlaceNum)){
			this.startShowMsg(getLanguage("TIP_14"));
            return;        	
        }

        var limitBalance = Number(this.state.balanceNum*0.05);
        console.log(limitBalance,Number(this.state.allBlaceNum),limitBalance - Number(this.state.curBetBalance));
        if(limitBalance > 0 && Number(this.state.allBlaceNum) >= limitBalance - Number(this.state.curBetBalance)){
        	this.startShowMsg(getLanguage("TIP_13"));
        	return;
        } 

        let betInfo = starType.toString() + "|";
        for(var i = 0; i < curChoiceNum.length; i++){
            if(i <= starType - 1){
                betInfo += (curChoiceNum[i].toString().length == 0?"10":curChoiceNum[i].toString()) + "|";
            }else{
                betInfo += "10|";
            }
        }
        betInfo += smallDouble.toString();
        console.log("当前下注信息",betInfo,this.state.allBlaceNum);      
        const data = {
            from: gameInfo.accountsInfo.name,
            to: "eosiosscgame",
            quantity: this.state.allBlaceNum + " EOS",
            memo: betInfo
        }
        var transfer = await contract.transfer(data, {
            authorization: [gameInfo.accountsInfo.name + '@active']
        }).catch(console.error);

        if(transfer && transfer.broadcast){
        	this.startShowMsg(getLanguage("TIP_10"));
        	console.log("充值结果成功");
            initEosInfo();
        }
        console.log(transfer);
        this.initGame();
    }
    
    changeGameLanguage = (event) => {
    	console.log("Game里的改变语言方法");
    	this.setState({
    		gameInfo:getLanguage("gameInfo"),//奖池信息
            buttonName:getLanguage("buttonName"),//星级文本
            choiceItem:getLanguage("choiceItem"),//个十百千万
            choiceType:getLanguage("choiceType"),//大小单双 
            choiceNum:[0,1,2,3,4,getLanguage("choiceNum"),5,6,7,8,9,10],
            pageName:getLanguage("itemInfo")[0],//当前页面名称
            balance:getLanguage("balance"),//金额文本
            results:getLanguage("results"),//最新开奖文本
            no:getLanguage("No"),
            stage:getLanguage("stage"),
            blockInfoText:getLanguage("blockInfo"),//区块链信息文本
            selection:getLanguage("selection"),//选择号码文本
            count:getLanguage("count"),//当前注数文本
            userBalText:getLanguage("useBal"),//余额文本
            selectNum:getLanguage("selectNum"),//已选号码文本,
            confirm:getLanguage("confirm"),//确定文本
    	}); 
    	setTimeout(this.refreshBet,100);
    }

    startShowMsg = (str) =>{
    	Tool.SetMsgInfo(str);
    	this.props.showTipMsg();
    }

	render() {
		var curBalance = this.state.userBalText + this.state.userBal.toFixed(4);
		var curStage = "";
		if(gameInfo && gameInfo.platform){
			curStage = this.state.no + gameInfo.platform.current_vision + this.state.stage;
		}
		var balanceNum = this.state.balanceNum.toFixed(4) + "EOS";
		var limitBalance = Number(this.state.balanceNum*0.05);
		var curBetBalance = this.state.curBetBalance>=100?(Number(this.state.curBetBalance*0.001).toFixed(1) + "k"):this.state.curBetBalance.toFixed(1);
		var curLimitBalance = "/" + (limitBalance>=100?(Number(limitBalance*0.001).toFixed(1) + "k"):limitBalance.toFixed(1));
		var limitPre = ((limitBalance != 0)?(parseInt(this.state.curBetBalance/limitBalance*100)):"0") + "%";

	    return (
	    	<div style = {styleInfo.centerDiv}>
	    		<div style = {styleInfo.topDiv}>
	    			<div style = {styleInfo.topLeftDiv}>
	    				<div style = {styleInfo.useInfo}>
	    					<div style = {styleInfo.useName}>{this.state.useName}</div>
	    					<div style = {styleInfo.userBal}>{curBalance}</div>
	    				</div>
	    				<div style = {styleInfo.winNumInfo}>
	    					<div style = {styleInfo.winTip}>
	    						<p style = {styleInfo.tipText}>{this.state.results}</p>
	    					</div>
	    					<div style = {styleInfo.winInfo}>
	    						<div style = {styleInfo.oneLottety}>
	    							<div style = {styleInfo.lottetyNum}>{this.state.lotteryNum[0].lottery}</div>
	    							<div style = {styleInfo.winNum}>{this.state.lotteryNum[0].num}</div>
	    						</div>
	    						<div style = {styleInfo.twoLottety}>
	    							<div style = {styleInfo.lottetyNum}>{this.state.lotteryNum[1].lottery}</div>
	    							<div style = {styleInfo.winNum}>{this.state.lotteryNum[1].num}</div>	    							
	    						</div>
	    					</div>
	    				</div>
	    			</div>
	    			<div style = {styleInfo.topRightDiv}>
	    				<div style = {styleInfo.topRightDiv_1}>
	    					<div style = {styleInfo.topRightDiv_1_1}>{curStage}</div>
	    					<div style = {styleInfo.topRightDiv_1_2}>{this.state.curTime}</div>
	    				</div>
	    				<div style = {styleInfo.topRightDiv_2}>
	    					<div style = {styleInfo.topRightDiv_com}>{this.state.gameInfo[0]}</div>
	    					<div style = {styleInfo.topRightDiv_2_com}>{this.state.balanceName}</div>
	    				</div>
	    				<div style = {styleInfo.topRightDiv_3}>
	    					<div style = {styleInfo.topRightDiv_com}>{this.state.gameInfo[2]}</div>
	    					<div style = {styleInfo.topRightDiv_3_1}>
	    						<div style = {styleInfo.tRDiv_1}>
	    							<div style = {styleInfo.tRDiv_1_1}>{curBetBalance}</div>
	    							<div style = {styleInfo.tRDiv_1_2}>{curLimitBalance}</div>
	    						</div>
	    						<div style = {styleInfo.tRDiv_2}>{limitPre}</div>
	    					</div>
	    				</div>
	    				<div style = {styleInfo.topRightDiv_4}>
	    					<div style = {styleInfo.topRightDiv_com}>{this.state.gameInfo[1]}</div>
	    					<div style = {styleInfo.topRightDiv_2_com}>{balanceNum}</div>
	    				</div>
	    			</div>
	    		</div>
	    		<div style = {styleInfo.cenDivCen}>
	    			<div style = {styleInfo.cenTopDiv}>
	    				<div style = {styleInfo.cenTopImg}></div>
	    				<div style = {styleInfo.cenTopText}>{this.state.blockInfoText}</div>
	    				<div style = {styleInfo.cenTopTime}>
	    					<div style = {styleInfo.cenTopTimeImg}></div>
	    					<div style = {styleInfo.cenTopTimeSeconds}>{this.state.curSeconds}</div>
	    				</div>
	    			</div>
	    			<div style = {styleInfo.cenBotDiv}>
	                    { 
	                       	this.state.blockInfo.map((item, index) => {
		                        return (  
		                            <div key = {index} style = {styleInfo["blockInfo_" + index]}>
		                                <div style={styleInfo.blockNumDiv}>{item.blockNum}</div>
		                                <div style={styleInfo.blockValueDiv}>
		                                	<span>{item.blockValue}</span>
		                                	<span style = {{color:item.isStart?textColorJson.textColor_5:textColorJson.textColor_1}}>{item.lastStr}</span>
		                                </div>
		                                <div style={styleInfo.blockTimeDiv}>{item.createTime}</div>
		                            </div>
		                        );
	                       	}) 
	                    }
	    			</div>
	    		</div>
	    		<div style = {styleInfo.botDiv}>
	    			<div style = {styleInfo.botTopDiv}>
	    				<div style = {styleInfo.botTopImg}></div>
	    				<div style = {styleInfo.botTopText}>{this.state.selection}</div>
	    			</div>
	    			<div style = {styleInfo.botOneDiv}>
	    				<div style = {styleInfo.botOneLeft}>
	    					<div style = {styleInfo.botOne_com_1}>{this.state.count}</div>
	    					<div style = {styleInfo.botOne_com_2}>
	    						<div style = {styleInfo.botOne_com_1_1}>{this.state.betNum}</div>
	    					</div>
	    				</div>
	    				<div style = {styleInfo.botOneRight}>
	    					<div style = {styleInfo.botOne_com_3}>{this.state.balance}</div>
	    					<div style = {styleInfo.botOne_com_4}>
	    						<div style = {styleInfo.botOne_com_2_1}>{this.state.allBlaceNum}</div>
	    					</div>
	    				</div>
	    			</div>
	    			<div style = {styleInfo.starInfoDiv}>
	    				<div style = {styleInfo.starDiv}>
	    					{
	    						this.state.buttonName.map((item,index) =>{
	    						var curStyle = {	
	    											width:curWidth/5,
													height:offsetValue(2,40),
													position:"absolute",
													textAlign:"center",
													lineHeight:offsetValue(2,40) + "px",
													fontSize:offsetValue(3,18),
													color:textColorJson.textColor_1,
													left:curWidth/5*index
												};
	    							return(
	    								<div key = {index + 1} 
	    									style = {curStyle}
	    									onClick={this.starClick}
                                            data-index={index + 1}
                                            name="buttonName"
	    								>{item}</div>
	    							);
	    						})
	    					}
	    				</div>
	    				<div id = "starImg" style = {styleInfo.choiceStarImg}></div>
	    				<div style = {styleInfo.starLineDiv}></div>
	    			</div>
	    			<div style = {styleInfo.choiceType}>
	    				<div id = "choiceTypePage" style = {styleInfo.typeButDiv}>
	    					{
	    						this.state.choiceType.map((item,index) =>{
	    							var curStyle = {
		    											width:(curWidth - offsetValue(1,100))/5,
														height:offsetValue(2,40),
														position:"absolute",
														top:offsetValue(2,5),
														left:(curWidth - offsetValue(1,100))/5*index
													};
	    							if(index == 4){
	    								return(
	    									<div key = {index} style = {curStyle}>
		    									<div style = {styleInfo.typeButton}>
		    										<div style = {styleInfo.buttonInfo_1}></div>
		    										<div style = {styleInfo.buttonClickDiv}
		    											onClick = {this.numTypeClick}
		    										 	data-index={index + 1}
		    										 	name = "choiceType">
		    										 </div>
		    									</div>
	    									</div>
	    								);
	    							}else{
		    							return(
		    								<div key = {index} style = {curStyle}>
		    									<div name = "choiceTypeImg" style = {styleInfo.typeButton}>
		    										<div style = {styleInfo.buttonInfo}
		    											onClick = {this.numTypeClick}
		    										 	data-index={index + 1}
		    										 	name = "choiceType">
		    										{item}</div>
		    									</div>
		    								</div>
		    							);
	    							}
	    						})
	    					}
	    				</div>
	    				<div id = "choiceItemPage" style = {styleInfo.typeButDiv}>
	    					{
	    						this.state.choiceItem.map((item,index) =>{
	    							var curStyle = {
		    											width:(curWidth - offsetValue(1,100))/5,
														height:offsetValue(2,40),
														position:"absolute",
														top:offsetValue(2,5),
														left:(curWidth - offsetValue(1,100))/5*index
													};
		    						return(
		    							<div name = "choiceItemDiv" key = {index} style = {curStyle}>
		    								<div name = "choiceItemImg" style = {styleInfo.typeButton}>
		    									<div style = {styleInfo.buttonInfo}
		    										onClick = {this.digitClick}
		    										 data-index={index + 1}
		    										 name = "choiceItem">
		    									{item}</div>
		    								</div>
		    							</div>
		    						);
	    						})
	    					}
	    				</div>
	    			</div>
	    			<div style = {styleInfo.numDiv}>
	    				<div style = {styleInfo.numDivCen}>
	    					{
	    						this.state.choiceNum.map((item,index) =>{
	    							var curStyle = {
	    								width:(curWidth - offsetValue(1,60))/6,
	    								height:offsetValue(2,48),
	    								top:index > 5?offsetValue(2,48):0,
	    								left:index > 5?(curWidth - offsetValue(1,60))/6*(index - 6):(curWidth - offsetValue(1,60))/6*index,
	    								position:"absolute",
	    								textAlign:"center",
	    								lineHeight:offsetValue(2,48) + "px",
	    								color:"white",
	    								fontSize:offsetValue(3,20),
	    								border:"1px solid #1a1d30",
										backgroundSize: '100% 100%',
										backgroundRepeat: 'no-repeat',
										backgroundImage:"url(./static/img/example/shuzi.png)"	    								
	    							}
	    							if(index == 11){
	    								var btnStyle = {
	    									width:(curWidth - offsetValue(1,60))/6,
	    									height:offsetValue(2,48),
	    									position:"absolute"
	    								};
	    								return(
	    									<div key = {index} style = {curStyle} >
	    										<div style = {styleInfo.buttonInfo_2}></div>
	    										<div style = {btnStyle}
		    										onClick = {this.noNumChoice}
		    										data-index = {index}	    											
	    										></div>
	    									</div>
	    								);
	    							}else{
	    								return(
	    									<div key = {index} 
	    										style = {curStyle}
	    										onClick = {index != 5?this.numClick:this.allNumChoice}
	    										data-index = {index <= 4?index:(index - 1)}
	    										name = {index != 5?"choiceNum":""}
	    									>{item}</div>
	    								);	    								
	    							}
	    						})
	    					}
	    				</div>
	    			</div>
	    			<div style = {styleInfo.buyStyle}>
	    				<div style = {styleInfo.buyInputStyle}>
	    					<div style = {styleInfo.inputImg}></div>
	    					<input style = {styleInfo.inputSty} type='text' value={this.state.inputText} onChange={this.inputChange}/>
	    				</div>
	    				<div style = {styleInfo.buyTypeSty}>
	    					{
	    						this.state.buyTypeSty.map((item,index) =>{
	    							var buyTypeBtnSty = {
	    								width:(curWidth*0.5 - offsetValue(1,60))/3 - offsetValue(1,10),
	    								height:offsetValue(2,36),
	    								border:"2px solid #1a1d30",
	    								left:(curWidth*0.5 - offsetValue(1,60))/3*index + offsetValue(1,10)*index + offsetValue(1,17),
	    								position:"absolute",
	    								textAlign:"center",
	    								lineHeight:offsetValue(2,36) + "px",
	    								color:"white",
	    								fontSize:offsetValue(3,18)
	    							}
	    							return(
	    								<div key = {index} 
	    									style = {buyTypeBtnSty}
	    									data-index = {index + 1}
	    									onClick = {this.betsTypeClick}
	    								>{item}</div>
	    							);
	    						})
	    					}
	    				</div>
	    			</div>
	    			<div style = {styleInfo.numInfoDiv}>
	    				<div style = {styleInfo.numInfoCen}>
	    					<div style = {styleInfo.numInfoLeft}>{this.state.selectNum}</div>
	    					<div style = {styleInfo.numInfoLine}></div>
	    					<div style = {styleInfo.numInfoCom}>
	    						<div style = {{	width:offsetValue(1,470),
	    										height:offsetValue(2,63),
	    										position:"absolute",
												textAlign:"center",
												lineHeight:offsetValue(2,63) + "px",
												left:0,
												display:starType == 1?"block":"none"
											}}>
	    							<span style = {{color:textColorJson.textColor_5,fontSize:offsetValue(3,20)}}>{"> "}</span>
	    							<span style = {{color:textColorJson.textColor_1,fontSize:offsetValue(3,20)}}>{this.state.choiceText[0]}</span>
	    							<span style = {{color:textColorJson.textColor_5,fontSize:offsetValue(3,20)}}>{" <"}</span>
	    						</div>
	    					</div>
    						<div style = {styleInfo.numInfoCom}>
  							{
    								this.state.choiceText.map((item,index) =>{
    									if(index < 2){
    										var numStyle = {
    											width:offsetValue(1,235),
												height:offsetValue(2,63),
												textAlign:"center",
												lineHeight:offsetValue(2,63) + "px",
												left:index == 0?0:offsetValue(1,235),
												position:"absolute",
												display:starType == 2?"block":"none"
    										}
    										return(
					    						<div key = {index} style = {numStyle}>
					    							<span style = {{color:textColorJson.textColor_5,fontSize:offsetValue(3,20)}}>{"> "}</span>
					    							<span style = {{color:textColorJson.textColor_1,fontSize:offsetValue(3,20)}}>{item}</span>
					    							<span style = {{color:textColorJson.textColor_5,fontSize:offsetValue(3,20)}}>{" <"}</span>
					    						</div>    											
    										);
    									}
    								})
    							}
    						</div>
	    					<div style = {styleInfo.numInfoCom}>
    							{
    								this.state.choiceText.map((item,index) =>{
    									if(index < 3){
    										var numStyle = {
    											width:offsetValue(1,490/3),
												height:offsetValue(2,63),
												textAlign:"center",
												lineHeight:offsetValue(2,63) + "px",
												left:offsetValue(1,490/3)*index,
												position:"absolute",
												display:starType == 3?"block":"none"
    										}
    										return(
					    						<div key = {index} style = {numStyle}>
					    							<span style = {{color:textColorJson.textColor_5,fontSize:offsetValue(3,15)}}>{">"}</span>
					    							<span style = {{color:textColorJson.textColor_1,fontSize:offsetValue(3,15)}}>{item}</span>
					    							<span style = {{color:textColorJson.textColor_5,fontSize:offsetValue(3,15)}}>{"<"}</span>
					    						</div>    											
    										);
    									}
    								})
    							}	    						
	    					</div>
	    					<div style = {styleInfo.numInfoCom}>
    							{
    								this.state.choiceText.map((item,index) =>{
    									if(index < starType && starType >= 4){
	    									var numStyle = {
	    										width:offsetValue(1,490/3),
												height:offsetValue(2,63/2),
												textAlign:"center",
												lineHeight:offsetValue(2,63/2) + "px",
												left:index < 3?(offsetValue(1,490/3)*index):(offsetValue(1,490/3)*(index - 3)),
												position:"absolute",
												top:index < 3?0:offsetValue(2,63/2),
	    									}
	    									return(
						    					<div key = {index} style = {numStyle}>
						    						<span style = {{color:textColorJson.textColor_5,fontSize:offsetValue(3,12)}}>{">"}</span>
						    						<span style = {{color:textColorJson.textColor_1,fontSize:offsetValue(3,12)}}>{item}</span>
						    						<span style = {{color:textColorJson.textColor_5,fontSize:offsetValue(3,12)}}>{"<"}</span>
						    					</div>    											
	    									);    										
    									}

    								})
    							}
	    					</div>
	    				</div>
	    			</div>
	    			<div style = {styleInfo.choiceBtnDiv}>
	    				<div style = {styleInfo.choiceBtnImage}
	    					onMouseDown = {this.buyClick}
	    				>{this.state.confirm}</div>
	    			</div>
	    		</div>    		
	    	</div>
	    );
  }
}

let styleInfo = {
	centerDiv: {
		width: curWidth,
		height: offsetValue(2, 823),
		position: "absolute",
		top: 0,
	},
	topDiv:{
		width:curWidth,
		height:offsetValue(2,173),
		position:"absolute",
		top:0,
		backgroundColor:textColorJson.textColor_12
	},
	topLeftDiv:{
		width:curWidth*0.5,
		height:offsetValue(2,173),
		position:'absolute',
		left:0
	},
	useInfo:{
		width:curWidth*0.5 - offsetValue(1,20),
		height:offsetValue(2,53),
		position:"absolute",
		left:offsetValue(1,20),
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/example/touxiang.png)"
	},
	useName:{
		width:offsetValue(1,220),
		height:offsetValue(2,30),
		position:"absolute",
		top:0,
		right:0,
		textAlign:'left',
		lineHeight:offsetValue(2,30) + "px",
		fontSize:offsetValue(3,15),
		color:"white"
	},
	userBal:{
		width:offsetValue(1,230),
		height:offsetValue(2,30),
		position:"absolute",
		top:offsetValue(2,23),
		right:0,
		textAlign:'left',
		lineHeight:offsetValue(2,30) + "px",
		fontSize:offsetValue(3,14),
		color:textColorJson.textColor_2
	},
	winNumInfo:{
		width:curWidth*0.5 - offsetValue(1,24),
		height:offsetValue(2,100),
		position:"absolute",
		left:offsetValue(1,20),
		border:"2px solid #3a3f56",
		top:offsetValue(2,57)
	},
	winTip:{
		width:curWidth*0.5 - offsetValue(1,24),
		height:offsetValue(2,32),
		position:"absolute",
		left:0,
		top:0,
		backgroundColor:textColorJson.textColor_4,
	},
	tipText:{
		width:curWidth*0.5 - offsetValue(1,44),
		height:offsetValue(2,32),
		position:"absolute",
		right:0,
		textAlign:"left",
		lineHeight:offsetValue(2,32) + "px",
		color:"white",
		margin:'0 0',
		fontSize:offsetValue(3,16)
	},
	winInfo:{
		width:curWidth*0.5 - offsetValue(1,24),
		height:offsetValue(2,68),
		top:offsetValue(2,32),
		position:"absolute",
		left:0
	},
	oneLottety:{
		width:curWidth*0.5 - offsetValue(1,24),
		height:offsetValue(2,34),
		position:"absolute",
		top:0,
		left:0,
	},
	twoLottety:{
		width:curWidth*0.5 - offsetValue(1,24),
		height:offsetValue(2,34),
		position:"absolute",
		bottom:0,
		left:0,
	},
	lottetyNum:{
		width:(curWidth*0.5 - offsetValue(1,24))*0.5,
		height:offsetValue(2,34),
		color:textColorJson.textColor_2,
		textAlign:"left",
		lineHeight:offsetValue(2,34) + "px",
		position:"absolute",
		left:offsetValue(1,20),
		fontSize:offsetValue(3,17),
	},
	winNum:{
		width:(curWidth*0.5 - offsetValue(1,24))*0.5,
		height:offsetValue(2,34),
		color:textColorJson.textColor_5,
		textAlign:"center",
		lineHeight:offsetValue(2,34) + "px",
		position:"absolute",
		right:0,
		fontSize:offsetValue(3,17)
	},
	topRightDiv:{
		width:curWidth*0.5,
		height:offsetValue(2,173),
		position:'absolute',
		right:0
	},
	topRightDiv_1:{
		width:curWidth*0.5 - offsetValue(1,20),
		height:offsetValue(2,42),
		position:"absolute",
		top:0,
		left:offsetValue(1,10),
	},
	topRightDiv_1_1:{
		width:offsetValue(1,160),
		height:offsetValue(2,42),
		left:0,
		top:0,
		textAlign:"left",
		lineHeight:offsetValue(2,42) + "px",
		color:"white",
		position:"absolute",
		fontSize:offsetValue(3,16),
	},
	topRightDiv_1_2:{
		width:offsetValue(1,160),
		height:offsetValue(2,42),
		right:0,
		top:0,
		textAlign:"right",
		lineHeight:offsetValue(2,42) + "px",
		color:textColorJson.textColor_1,
		position:"absolute",
		fontSize:offsetValue(3,16),	
	},
	topRightDiv_2:{
		width:curWidth*0.5 - offsetValue(1,20),
		height:offsetValue(2,42),
		position:"absolute",
		top:offsetValue(2,42),
		left:offsetValue(1,10),
	},
	topRightDiv_com:{
		width:offsetValue(1,120),
		height:offsetValue(2,42),
		color:textColorJson.textColor_2,
		position:"absolute",
		left:0,
		top:0,
		textAlign:"left",
		lineHeight:offsetValue(2,42) + "px",
		fontSize:offsetValue(3,15),
	},
	topRightDiv_2_com:{
		width:offsetValue(1,190),
		height:offsetValue(2,42),
		color:textColorJson.textColor_6,
		position:"absolute",
		right:0,
		top:0,
		textAlign:"right",
		lineHeight:offsetValue(2,42) + "px",
		fontSize:offsetValue(3,14),
	},
	topRightDiv_3:{
		width:curWidth*0.5 - offsetValue(1,20),
		height:offsetValue(2,42),
		position:"absolute",
		top:offsetValue(2,84),
		left:offsetValue(1,10),
	},
	topRightDiv_3_1:{
		width:offsetValue(1,180),
		height:offsetValue(2,42),
		position:"absolute",
		right:0,
		top:0,
	},
	tRDiv_1:{
		width:offsetValue(1,130),
		height:offsetValue(2,30),
		position:"absolute",
		backgroundColor:textColorJson.textColor_8,
		left:offsetValue(1,10),
		top:offsetValue(2,6)
	},
	tRDiv_1_1:{
		width:offsetValue(1,65),
		height:offsetValue(2,30),
		position:"absolute",
		left:0,
		top:0,
		textAlign:"right",
		lineHeight:offsetValue(2,30) + "px",
		fontSize:offsetValue(3,15),	
		color:textColorJson.textColor_1	
	},
	tRDiv_1_2:{
		width:offsetValue(1,65),
		height:offsetValue(2,30),
		position:"absolute",
		right:0,
		top:0,
		textAlign:"left",
		lineHeight:offsetValue(2,30) + "px",
		fontSize:offsetValue(3,15),
		color:textColorJson.textColor_6	
	},
	tRDiv_2:{
		width:offsetValue(1,40),
		height:offsetValue(2,42),
		position:"absolute",
		right:0,
		top:0,
		textAlign:"right",
		lineHeight:offsetValue(2,42) + "px",
		fontSize:offsetValue(3,15),
		color:textColorJson.textColor_1							
	},
	topRightDiv_4:{
		width:curWidth*0.5 - offsetValue(1,20),
		height:offsetValue(2,42),
		position:"absolute",
		top:offsetValue(2,126),
		left:offsetValue(1,10),
	},
	cenDivCen:{
		width:curWidth,
		height:offsetValue(2,130),
		backgroundColor:textColorJson.textColor_12,
		top:offsetValue(2,193),
		position:"absolute"
	},
	cenTopDiv:{
		width:curWidth,
		height:offsetValue(2,30),
		position:"absolute",
		top:0,
		left:0,
	},
	cenTopImg:{
		width:offsetValue(1,30),
		height:offsetValue(2,25),
		position:"absolute",
		left:offsetValue(1,20),
		top:offsetValue(2,2.5),
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/example/qukuailian.png)"
	},
	cenTopText:{
		width:offsetValue(1,300),
		height:offsetValue(2,30),
		position:"absolute",
		left:offsetValue(1,65),
		fontSize:offsetValue(3,16),
		color:"white",
		textAlign:"left",
		lineHeight:offsetValue(2,30) + "px",
	},
	cenTopTime:{
		width:offsetValue(1,100),
		height:offsetValue(2,24),
		position:"absolute",
		right:offsetValue(1,20),
		border:"2px solid #3a3f56",
		top:offsetValue(2,3),
		borderRadius:18,
	},
	cenTopTimeImg:{
		width:offsetValue(3,20),
		height:offsetValue(3,20),
		position:"absolute",
		left:offsetValue(1,5),
		top:offsetValue(2,2),
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/example/time_icon.png)"		
	},
	cenTopTimeSeconds:{
		width:offsetValue(1,80),
		height:offsetValue(2,24),
		position:"absolute",
		right:offsetValue(1,4),
		top:0,
		fontSize:offsetValue(3,13),
		color:textColorJson.textColor_2,
		textAlign:"center",
		lineHeight:offsetValue(2,24) + "px",
	},
	cenBotDiv:{
		width:curWidth,
		height:offsetValue(2,100),
		position:"absolute",
		top:offsetValue(2,30),
		left:0,	
	},
	blockInfo_0:{
		width:curWidth,
		height:offsetValue(2,30),
		position:"absolute",
		top:0,
		left:0
	},
	blockInfo_1:{
		width:curWidth,
		height:offsetValue(2,30),
		position:"absolute",
		top:offsetValue(2,34),
		left:0
	},
	blockInfo_2:{
		width:curWidth,
		height:offsetValue(2,30),
		position:"absolute",
		top:offsetValue(2,68),
		left:0
	},
	blockNumDiv:{
		width:offsetValue(1,110),
		height:offsetValue(2,30),
		top:0,
		color:textColorJson.textColor_2,
		left:offsetValue(1,20),
		textAlign:"left",
		lineHeight:offsetValue(2,30) + "px",
		fontSize:offsetValue(3,15),
		position:"absolute"
	},
	blockValueDiv:{
		width:offsetValue(1,360),
		height:offsetValue(2,30),
		top:0,
		color:textColorJson.textColor_1,
		textAlign:"center",
		lineHeight:offsetValue(2,30) + "px",
		fontSize:offsetValue(3,15),
		position:"absolute",
		left:offsetValue(1,140),
	},
	blockTimeDiv:{
		width:offsetValue(1,110),
		height:offsetValue(2,30),
		top:0,
		color:"#6f7897",
		textAlign:"right",
		lineHeight:offsetValue(2,30) + "px",
		fontSize:offsetValue(3,15),
		position:"absolute",
		right:offsetValue(1,20),
	},
	botDiv:{
		width:curWidth,
		height:offsetValue(2,480),
		backgroundColor:textColorJson.textColor_12,
		bottom:0,
		position:"absolute"
	},
	botTopDiv:{
		width:curWidth,
		height:offsetValue(2,30),
		position:"absolute",
		top:offsetValue(2,10),
		left:0
	},
	botTopImg:{
		width:offsetValue(1,20),
		height:offsetValue(2,26),
		position:"absolute",
		left:offsetValue(1,20),
		top:offsetValue(2,2),
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/example/xunazehaom.png)"			
	},
	botTopText:{
		width:offsetValue(1,300),
		height:offsetValue(2,30),
		position:"absolute",
		left:offsetValue(1,50),
		top:0,
		fontSize:offsetValue(3,16),
		textAlign:"left",
		lineHeight:offsetValue(2,30) + "px",
		color:"white"
	},
	botOneDiv:{
		width:curWidth,
		height:offsetValue(2,24),
		position:"absolute",
		left:0,
		top:offsetValue(2,45),
	},
	botOneLeft:{
		width:curWidth*0.5,
		height:offsetValue(2,24),
		position:"absolute",
		left:0,
		top:0
	},
	botOne_com_1:{
		width:curWidth*0.2,
		height:offsetValue(2,24),
		position:"absolute",
		left:0,
		top:0,
		textAlign:"center",
		lineHeight:offsetValue(2,24) + "px",
		color:textColorJson.textColor_1,
		fontSize:offsetValue(3,14)
	},
	botOne_com_2:{
		width:curWidth*0.3,
		height:offsetValue(2,24),
		position:"absolute",
		right:0,
		top:0
	},
	botOne_com_1_1:{
		width:curWidth*0.2,
		height:offsetValue(2,24),
		backgroundColor:textColorJson.textColor_8,
		position:"absolute",
		left:offsetValue(2,-10),
		top:0,
		textAlign:"center",
		lineHeight:offsetValue(2,24) + "px",
		color:"white",
		fontSize:offsetValue(3,16)
	},
	botOneRight:{
		width:curWidth*0.5,
		height:offsetValue(2,24),
		position:"absolute",
		right:0,
		top:0
	},
	botOne_com_3:{
		width:curWidth*0.2,
		height:offsetValue(2,24),
		position:"absolute",
		left:offsetValue(2,20),
		top:0,
		textAlign:"right",
		lineHeight:offsetValue(2,24) + "px",
		color:textColorJson.textColor_1,
		fontSize:offsetValue(3,14)
	},
	botOne_com_4:{
		width:curWidth*0.3,
		height:offsetValue(2,24),
		position:"absolute",
		right:0,
		top:0
	},
	botOne_com_2_1:{
		width:curWidth*0.2,
		height:offsetValue(2,24),
		backgroundColor:textColorJson.textColor_8,
		position:"absolute",
		right:offsetValue(1,20),
		top:0,
		textAlign:"center",
		lineHeight:offsetValue(2,24) + "px",
		color:textColorJson.textColor_6,
		fontSize:offsetValue(3,16)		
	},
	starInfoDiv:{
		width:curWidth,
		height:offsetValue(2,60),
		position:"absolute",
		left:0,
		top:offsetValue(2,75),
	},
	starDiv:{
		width:curWidth,
		height:offsetValue(2,40),
		position:"absolute",
		left:0,
		top:offsetValue(2,10),
	},
	choiceStarImg:{
		width:offsetValue(1,100),
		height:offsetValue(2,6),
		position:"absolute",
		left:(curWidth/5 - offsetValue(1,100))*0.5,
		top:offsetValue(2,50),
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/example/xiahuanx.png)"			
	},
	starLineDiv:{
		width:curWidth - (curWidth/5 - offsetValue(1,100)),
		height:offsetValue(2,2),
		position:"absolute",
		left:(curWidth/5 - offsetValue(1,100))*0.5,
		top:offsetValue(2,56),
		backgroundColor:textColorJson.textColor_9
	},
	choiceType:{
		width:curWidth,
		height:offsetValue(2,50),
		position:"absolute",
		left:0,
		top:offsetValue(2,140),
	},
	typeButDiv:{
		width:curWidth - offsetValue(1,100),
		height:offsetValue(2,50),
		position:"absolute",
		left:offsetValue(1,50),
		top:0,
	},
	typeButton:{
		width:offsetValue(1,80),
		height:offsetValue(2,36),
		position:"absolute",
		left:offsetValue(1,14),
		top:0,
/*		border:"2px solid #1a1d30",
		backgroundColor:textColorJson.textColor_10,*/
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/example/daxiao.png)"		
	},
	buttonInfo:{
		width:offsetValue(1,80),
		height:offsetValue(2,36),
		position:"absolute",
		left:0,	
		textAlign:"center",
		lineHeight:offsetValue(2,36) + "px",
		color:textColorJson.textColor_1,
		fontSize:offsetValue(3,18)	
	},
	buttonInfo_1:{
		width:offsetValue(3,26),
		height:offsetValue(3,26),
		position:"absolute",
		left:offsetValue(1,27),
		top:offsetValue(2,5),
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/example/chongzhi.png)"		
	},
	buttonClickDiv:{
		width:offsetValue(1,80),
		height:offsetValue(2,36),
		position:"absolute",
		left:0,
		top:0,		
	},
	numDiv:{
		width:curWidth,
		height:offsetValue(2,100),
		top:offsetValue(2,200),
		position:"absolute"
	},
	numDivCen:{
		width:curWidth - offsetValue(1,60),
		height:offsetValue(2,96),
		top:0,
		position:"absolute",
		left:offsetValue(1,28),
		border:"1px solid #1a1d30",
	},
	buttonInfo_2:{
		width:offsetValue(3,26),
		height:offsetValue(3,26),
		position:"absolute",
		left:offsetValue(1,35),
		top:offsetValue(2,11),
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/example/chongzhi.png)"		
	},
	buyStyle:{
		width:curWidth,
		height:offsetValue(2,40),
		position:"absolute",
		top:offsetValue(2,305),
		left:0
	},
	buyInputStyle:{
		width:curWidth*0.5 - offsetValue(1,28),
		height:offsetValue(2,36),
		position:"absolute",
		border:"2px solid #545a75",
		left:offsetValue(1,28)
	},
	inputImg:{
		width:offsetValue(3,18),
		height:offsetValue(3,26),
		position:"absolute",
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/example/danwei.png)",
		top:offsetValue(2,5),
		left:offsetValue(1,20)	
	},
	inputSty:{
		width:offsetValue(1,220),
		height:offsetValue(2,30),
		position:"absolute",
		left:offsetValue(2,45),
		border:"none",
		backgroundColor:textColorJson.textColor_12,
		textAlign:"center",
		fontSize:offsetValue(3,20),
		top:offsetValue(2,3),
		color:"white",
		outline:"none",
	},
	buyTypeSty:{
		width:curWidth*0.5,
		height:offsetValue(2,40),
		position:"absolute",
		right:0
	},
	numInfoDiv:{
		width:curWidth,
		height:offsetValue(2,65),
		position:"absolute",		
		top:offsetValue(2,355)
	},
	numInfoCen:{
		width:curWidth - offsetValue(1,56),
		height:offsetValue(2,63),
		position:"absolute",
		left:offsetValue(1,28),
		border:"1px solid #1a1d30",
		backgroundColor:textColorJson.textColor_8,
	},
	numInfoLeft:{
		width:offsetValue(1,50),
		height:offsetValue(2,63),
		position:"absolute",
		textAlign:"center",
		lineHeight:offsetValue(2,31.5) + "px",
		color:textColorJson.textColor_1,
		wordBreak:"break-all",
		fontSize:offsetValue(3,18),
		left:offsetValue(1,15)
	},
	numInfoLine:{
		width:offsetValue(1,2),
		height:offsetValue(2,63),
		backgroundColor:textColorJson.textColor_12,
		left:offsetValue(1,90),
		position:"absolute"
	},
	numInfoCom:{
		width:offsetValue(1,490),
		height:offsetValue(2,63),
		position:"absolute",
		left:offsetValue(1,90)
	},
	choiceBtnDiv:{
		width:curWidth,
		height:offsetValue(2,50),
		position:"absolute",
		bottom:offsetValue(2,5),
	},
	choiceBtnImage:{
		width:offsetValue(1,158),
		height:offsetValue(2,50),
		position:"absolute",
		top:offsetValue(2,3),
		textAlign:"center",
		lineHeight:offsetValue(2,47) + "px",
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/example/butn.png)",	
		left:(curWidth - offsetValue(1,158))*0.5,
		fontSize:offsetValue(3,22),
		color:"white"
	}
}

module.exports = Game;

