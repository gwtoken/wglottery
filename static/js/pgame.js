import React from 'react';
import Tool from '../../src/common/tools';
import PHistoryPage from '../../static/js/phistory';
import PInvitePage from '../../static/js/pinvite';
import PHowPage from '../../static/js/phow';
import PChoicePage from '../../static/js/pchoice';

const getLanguage = Tool.GetLanguage;
const offsetValue = Tool.offsetValue;
const curWidth = Tool.curWidth;
const curHeight = Tool.curHeight;
const textColorJson = Tool.textColorJson;


window.contract = null;
let identity = null;
let eosInfo = null;
if(Tool.CheckCurrentOs().isPc){
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
    if(!Tool.CheckCurrentOs().isPc){
        return;
    }
    console.log('scatterLoaded');
    const scatter = window.scatter;

    const eosOptions = {};
    const eos = window.eos = window.scatter.eos(network, Eos, eosOptions);

    netInfo = await eos.contract("eosiosscgame");
    console.log(netInfo);
    contract = await eos.contract('eosio.token');
    console.log(window.contract); 

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

    if(!window.eos){
    	return;
    }

    //平台信息
    var platform = await eos.getTableRows(true, "eosiosscgame", "eosiosscgame", "platform");
    gameInfo.platform = platform.rows[0];

    console.log("gameInfo.platform",gameInfo.platform);

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
    console.log("gameInfo.accountinfor",gameInfo.accountinfor);
    
    //投注信息
    if(gameInfo.accountsInfo){
	    var bethistoryer = await eos.getTableRows({"json":true, "code":"eosiosscgame","scope":gameInfo.accountsInfo.name,"table":"bettemprs","limit":100});
	    gameInfo.bethistoryer = bethistoryer.rows;
	    console.log("gameInfo.bethistoryer",gameInfo.bethistoryer);   	
    }

    //开奖信息
    gameInfo.openWinInfo = [];
    var openWinInfo = await eos.getTableRows({"json":true, "code":"eosiosscgame", "scope":"eosiosscgame", "table":"lotttemps","limit":200});
    gameInfo.openWinInfo = openWinInfo.rows;
    console.log("gameInfo.openWinInfo",openWinInfo.rows);

    if(gameInfo.accountsInfo){
    	await eos.getCurrencyBalance({"code":"eosio.token","account":gameInfo.accountsInfo.name,"symbol":"EOS"}).then(function(resp){eosInfo = resp});
    	console.log(eosInfo[0]);
    }   
}


if(Tool.CheckCurrentOs().isPc){
    if(window.initEosInfo){
        clearInterval(window.initEosInfo);
    }
    window.initEosInfo = setInterval(initEosInfo, 5000);   
}

class pGame extends React.Component {
    constructor(...args){
        super(...args);
        this.state = {
                        gameInfo:getLanguage("gameInfo"),//奖池信息
                        lotteryNum:[{"lottery":"","num":""},{"lottery":"","num":""},{"lottery":"","num":""}],//开奖信息
                        blockInfo:[{'blockNum':'','blockValue':'','createTime':'','isStart':false,'lastStr':''},
                                   {'blockNum':'','blockValue':'','createTime':'','isStart':false,'lastStr':''},
                                   {'blockNum':'','blockValue':'','createTime':'','isStart':false,'lastStr':''},
                                   {'blockNum':'','blockValue':'','createTime':'','isStart':false,'lastStr':''},
                                   {'blockNum':'','blockValue':'','createTime':'','isStart':false,'lastStr':''}],
                        pageName:getLanguage("itemInfo")[0],//当前页面名称
                        useName:"",//玩家名称
                        userBal:0,//玩家账户余额
                        results:getLanguage("results"),//最新开奖文本
                        no:getLanguage("No"),
                        stage:getLanguage("stage"),
                        curSeconds:0,//秒数倒计时
                        curTime:0,//当前时间
                        balanceName:"",
                        balanceNum:0,//奖池金额
                        curBetBalance:0,//已下注金额,
                        blockInfoText:getLanguage("blockInfo"),//区块链信息文本
                        userBalText:getLanguage("useBal"),//余额文本
        };
        let webS = new WebSocket('ws://180.76.167.228:8080/v1/p2p');
        webS.onmessage = (evt) =>{
            gameInfo.eosMessage = [];
            gameInfo.eosMessage.unshift(evt);
            this.changeEosInfo();
        }
    }

