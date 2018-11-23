import React from 'react';
import Tool from '../../src/common/tools';

const getLanguage = Tool.GetLanguage;
const offsetValue = Tool.offsetValue;
const curWidth = offsetValue(1,590);
const curHeight = offsetValue(2,823);
const textColorJson = Tool.textColorJson;

let curChoiceNum = [[],[],[],[],[]];//数字
let starType = 1;//星级
let smallDouble = [0,0];//大小单双

class Pchoice extends React.Component {
  	constructor(...args) {
	    super(...args);
	    this.state = {
		    buttonName: getLanguage("buttonName"), //星级文本
		    choiceItem: getLanguage("choiceItem"), //个十百千万
		    choiceType: getLanguage("choiceType"), //大小单双
		    choiceNum: [0, 1, 2, 3, 4, getLanguage("choiceNum"), 5, 6, 7, 8, 9, 10],
		    choiceText: ["", "", "", "", ""],
		    eosMax: [100, 100, 10, 1, 0.1],
		    inputText: 0, //输入框金额
		    betNum: 0, //注数
		    allBlaceNum: 0, //下注所需总金额
		    balance: getLanguage("balance"), //金额文本
		    curBetBalance: 0, //已下注金额,
		    selection: getLanguage("selection"), //选择号码文本
		    count: getLanguage("count"), //当前注数文本
		    buyTypeSty: ["1/2", "2X", "MAX"], //购买类型文本,
		    selectNum: getLanguage("selectNum"), //已选号码文本,
		    confirm: getLanguage("confirm"), //确定文本
	    }
  	}

