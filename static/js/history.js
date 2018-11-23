import React from 'react';
import Tool from '../../src/common/tools';


const getLanguage = Tool.GetLanguage;
const offsetValue = Tool.offsetValue;
const curWidth = Tool.curWidth;
const curHeight = Tool.curHeight;
const mobileWidth = Tool.mobileWidth;
const mobileHeight = Tool.mobileHeight;
const color = Tool.textColorJson;

const itemtop = 18;

class History extends React.Component{
    constructor(props){
        super(props);
        this.state = {
                        historyInfo:getLanguage("historyInfo"),
                        lotteryRecord:getLanguage("lotteryRecord"),
                        gameRecord:getLanguage("gameRecord"),
                        recordItem:[],


                                       //order:订单号 no：期号  num:下注号码 BS 0大1小  OE 0单1双
                        ordersItem:[],
                     };
    }

    componentDidMount(){
        var page = document.getElementById("page_2");
        page.style.display = "none";

        var historyBtn = document.getElementsByName("historyBtn");
        for (var i = 1; i <= 2; i++) {
			historyBtn[i - 1].style.color = i == 1?color.textColor_1:color.textColor_2;
        }
    }

    itemClick = (event) => {
        let index = parseInt(event.target.getAttribute('data-index'));
        if(this.starImg == null){
            this.starImg = document.getElementById("historyImg");
        }
        this.starImg.style.left = (curWidth/2 - offsetValue(1,300))*0.5 + curWidth/2*(index - 1) + "px";
        var historyBtn = document.getElementsByName("historyBtn");
        for(var i = 1; i <= 2; i++){
        	var page = document.getElementById("page_" + i);
        	page.style.display = i != index ? "none":"block";
        	historyBtn[i - 1].style.color = i != index?color.textColor_2:color.textColor_1;       	
        }
    }

    changeHistoryLanguage = () =>{
    	this.setState({
            historyInfo:getLanguage("historyInfo"),
            lotteryRecord:getLanguage("lotteryRecord"), 
            gameRecord:getLanguage("gameRecord"),  		
    	});
    }

    changeStateInfo = () =>{
    	console.log("刷新历史界面数据",window.gameInfo.openWinInfo);
    	var thisRecordItem = this.state.recordItem;
    	if(window.gameInfo && window.gameInfo.openWinInfo){
    		var openWinInfo = window.gameInfo.openWinInfo.slice(0);
    		var itemList = [];
    		for(var i = openWinInfo.length - 1;i >= 0; i--){
    			var itemInfo = {};
    			var lotterytime = openWinInfo[i].lotterytime*1000;
    			var curDate = new Date(lotterytime);
    			itemInfo.time = (curDate.getMonth() + 1) + "/" + curDate.getDate() + "  " 
    							+ curDate.getHours() + ":" 
    							+ (curDate.getMinutes() < 10?("0" + curDate.getMinutes()):curDate.getMinutes());
    			itemInfo.term = openWinInfo[i].idlott;
    			itemInfo.num = openWinInfo[i].numinfo;
    			var lastStr = Number(itemInfo.num[itemInfo.num.length - 1]);
    			itemInfo.BS = lastStr > 4 ?true:false;
    			itemInfo.OE = lastStr%2 == 0?false:true;
    			itemList.push(itemInfo);
    		}
    		if(itemList.length > 0){
    			thisRecordItem = itemList;
    		}
    	}

    	var thisOrdersItem = this.state.ordersItem;
    	if(window.gameInfo && window.gameInfo.bethistoryer){
    		var itemList = [];
    		var bethistoryer = window.gameInfo.bethistoryer.slice(0);
    		bethistoryer.sort(function(a,b){return b.id - a.id});
    		console.log(bethistoryer);
    		for(var i = 0; i < bethistoryer.length;i++){
    			if(bethistoryer[i].issuccess == 1){
	    			var itemInfo = {};
	    			var lotterytime = bethistoryer[i].bet_time*1000;
					var curDate = new Date(lotterytime);
	    			itemInfo.time = (curDate.getMonth() + 1) + "/" + curDate.getDate() + "  " 
	    							+ curDate.getHours() + ":" 
	    							+ (curDate.getMinutes() < 10?("0" + curDate.getMinutes()):curDate.getMinutes()); 
	    			itemInfo.order = bethistoryer[i].id;
	    			var rewords = Number(bethistoryer[i].rewords.split(" EOS")[0]);
	    			itemInfo.type = rewords > 0?1:0;
	    			itemInfo.money = rewords > 0?rewords:(bethistoryer[i].bet_balance.split(" EOS")[0]);
	    			itemInfo.no = bethistoryer[i].bet_vision;
	    			var betInfo = bethistoryer[i].bet_info.split("|");
	    			if(betInfo[0] == 1){
	    				var firstStr = betInfo[1];
	    				if(firstStr.indexOf(",") > -1){
	    					firstStr = firstStr.split(",");
	    					itemInfo.num = firstStr.toString();
	    				}else{
	    					itemInfo.num = firstStr < 10 ?firstStr:-1;
	    				}	    				
	    				var bs = betInfo[betInfo.length - 1].split(",");
	    				itemInfo.BS = Number(bs[0]) - 1;
	    				itemInfo.OE = Number(bs[1]) - 1;
	    				itemInfo.have = (itemInfo.BS >= 0 || itemInfo.OE >= 0)?true:false;
	    			}else{
	    				var strInfo = "";
		    			for(var j = betInfo.length - 2; j >= 1 ;j--){
		    				if(j <= betInfo[0]){
		    					if(betInfo[j].indexOf(",") > -1){
		    						var betList = betInfo[j].split(",");
		    						strInfo += (j == 1)?betList.join(""):(betList.join("") + "|");
		    					}else{
		    						strInfo += j == 1?betInfo[j]:(betInfo[j] + "|");
		    					}
		    					
		    				}		    				
		    			}
		    			itemInfo.num = strInfo;
		    			itemInfo.have = false;	    				
	    			}
	    			itemList.push(itemInfo);
    			}
    		}
    		if(itemList.length > 0){
    			thisOrdersItem = itemList;
    		}
    	}
    	this.setState({
    		recordItem:thisRecordItem,
    		ordersItem:thisOrdersItem
    	});
    }