    componentDidMount(){
        this.refs["popFrame"].style.display = "none";
        this.refs["invitePage"].style.display = "none";
        this.refs["howPage"].style.display = "none";
    }

    getIdentity = async() =>{
        var identity = await scatter.getIdentity({ "accounts": [network] }).catch(function(error) {
            console.log(error);
        });
        if (identity) {
            window.gameInfo.accountsInfo = identity.accounts[0];
            console.log(gameInfo.accountsInfo);
            initEosInfo();
        }        
    }

    initGameInfo = async() =>{
        netInfo = await window.eos.contract("eosiosscgame");
        console.log(netInfo);
        window.contract = await window.eos.contract('eosio.token');
        console.log(window.contract);
        if(window.initEosInfo){
            clearInterval(window.initEosInfo);
        }
        window.initEosInfo = setInterval(initEosInfo, 5000);
        initEosInfo(); 
    }

    keyLoginRefresh = (publickey,providerKey)=>{
        var config = {
            chainId:network.chainId, // 32 byte (64 char) hex string
            keyProvider: [providerKey], // WIF string or array of keys..
            httpEndpoint: 'http://180.76.108.100:8000',
            expireInSeconds: 60,
            broadcast: true,
            verbose: false, // API activity
            sign: true
        };

        var eosKey = window.eos = Eos(config);
        var accountName = "";
        eosKey.getKeyAccounts({public_key:publickey}).then((resp) => {
            accountName = resp.account_names[0];
            eosKey.getAccount({account_name:accountName}).then((resp) =>{
                var info = {};
                info.name = resp.account_name;
                info.balance = resp.core_liquid_balance;
                gameInfo.accountsInfo = info;
                this.initGameInfo();
                this.props.refreshLoginState();
            })                            
        });
    }