  	componentDidMount() {
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

    initGame = () => {

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

    initNumBtn = () =>{
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

        if(!window.gameInfo.accountsInfo || !window.contract){
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
            from: window.gameInfo.accountsInfo.name,
            to: "eosiosscgame",
            quantity: this.state.allBlaceNum + " EOS",
            memo: betInfo
        }
        var transfer = await window.contract.transfer(data, {
            authorization: [window.gameInfo.accountsInfo.name + '@active']
        }).catch(console.error);

        if(transfer && transfer.broadcast){
        	this.startShowMsg(getLanguage("TIP_10"));
        	console.log("充值结果成功");
        	this.props.refreshEosInfo();
        }
        console.log(transfer);
        this.initGame();
    }

    changeGameLanguage = (event) => {
    	console.log("Game里的改变语言方法");
    	this.setState({
            buttonName:getLanguage("buttonName"),//星级文本
            choiceItem:getLanguage("choiceItem"),//个十百千万
            choiceType:getLanguage("choiceType"),//大小单双 
            choiceNum:[0,1,2,3,4,getLanguage("choiceNum"),5,6,7,8,9,10],
            balance:getLanguage("balance"),//金额文本
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
    	return (
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
		    								height:offsetValue(2,60),
		    								top:index > 5?offsetValue(2,60):0,
		    								left:index > 5?(curWidth - offsetValue(1,60))/6*(index - 6):(curWidth - offsetValue(1,60))/6*index,
		    								position:"absolute",
		    								textAlign:"center",
		    								lineHeight:offsetValue(2,60) + "px",
		    								color:"white",
		    								fontSize:offsetValue(3,22),
		    								border:"1px solid #1a1d30",
											backgroundSize: '100% 100%',
											backgroundRepeat: 'no-repeat',
											backgroundImage:"url(./static/img/example/shuzi.png)"	    								
		    					}
		    					if(index == 11){
		    						var btnStyle = {
		    							width:(curWidth - offsetValue(1,60))/6,
		    							height:offsetValue(2,60),
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
		    								height:offsetValue(2,46),
		    								border:"2px solid #1a1d30",
		    								left:(curWidth*0.5 - offsetValue(1,60))/3*index + offsetValue(1,10)*index + offsetValue(1,17),
		    								position:"absolute",
		    								textAlign:"center",
		    								lineHeight:offsetValue(2,46) + "px",
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
		    				<div style = {{	
		    								width:offsetValue(1,446),
		    								height:offsetValue(2,118),
		    								position:"absolute",
											textAlign:"center",
											lineHeight:offsetValue(2,118) + "px",
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
	    											width:offsetValue(1,223),
													height:offsetValue(2,118),
													textAlign:"center",
													lineHeight:offsetValue(2,118) + "px",
													left:index == 0?0:offsetValue(1,223),
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
	    											width:offsetValue(1,446/3),
													height:offsetValue(2,118),
													textAlign:"center",
													lineHeight:offsetValue(2,118) + "px",
													left:offsetValue(1,446/3)*index,
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
		    										width:offsetValue(1,446/3),
													height:offsetValue(2,118/2),
													textAlign:"center",
													lineHeight:offsetValue(2,118/2) + "px",
													left:index < 3?(offsetValue(1,446/3)*index):(offsetValue(1,446/3)*(index - 3)),
													position:"absolute",
													top:index < 3?0:offsetValue(2,118/2),
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
		    		</div>
		    	</div>
		    	<div style = {styleInfo.choiceBtnDiv}>
		    		<div style = {styleInfo.choiceBtnImage}
		    			onMouseDown = {this.buyClick}
		    		>{this.state.confirm}</div>
		    	</div>
		    </div>

    );
  }
}

let styleInfo = {
	botDiv:{
        width:offsetValue(1,590),
        height:offsetValue(2,823),
        left:0,
        top:0,
        position:"absolute",
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/pc/kuang.png)"
	},
	botTopDiv:{
		width:curWidth,
		height:offsetValue(2,66),
		position:"absolute",
		top:0,
		left:0
	},
	botTopImg:{
		width:offsetValue(1,26),
		height:offsetValue(2,30),
		position:"absolute",
		left:offsetValue(1,224),
		top:offsetValue(2,18),
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/pc/xuanze.png)"			
	},
	botTopText:{
		width:offsetValue(1,300),
		height:offsetValue(2,66),
		position:"absolute",
		left:offsetValue(1,264),
		top:0,
		fontSize:offsetValue(3,22),
		textAlign:"left",
		lineHeight:offsetValue(2,66) + "px",
		color:"white"
	},
	botOneDiv:{
		width:curWidth,
		height:offsetValue(2,50),
		position:"absolute",
		left:0,
		top:offsetValue(2,80),
	},
	botOneLeft:{
		width:curWidth*0.5,
		height:offsetValue(2,50),
		position:"absolute",
		left:0,
		top:0
	},
	botOne_com_1:{
		width:curWidth*0.2,
		height:offsetValue(2,50),
		position:"absolute",
		left:0,
		top:0,
		textAlign:"center",
		lineHeight:offsetValue(2,50) + "px",
		color:textColorJson.textColor_1,
		fontSize:offsetValue(3,18)
	},
	botOne_com_2:{
		width:curWidth*0.3,
		height:offsetValue(2,50),
		position:"absolute",
		right:0,
		top:0
	},
	botOne_com_1_1:{
		width:curWidth*0.25,
		height:offsetValue(2,30),
		backgroundColor:textColorJson.textColor_8,
		position:"absolute",
		left:0,
		top:offsetValue(2,12),
		textAlign:"center",
		lineHeight:offsetValue(2,30) + "px",
		color:"white",
		fontSize:offsetValue(3,17)
	},
	botOneRight:{
		width:curWidth*0.5,
		height:offsetValue(2,50),
		position:"absolute",
		right:0,
		top:0
	},
	botOne_com_3:{
		width:curWidth*0.2,
		height:offsetValue(2,50),
		position:"absolute",
		left:offsetValue(2,20),
		top:0,
		textAlign:"center",
		lineHeight:offsetValue(2,50) + "px",
		color:textColorJson.textColor_1,
		fontSize:offsetValue(3,18)
	},
	botOne_com_4:{
		width:curWidth*0.3,
		height:offsetValue(2,50),
		position:"absolute",
		right:0,
		top:0
	},
	botOne_com_2_1:{
		width:curWidth*0.25,
		height:offsetValue(2,30),
		backgroundColor:textColorJson.textColor_8,
		position:"absolute",
		right:offsetValue(1,20),
		top:offsetValue(2,12),
		textAlign:"center",
		lineHeight:offsetValue(2,30) + "px",
		color:textColorJson.textColor_6,
		fontSize:offsetValue(3,17)		
	},
	starInfoDiv:{
		width:curWidth,
		height:offsetValue(2,60),
		position:"absolute",
		left:0,
		top:offsetValue(2,130),
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
		top:offsetValue(2,215),
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
		height:offsetValue(2,120),
		top:offsetValue(2,290),
		position:"absolute"
	},
	numDivCen:{
		width:curWidth - offsetValue(1,60),
		height:offsetValue(2,120),
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
		height:offsetValue(2,50),
		position:"absolute",
		top:offsetValue(2,450),
		left:0
	},
	buyInputStyle:{
		width:curWidth*0.5 - offsetValue(1,28),
		height:offsetValue(2,46),
		position:"absolute",
		border:"2px solid #398ddb",
		left:offsetValue(1,28)
	},
	inputImg:{
		width:offsetValue(3,18),
		height:offsetValue(3,26),
		position:"absolute",
		backgroundSize: '100% 100%',
		backgroundRepeat: 'no-repeat',
		backgroundImage:"url(./static/img/pc/bizhong.png)",
		top:offsetValue(2,10),
		left:offsetValue(1,20)	
	},
	inputSty:{
		width:offsetValue(1,220),
		height:offsetValue(2,40),
		position:"absolute",
		left:offsetValue(2,40),
		border:"none",
		backgroundColor:textColorJson.textColor_7,
		textAlign:"center",
		fontSize:offsetValue(3,22),
		top:offsetValue(2,2),
		color:"white",
		outline:"none",
	},
	buyTypeSty:{
		width:curWidth*0.5,
		height:offsetValue(2,50),
		position:"absolute",
		right:0
	},
	numInfoDiv:{
		width:curWidth,
		height:offsetValue(2,120),
		position:"absolute",		
		top:offsetValue(2,540)
	},
	numInfoCen:{
		width:curWidth - offsetValue(1,56),
		height:offsetValue(2,118),
		position:"absolute",
		left:offsetValue(1,28),
		border:"1px solid #1a1d30",
		backgroundColor:textColorJson.textColor_8,
	},
	numInfoLeft:{
		width:offsetValue(1,90),
		height:offsetValue(2,118),
		position:"absolute",
		textAlign:"center",
		lineHeight:offsetValue(2,118) + "px",
		color:textColorJson.textColor_1,
		wordBreak:"break-all",
		fontSize:offsetValue(3,18),
		left:0
	},
	numInfoLine:{
		width:offsetValue(1,2),
		height:offsetValue(2,118),
		backgroundColor:textColorJson.textColor_12,
		left:offsetValue(1,90),
		position:"absolute"
	},
	numInfoCom:{
		width:offsetValue(1,446),
		height:offsetValue(2,118),
		position:"absolute",
		left:offsetValue(1,90)
	},
	choiceBtnDiv:{
		width:curWidth,
		height:offsetValue(2,50),
		position:"absolute",
		bottom:offsetValue(2,60),
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
module.exports = Pchoice;