    render(){
    	return(
            <div id = "historyPage" style = {styleInfo.centerDiv}>
                <div style = {styleInfo.starInfoDiv}>
                  <div style = {styleInfo.starDiv}>
                    {
                      this.state.historyInfo.map((item,index) =>{
                        if (index < 3){
                            return(
                              <div key = {index + 1} 
                                style = {styleInfo["buttonName_" + index]}
                                onClick={this.itemClick}
                                data-index={index + 1}
                                name="historyBtn"
                              >{item}</div>
                            );
                        }         
                      })
                    }
                  </div>
                  <div style = {styleInfo.starLineDiv}></div>
                  <div id = "historyImg" style = {styleInfo.choiceStarImg}></div>
                </div>

                <div id = "page_1">
                    <div style = {styleInfo.midDiv}>
                        {
                          this.state.lotteryRecord.map((item,index) =>{
                          var curStyle = {  
                                  width:curWidth/4,
                                  height:offsetValue(2,0),
                                  position:"absolute",
                                  textAlign:"center",
                                  lineHeight:offsetValue(2,40) + "px",
                                  fontSize:offsetValue(3,16),
                                  color:color.textColor_11,
                                  left:curWidth/4*index
                                };
                            return(
                              <div key = {index + 1} 
                                style = {curStyle}
                              >{item}</div>
                            );
                          })
                        }
                    </div>

                    <div style = {styleInfo.bottomDiv} id = "historyPage_1">
                        {
                            this.state.recordItem.map((item,index) =>{
                                var recordSty = {
                                    width: curWidth,
                                    height: offsetValue(2, 40),
                                    position:"absolute",
                                    top:offsetValue(2,45)*index,
                                }
                                return(
                                    <div key = {index + 1} style = {recordSty}>                                 
                                        <div style = {styleInfo.recordItem_0}>{item.time}</div>
                                        <div style = {styleInfo.recordItem_1}>{item.term}</div>
                                        <div style = {styleInfo.recordItem_2}>{item.num}</div>
                                        <div style = {styleInfo.recordItem_3}>
                                        	<span style = {{color:item.BS == true?color.textColor_6:color.textColor_1}}>{getLanguage("TIP_0")}</span>
                                        	<span style = {{color:item.BS == true?color.textColor_1:color.textColor_6}}>{getLanguage("TIP_1")}</span>
                                        	<span style = {{color:color.textColor_1}}>|</span>
                                        	<span style = {{color:item.OE == true?color.textColor_6:color.textColor_1}}>{getLanguage("TIP_2")}</span>
                                        	<span style = {{color:item.OE == true?color.textColor_1:color.textColor_6}}>{getLanguage("TIP_3")}</span>
                                        </div>
                                    </div>                                         
                                   );
                            })
                        }
                                        
                    </div>
                </div>

                <div id = "page_2">
                    <div style = {styleInfo.bottomDiv} id = "historyPage_2">
                    {
                        this.state.ordersItem.map((item,index) => {
                            var ordersItem = {
                                width:offsetValue(1,540),
                                height:offsetValue(2,219),
                                position:"absolute",
                                left:offsetValue(1,50),
                                top:offsetValue(2,230)*index,
                                backgroundSize: '100% 100%',
                                backgroundRepeat: 'no-repeat',
                                backgroundImage:"url(./static/img/example/beijingkuang.png)",      
                            }

                            var str_1 = this.state.gameRecord[0]+" /";
                            var str_2 = this.state.ordersItem[index].type==0?this.state.gameRecord[2]:this.state.gameRecord[3];
                            var str_3 = this.state.ordersItem[index].no;
                            var str_4 = this.state.ordersItem[index].money;
                            var str_5 = "";
                            str_5 = (this.state.ordersItem[index].num == -1)?"":this.state.ordersItem[index].num;
                            if(this.state.ordersItem[index].have){
								if(this.state.ordersItem[index].BS >= 0 && this.state.ordersItem[index].OE >= 0){
									str_5 += (str_5 != ""?" | ":"")
	                            		+(this.state.ordersItem[index].BS >= 0?((this.state.ordersItem[index].BS==0?this.state.gameRecord[9]:this.state.gameRecord[10]) + " | "):"")
	                            		+(this.state.ordersItem[index].OE >= 0?(this.state.ordersItem[index].OE==0?this.state.gameRecord[7]:this.state.gameRecord[8]):"");
								}else if(this.state.ordersItem[index].BS >= 0 || this.state.ordersItem[index].OE >= 0){
									str_5 += (str_5 != ""?" | ":"")
	                            		+(this.state.ordersItem[index].BS >= 0?((this.state.ordersItem[index].BS==0?this.state.gameRecord[9]:this.state.gameRecord[10])):"")
	                            		+(this.state.ordersItem[index].OE >= 0?(this.state.ordersItem[index].OE==0?this.state.gameRecord[7]:this.state.gameRecord[8]):"");
								}
                            }
                            return(
                                <div key = {index} style = {ordersItem}>
                                    <div style = {styleInfo.itembg_1}>
                                        <div style = {styleInfo.item_1}>
                                            <span style = {{color:"white",fontSize:offsetValue(3,16)}}>{str_1}</span>
                                            <span style = {{color:"white",fontSize:offsetValue(3,16),left:12,position:"relative"}}>{this.state.ordersItem[index].order}</span>                                    
                                        </div>
                                        <div style = {styleInfo.item_2}>
                                            <span style = {{color:"white",fontSize:offsetValue(3,16)}}>{this.state.gameRecord[1]}</span>
                                            <span style = {{color:this.state.ordersItem[index].type==0?"white":color.textColor_5,fontSize:offsetValue(3,16),left:12,position:"relative"}}>{str_2}</span>                                    
                                        </div>                                 
                                    </div>
                                    <div style = {styleInfo.itembg_2}>
                                        <div style = {styleInfo.item_3}>
                                            <span style = {{color:color.textColor_1,fontSize:offsetValue(3,16)}}>{this.state.gameRecord[4]}</span>
                                            <span style = {{color:color.textColor_6,fontSize:offsetValue(3,16),left:20,position:"relative"}}>{str_3}</span>
                                        </div>
                                        <div style = {styleInfo.item_2}>
                                            <span style = {{color:color.textColor_1,fontSize:offsetValue(3,16)}}>{this.state.gameRecord[5]}</span>
                                            <span style = {{color:this.state.ordersItem[index].type==0?color.textColor_1:color.textColor_5,fontSize:offsetValue(3,16),left:20,position:"relative"}}>{str_4}</span>
                                        </div>
                                    </div>
                                    <div style = {styleInfo.itembg_3}>
                                        <div style = {styleInfo.item_4}>
                                            <span style = {{color:color.textColor_1,
                                                fontSize:offsetValue(3,16),
                                                left:offsetValue(1,20),
                                                position:"absolute",
                                                textAlign:"left",
                                                lineHeight:offsetValue(2,30) + "px",
                                                height:offsetValue(2,30),                                                
                                            }}>{this.state.gameRecord[6]}</span>
                                            <span style = {
                                                {
                                                width:offsetValue(1,400),
                                                height:offsetValue(2,30),
                                                textAlign:"left",
                                                lineHeight:offsetValue(2,30) + "px",
                                                wordBreak:"break-all",
                                                whiteSpace:"normal",
                                                color:color.textColor_1,
                                                fontSize:offsetValue(3,16),
                                                left:offsetValue(1,110),
                                                position:"absolute"}
                                            }>{str_5}</span>
                                        </div>
                                    </div>
                                    <div style = {styleInfo.itembg_4}>
                                        <div style = {styleInfo.item_3}>
                                            <span style = {{color:color.textColor_1,fontSize:offsetValue(3,16)}}>{this.state.gameRecord[11]}</span>
                                            <span style = {{color:color.textColor_1,fontSize:offsetValue(3,16),left:20,position:"relative"}}>{this.state.ordersItem[index].time}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }         
                    </div>
                </div>                
            </div>
    	);
    }
}

let styleInfo = {
    centerDiv:{
        width: curWidth,
        height: offsetValue(2, 823),
        position: "absolute",
        top: 0,
    },
    midDiv:{
        width: curWidth,
        height: offsetValue(2, 30),
        position: "absolute",
        top: offsetValue(2,itemtop + 50),
    },
    bottomDiv:{
        width: curWidth,
        height: offsetValue(2, 700),
        position: "absolute",
        top: offsetValue(2,itemtop + 100),
    },
    
    starInfoDiv:{
        width:curWidth,
        height:offsetValue(2,60),
        position:"absolute",
        left:0,
        top:offsetValue(2,itemtop),
    },
    starDiv:{
        width:curWidth,
        height:offsetValue(2,40),
        position:"absolute",
        left:0,
        top:offsetValue(2,10),
    },
    buttonName_0:{
        width:curWidth/2,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,18),
        color:color.textColor_1,
        left:0,
        top:0
    },
    buttonName_1:{
        width:curWidth/2,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,18),
        color:color.textColor_1,
        left:curWidth/2
    },
    choiceStarImg:{
        width:offsetValue(1,300),
        height:offsetValue(2,3),
        position:"absolute",
        left:(curWidth/2 - offsetValue(1,300))*0.5,
        top:offsetValue(2,50),
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/example/xiahuanxian3.png)"      
    },
    starLineDiv:{
        width:curWidth - (curWidth/5 - offsetValue(1,100)),
        height:offsetValue(2,2),
        position:"absolute",
        left:(curWidth/5 - offsetValue(1,100))*0.5,
        top:offsetValue(2,52),
        backgroundColor:"#41455a"
    },
    recordItem_0:{
        width:curWidth/4,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,16),
        color:color.textColor_2,
        left:0
    },
    recordItem_1:{
        width:curWidth/4,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,16),
        color:"white",
        left:curWidth/4*1
    },
    recordItem_2:{
        width:curWidth/4,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,16),
        color:color.textColor_2,
        left:curWidth/4*2
    },
    recordItem_3:{
        width:curWidth/4,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,16),
        left:curWidth/4*3
    },
    
    itembg_1:{
        width:offsetValue(1,500),
        height:offsetValue(2,30),
        position:"absolute",
        left:offsetValue(1,20),
        top:offsetValue(2,20),
    },

    item_1:{
        width:offsetValue(1,250),
        height:offsetValue(2,30),
        position:"absolute",
        left:offsetValue(1,20),
        top:0,
        textAlign:"left",
        lineHeight:offsetValue(2,30) + "px",
        fontSize:offsetValue(3,16),
        color:"white",
    },
    item_2:{
        width:offsetValue(1,400),
        height:offsetValue(2,30),
        position:"absolute",
        right:offsetValue(1,40),
        top:0,
        textAlign:"right",
        lineHeight:offsetValue(2,30) + "px",
    },

    item_3:{
        width:offsetValue(1,480),
        height:offsetValue(2,30),
        position:"absolute",
        left:offsetValue(1,20),
        top:0,
        textAlign:"left",
        lineHeight:offsetValue(2,30) + "px",
    },
    item_4:{
        width:offsetValue(1,500),
        height:offsetValue(2,60),
        position:"absolute",
        left:0,
        top:0,
        textAlign:"left",
        lineHeight:offsetValue(2,30) + "px"
    },

    itembg_2:{
        width:offsetValue(1,500),
        height:offsetValue(2,30),
        position:"absolute",
        left:offsetValue(1,20),
        top:offsetValue(2,70),
    },
    itembg_3:{
        width:offsetValue(1,500),
        height:offsetValue(2,30),
        position:"absolute",
        left:offsetValue(1,20),
        top:offsetValue(2,120),
    },

    itembg_4:{
        width:offsetValue(1,500),
        height:offsetValue(2,30),
        position:"absolute",
        left:offsetValue(1,20),
        top:offsetValue(2,175),
    },
}


module.exports = History;