    refreshEosInfo = () =>{
        initEosInfo();
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
            for(var i = 0;i < 3;i++){
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
        this.props.refreshLoginState();
        if(this.refs["pHistoryPage"]){
            this.refs["pHistoryPage"].changeStateInfo();
        }        
        //this.props.refreshState();
    }

    changeEosInfo = () => {
        var thisBlockInfo = this.state.blockInfo.slice(0);
        //console.log("******************");
        var myReg = new RegExp("^[0-9]*$");
        var curEosMessage = gameInfo.eosMessage.slice(0);
        if(thisBlockInfo.length == 5){
            thisBlockInfo = thisBlockInfo.slice(0,4);
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
                    var blockValue = "..." + eosMesData.data.id.substr(50);
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

    changeGameLanguage = (event) => {
        this.setState({
            gameInfo:getLanguage("gameInfo"),//奖池信息
            results:getLanguage("results"),//最新开奖文本
            no:getLanguage("No"),
            stage:getLanguage("stage"),
            blockInfoText:getLanguage("blockInfo"),//区块链信息文本
            userBalText:getLanguage("useBal"),//余额文本
        });
        this.refs["pChoicePage"].changeGameLanguage();
        this.refs["pHistoryPage"].changeHistoryLanguage();
        this.refs["invite"].changeInviteLanguage();
        this.refs["how"].changeHowLanguage();
    }

    showPage = (index) => {
        console.log("9999999999999",index);
        this.refs["popFrame"].style.display = "block";
        this.refs["invitePage"].style.display = "none";
        this.refs["howPage"].style.display = "none";
        if(index == 3){
            this.refs["invite"].changeStateInfo();
            this.refs["invitePage"].style.display = "block";
        }else{
            this.refs["howPage"].style.display = "block";
        }
    }

    closePage = (event) =>{
        if(this.returnPageState){
            this.returnPageState = false;
            return;
        }
        this.refs["popFrame"].style.display = "none";
        this.props.choicePageBtn();
        console.log("22222222222222");
    }

    returnPage = (event) =>{
        this.returnPageState = true;
    }

    render() {
        var curBalance = this.state.userBalText + "：" + this.state.userBal.toFixed(4) + " EOS";
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
                <div style = {styleInfo.pleftGame}>
                    <div style = {styleInfo.pGameSty}>
                        <div style = {styleInfo.useInfoSty}>
                            <div style = {styleInfo.useInfo}>
                                <div style = {styleInfo.useName}>{this.state.useName}</div>
                                <div style = {styleInfo.userBal}>{curBalance}</div>
                            </div>                            
                        </div>
                        <div style = {styleInfo.gInfo}>
                            <div style = {styleInfo.gInfoT}>
                                <div style = {styleInfo.gInfoTimg}></div>
                                <div style = {styleInfo.gInfoText}>{curStage}</div>
                                <div style = {styleInfo.gInfoTime}>{this.state.curTime}</div>
                            </div>
                            <div style = {styleInfo.gInfoB}>
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
                        <div style = {styleInfo.winInfo}>
                            <div style = {styleInfo.gInfoT}>
                                <div style = {styleInfo.wInfoTimg}></div>
                                <div style = {styleInfo.gInfoText}>{this.state.results}</div>
                            </div>
                            <div style = {styleInfo.gInfoB}>
                                {
                                    this.state.lotteryNum.map((item,index) =>{
                                        var rowSty = {
                                            width:offsetValue(1,600),
                                            height:offsetValue(2,50),
                                            position:"absolute",
                                            top:offsetValue(2,50)*index,
                                        };
                                        return(
                                            <div key = {index} style = {rowSty}>
                                                <div style = {styleInfo.lottetyNum}>{item.lottery}</div>
                                                <div style = {styleInfo.winNum}>{item.num}</div>
                                            </div>
                                        );
                                    })
                                }
                                <div style = {styleInfo.winLine}></div>
                            </div>
                        </div>
                        <div style = {styleInfo.blockInfo}>
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
                                        var blockItemSty = {
                                            width:offsetValue(1,594),
                                            height:offsetValue(2,50),
                                            position:"absolute",
                                            top:offsetValue(2,50)*index,
                                        };
                                        return (  
                                            <div key = {index} style = {blockItemSty}>
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
                    </div>
                </div>
                <div style = {styleInfo.pcenGame}>
                    <div style = {styleInfo.pGameSty}>
                        <PChoicePage ref = "pChoicePage"  showTipMsg = {this.props.showTipMsg} refreshEosInfo = {this.refreshEosInfo}></PChoicePage>
                    </div>
                </div>
                <div style = {styleInfo.prightGame}>
                    <div style = {styleInfo.pGameSty}>
                        <PHistoryPage ref = "pHistoryPage"></PHistoryPage>
                    </div>
                </div>
                <div ref = "popFrame" style = {styleInfo.inviteStr} onClick = {this.closePage}>
                    <div ref = "invitePage" style = {styleInfo.invitePage} onClick = {this.returnPage}>
                        <PInvitePage ref = "invite" showTipMsg = {this.props.showTipMsg}></PInvitePage>
                    </div>
                    <div ref = "howPage" style = {styleInfo.invitePage} onClick = {this.returnPage}>
                        <PHowPage ref = "how"></PHowPage>
                    </div>
                </div>                             
            </div>
        );
    }
}

let styleInfo = {
    pleftGame:{
        width:offsetValue(1,640),
        height:offsetValue(2,863),
        position:"absolute",
        top:0,
        left:0,
    },
    pcenGame:{
        width:offsetValue(1,640),
        height:offsetValue(2,863),
        position:"absolute",
        top:0,
        left:curWidth/3,
    },
    prightGame:{
        width:offsetValue(1,640),
        height:offsetValue(2,863),
        position:"absolute",
        top:0,
        left:curWidth/3*2,
    },
    pGameSty:{
        width:offsetValue(1,590),
        height:offsetValue(2,823),
        left:offsetValue(1,25),
        top:offsetValue(2,20),
        position:"absolute",
    },
    useInfoSty:{
        width:offsetValue(1,600),
        height:offsetValue(2,70),
        position:"absolute",
        top:0,
    },
    useInfo:{
        width:offsetValue(1,590),
        height:offsetValue(2,70),
        position:"absolute",
        left:offsetValue(1,5),
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/pc/touxiang.png)"
    },
    useName:{
        width:offsetValue(1,230),
        height:offsetValue(2,70),
        position:"absolute",
        top:0,
        left:offsetValue(1,80),
        textAlign:'center',
        lineHeight:offsetValue(2,70) + "px",
        fontSize:offsetValue(3,22),
        color:"white"
    },
    userBal:{
        width:offsetValue(1,250),
        height:offsetValue(2,70),
        position:"absolute",
        top:0,
        right:0,
        textAlign:'center',
        lineHeight:offsetValue(2,70) + "px",
        fontSize:offsetValue(3,20),
        color:textColorJson.textColor_2
    },
    gInfo:{
        width:offsetValue(1,590),
        height:offsetValue(2,200),
        position:"absolute",
        top:offsetValue(2,85),
        border:"2px solid #3a3f56",
    },
    gInfoT:{
        width:offsetValue(1,590),
        height:offsetValue(2,50),
        position:"absolute",
        left:0,
        top:0,
        backgroundColor:textColorJson.textColor_4,
    },
    gInfoTimg:{
        width:offsetValue(3,22),
        height:offsetValue(3,22),
        position:"absolute",
        left:offsetValue(1,15),
        top:offsetValue(2,14),
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/pc/qi_icon.png)"        
    },
    gInfoText:{
        width:offsetValue(1,280),
        height:offsetValue(2,50),
        position:"absolute",
        left:offsetValue(1,70),
        textAlign:"left",
        lineHeight:offsetValue(2,50) + "px",
        color:"white",
        fontSize:offsetValue(3,22)        
    },
    gInfoTime:{
        width:offsetValue(1,200),
        height:offsetValue(2,50),
        position:"absolute",
        right:offsetValue(1,20),
        textAlign:"right",
        lineHeight:offsetValue(2,50) + "px",
        color:textColorJson.textColor_1,
        fontSize:offsetValue(3,22)
    },
    gInfoB:{
        width:offsetValue(1,590),
        height:offsetValue(2,150),
        position:"absolute",
        left:0,
        top:offsetValue(2,50),        
    },
    topRightDiv_2:{
        width:offsetValue(1,590),
        height:offsetValue(2,50),
        position:"absolute",
        top:0,
        left:0,
    },
    topRightDiv_com:{
        width:offsetValue(1,200),
        height:offsetValue(2,50),
        color:textColorJson.textColor_2,
        position:"absolute",
        left:offsetValue(1,20),
        top:0,
        textAlign:"left",
        lineHeight:offsetValue(2,50) + "px",
        fontSize:offsetValue(3,20),
    },
    topRightDiv_2_com:{
        width:offsetValue(1,340),
        height:offsetValue(2,50),
        color:textColorJson.textColor_6,
        position:"absolute",
        right:offsetValue(1,20),
        top:0,
        textAlign:"right",
        lineHeight:offsetValue(2,50) + "px",
        fontSize:offsetValue(3,20),
    },
    topRightDiv_3:{
        width:offsetValue(1,590),
        height:offsetValue(2,50),
        position:"absolute",
        top:offsetValue(2,50),
        left:0,
    },
    topRightDiv_3_1:{
        width:offsetValue(1,340),
        height:offsetValue(2,50),
        position:"absolute",
        right:offsetValue(1,20),
        top:0,
    },
    tRDiv_1:{
        width:offsetValue(1,200),
        height:offsetValue(2,40),
        position:"absolute",
        backgroundColor:textColorJson.textColor_8,
        left:offsetValue(1,80),
        top:offsetValue(2,5)
    },
    tRDiv_1_1:{
        width:offsetValue(1,100),
        height:offsetValue(2,40),
        position:"absolute",
        left:0,
        top:0,
        textAlign:"right",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,20), 
        color:textColorJson.textColor_1 
    },
    tRDiv_1_2:{
        width:offsetValue(1,100),
        height:offsetValue(2,40),
        position:"absolute",
        right:0,
        top:0,
        textAlign:"left",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,20),
        color:textColorJson.textColor_6 
    },
    tRDiv_2:{
        width:offsetValue(1,60),
        height:offsetValue(2,50),
        position:"absolute",
        right:0,
        top:0,
        textAlign:"right",
        lineHeight:offsetValue(2,50) + "px",
        fontSize:offsetValue(3,20),
        color:textColorJson.textColor_1                         
    },
    topRightDiv_4:{
        width:offsetValue(1,590),
        height:offsetValue(2,50),
        position:"absolute",
        top:offsetValue(2,100),
        left:0,
    },
    winInfo:{
        width:offsetValue(1,594),
        height:offsetValue(2,200),
        backgroundColor:textColorJson.textColor_4,
        top:offsetValue(2,305),
        position:"absolute"
    },
    wInfoTimg:{
        width:offsetValue(3,26),
        height:offsetValue(3,26),
        position:"absolute",
        left:offsetValue(1,15),
        top:offsetValue(2,12),
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/pc/newkaijiang.png)" 
    },
    lottetyNum:{
        width:offsetValue(1,300),
        height:offsetValue(2,50),
        left:0,
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,50) + "px",
        fontSize:offsetValue(3,20),
        color:textColorJson.textColor_2
    },
    winNum:{
        width:offsetValue(1,300),
        height:offsetValue(2,50),
        right:0,
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,50) + "px",
        fontSize:offsetValue(3,20),
        color:textColorJson.textColor_5
    },
    winLine:{
        width:offsetValue(1,2),
        height:offsetValue(2,120),
        position:"absolute",
        top:offsetValue(2,15),
        left:offsetValue(1,299),
        backgroundColor:textColorJson.textColor_2
    },
    blockInfo:{
        width:offsetValue(1,594),
        height:offsetValue(2,300),
        position:"absolute",
        top:offsetValue(2,524),
        backgroundColor:textColorJson.textColor_4,
    },
    cenTopDiv:{
        width:offsetValue(1,594),
        height:offsetValue(2,50),
        position:"absolute",
        top:0,
        left:0,
    },
    cenTopImg:{
        width:offsetValue(3,30),
        height:offsetValue(3,30),
        position:"absolute",
        left:offsetValue(1,20),
        top:offsetValue(2,10),
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/pc/qukuailian.png)"
    },
    cenTopText:{
        width:offsetValue(1,200),
        height:offsetValue(2,50),
        position:"absolute",
        left:offsetValue(1,65),
        fontSize:offsetValue(3,20),
        color:"white",
        textAlign:"left",
        lineHeight:offsetValue(2,50) + "px",
    },
    cenTopTime:{
        width:offsetValue(1,150),
        height:offsetValue(2,30),
        position:"absolute",
        right:offsetValue(1,10),
        border:"2px solid #3a3f56",
        top:offsetValue(2,5),
        borderRadius:18,
    },
    cenTopTimeImg:{
        width:offsetValue(3,30),
        height:offsetValue(3,30),
        position:"absolute",
        left:offsetValue(1,5),
        top:0,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/example/time_icon.png)"       
    },
    cenTopTimeSeconds:{
        width:offsetValue(1,105),
        height:offsetValue(2,30),
        position:"absolute",
        right:offsetValue(1,8),
        top:0,
        fontSize:offsetValue(3,20),
        color:textColorJson.textColor_2,
        textAlign:"center",
        lineHeight:offsetValue(2,30) + "px",
    },
    cenBotDiv:{
        width:offsetValue(1,594),
        height:offsetValue(2,250),
        position:"absolute",
        top:offsetValue(2,50),
        left:0, 
    },
    blockNumDiv:{
        width:offsetValue(1,100),
        height:offsetValue(2,50),
        top:0,
        color:textColorJson.textColor_2,
        left:offsetValue(1,20),
        textAlign:"left",
        lineHeight:offsetValue(2,50) + "px",
        fontSize:offsetValue(3,20),
        position:"absolute"
    },
    blockValueDiv:{
        width:offsetValue(1,360),
        height:offsetValue(2,50),
        top:0,
        color:textColorJson.textColor_1,
        textAlign:"center",
        lineHeight:offsetValue(2,50) + "px",
        fontSize:offsetValue(3,20),
        position:"absolute",
        left:offsetValue(1,120),
    },
    blockTimeDiv:{
        width:offsetValue(1,100),
        height:offsetValue(2,50),
        top:0,
        color:"#6f7897",
        textAlign:"right",
        lineHeight:offsetValue(2,50) + "px",
        fontSize:offsetValue(3,20),
        position:"absolute",
        right:offsetValue(1,20),
    },
    inviteStr:{
        width:curWidth,
        height:offsetValue(2,863),
        backgroundColor:"rgba(0,0,0,0.9)",
        position:"absolute",
        top:0
    },
    invitePage:{
        width:offsetValue(1,640),
        height:offsetValue(2,823),
        top:offsetValue(2,20),
        left:offsetValue(1,640),
        position:"absolute"
    }   
}
module.exports = pGame;