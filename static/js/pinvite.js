import React from 'react';
import Tool from '../../src/common/tools';

const getLanguage = Tool.GetLanguage;
const offsetValue = Tool.offsetValue;
const curWidth = offsetValue(1,640);
const curHeight = offsetValue(2,823);
const mobileWidth = Tool.mobileWidth;
const mobileHeight = Tool.mobileHeight;
const color = Tool.textColorJson;

const itemtop = 18;

class Pinvite extends React.Component{
    constructor(props){
        super(props);
        this.state = {
                        inviteInfo:getLanguage("inviteInfo"),
                        invitelink:"",
                        inviteContent:getLanguage("inviteContent"),
                        inviteItem:getLanguage("inviteItem"),
                        subordinates:[],
                        initDivType:[Tool.CheckCurrentOs().isPc],
                        referee:getLanguage("TIP_6"),
                        code:getLanguage("TIP_5"),
                        inputBefor:getLanguage("TIP_7"),
                        superior:""
                     };

        this.itemClick = this.itemClick.bind(this);
    }

    componentDidMount(){
    	var inviteBtn = document.getElementsByName("inviteBtn");
        for(var i = 1; i <= 3; i++){
        	var page = document.getElementById("invitePage_" + i);
        	page.style.display = i == 1 ?"block":"none";

        	inviteBtn[i - 1].style.color = i == 1?color.textColor_1:color.textColor_2;
        }
    }

    itemClick(event){
        let index = parseInt(event.target.getAttribute('data-index'));
        if(this.starImg == null){
            this.starImg = document.getElementById("inviteStarImg");
        }
        this.starImg.style.left = (curWidth/3 - offsetValue(1,120))*0.5 + curWidth/3*(index - 1) + "px"; 
        var inviteBtn = document.getElementsByName("inviteBtn");
        for(var i = 1; i <= 3; i++){
        	var page = document.getElementById("invitePage_" + i);
        	page.style.display = i != index ?"none":"block";

        	inviteBtn[i - 1].style.color = i != index?color.textColor_2:color.textColor_1;
        }          
    }

    changeInviteLanguage = () =>{
        console.log("++++++++++++++++++++");
    	var curInvite = this.state.invitelink; 
    	if(!window.gameInfo || !window.gameInfo.accountsInfo){
    		curInvite = getLanguage("TIP_4");
    	}else{
    		if(window.gameInfo.accountsInfo){
    			curInvite = window.gameInfo.accountsInfo.name;
    		}    		
    	}

    	this.setState({
            inviteInfo:getLanguage("inviteInfo"),
            inviteContent:getLanguage("inviteContent"), 
            inviteItem:getLanguage("inviteItem"),
            referee:getLanguage("TIP_6"),
            code:getLanguage("TIP_5"),
            invitelink:curInvite,
            inputBefor:getLanguage("TIP_7"),
    	});

    	var invitePage = document.getElementById("invitePage_1");
    	var imgPath = Tool.GetCurLanguage() == "cn"?"url(./static/img/example/img.png)":"url(./static/img/example/img_en.png)";
    	invitePage.style.backgroundImage = imgPath;
    }

    changeStateInfo = () =>{

    	var curInvite = this.state.invitelink;
    	if(window.gameInfo && window.gameInfo.accountsInfo){
    		curInvite = window.gameInfo.accountsInfo.name;		
    	}else{
    		curInvite = getLanguage("TIP_4"); 		
    	}

    	var subordinates = this.state.subordinates;
    	var superior = this.state.superior;
    	if(window.gameInfo && window.gameInfo.accountinfor){
    		subordinates = window.gameInfo.accountinfor;
    		if(window.gameInfo.superior){
    			superior = window.gameInfo.superior;
    		}
    	}

    	this.setState({invitelink:curInvite,subordinates:subordinates,superior:superior});
    }

    btnOnMouseDown = (event) => {
    	console.log("按下事件");
    	event.target.style.color = color.textColor_5;
    }

    btnOnMouseUp = (event) => {
    	event.target.style.color = "white";
    	if(!window.gameInfo.accountsInfo){
    		this.startShowMsg(getLanguage("TIP_19"));    		
    		return;
    	}
    	var invitelink = document.getElementById("invitelink").innerText;
    	var textareaLink = document.getElementById("textareaLink");
    	textareaLink.value = invitelink;
    	textareaLink.select();
    	document.execCommand("copy");
    	this.startShowMsg(getLanguage("TIP_20"));
    }

    copyClickDown = (event) => {
    	console.log("***********************copyClickDown");
    	var copyBg = document.getElementById("copyBg");
    	copyBg.style.display = "block";
    	event.target.style.color = color.textColor_5;
    }

    copyClickUp = (event) => {
    	var copyBg = document.getElementById("copyBg");
    	copyBg.style.display = "none";
    	event.target.style.color = "white";
    	if(!window.gameInfo.accountsInfo){
    		this.startShowMsg(getLanguage("TIP_19"));

    		return;
    	}
    	console.log("***********************copyClickUp");
    	var invitelink = document.getElementById("invitelink").innerText;
    	var textareaLink = document.getElementById("textareaLink");
    	textareaLink.value = invitelink;
    	textareaLink.select();
    	document.execCommand("copy");
    	this.startShowMsg(getLanguage("TIP_20"));    	
    }

    copyClickCancel = (event) => {
    	var copyBg = document.getElementById("copyBg");
    	copyBg.style.display = "none";
    	event.target.style.color = "white";
    	console.log("***************copyClickCancel")
    }

    startShowMsg = (str) =>{
    	Tool.SetMsgInfo(str);
    	this.props.showTipMsg();
    }

    clickDown = (event) => {
    	event.target.style.color = color.textColor_6;
    	var enterBg = document.getElementById("enterBg");
    	enterBg.style.display = "block";
    }

    clickUp = (event) => {
    	event.target.style.color = "white";
    	var enterBg = document.getElementById("enterBg");
    	enterBg.style.display = "none";
    	var inputInvite = document.getElementById("inputInvite");
    	if(!window.gameInfo.accountsInfo){
    		this.startShowMsg(getLanguage("TIP_19"));
    		inputInvite.value = "";
    		return;
    	}    	
    	console.log(inputInvite.value);
    	if(window.netInfo && window.gameInfo.accountsInfo && inputInvite.value.length > 0){
    		window.netInfo.visitplayer({ "user":window.gameInfo.accountsInfo.name, "visitor":inputInvite.value},{ authorization: [window.gameInfo.accountsInfo.name + '@active'] });
    	}
    	inputInvite.value = "";
    }

    clickCancel = (event) => {
    	event.target.style.color = "white";
    	var enterBg = document.getElementById("enterBg");
    	enterBg.style.display = "none";
    }

    inputChange = (event) => {
        
    }

    render(){
    	return(
            <div id = "InvitePage" style = {styleInfo.centerDiv}>
                <div style = {styleInfo.starInfoDiv}>
                  <div style = {styleInfo.starDiv}>
                    {
                      this.state.inviteInfo.map((item,index) =>{
                        if (index < 3){
                            return(
                              <div key = {index + 1} 
                                style = {styleInfo["buttonName_" + index]}
                                onClick={this.itemClick}
                                data-index={index + 1}
                                name = "inviteBtn"
                              >{item}</div>
                            );
                        }         
                      })
                    }
                  </div>
                  <div style = {styleInfo.starLineDiv}></div>
                  <div id = "inviteStarImg" style = {styleInfo.choiceStarImg}></div>
                </div>

                <div style = {styleInfo.midDiv}>
                    <div id = "invitePage_1" style = {styleInfo.linkImage}>
                    	{
                    		this.state.initDivType.map((item,index) => {
                                if(this.state.superior != ""){
                                    return(
                                        <div key = {index} style = {styleInfo.mobileInviteSty}>
                                            <div style = {{width:curWidth,height:offsetValue(2,100),position:"absolute",top:0}}>
                                                <div style = {styleInfo.mInviteText}>{this.state.code}</div>
                                                <div style = {styleInfo.mInviteBg}>
                                                    <div id = "invitelink" style = {styleInfo.mInviteLink}>{this.state.invitelink}</div>
                                                </div>
                                                <div style = {styleInfo.copyDiv}>
                                                    <div id = "copyBg" style = {styleInfo.copyBg}></div>
                                                    <textarea id = "textareaLink" style = {{opacity:0}}></textarea>
                                                    <div style = {styleInfo.copyText}
                                                        onMouseDown = {this.copyClickDown}
                                                        onMouseUp = {this.copyClickUp}
                                                        onMouseOut = {this.copyClickCancel}
                                                    >{this.state.inviteInfo[3]}</div>
                                                </div>
                                            </div>
                                            <div style = {{width:curWidth,height:offsetValue(2,100),position:"absolute",top:offsetValue(2,100)}}>
                                                <div style = {styleInfo.mInviteText}>{this.state.inviteInfo[5]}</div>
                                                <div style = {styleInfo.mInviteBg}>
                                                    <div style = {styleInfo.mInviteLink}>{this.state.superior}</div>
                                                </div>                                                                                          
                                            </div>                                                                                      
                                        </div>
                                    );
                                }else{
                                    return(
                                        <div key = {index} style = {styleInfo.mobileInviteSty}>
                                            <div style = {{width:curWidth,height:offsetValue(2,100),position:"absolute",top:0}}>
                                                <div style = {styleInfo.mInviteText}>{this.state.code}</div>
                                                <div style = {styleInfo.mInviteBg}>
                                                    <div id = "invitelink" style = {styleInfo.mInviteLink}>{this.state.invitelink}</div>
                                                </div>
                                                <div style = {styleInfo.copyDiv}>
                                                    <div id = "copyBg" style = {styleInfo.copyBg}></div>
                                                    <textarea id = "textareaLink" style = {{opacity:0}}></textarea>
                                                    <div style = {styleInfo.copyText}
                                                        onMouseDown = {this.copyClickDown}
                                                        onMouseUp = {this.copyClickUp}
                                                        onMouseOut = {this.copyClickCancel}
                                                    >{this.state.inviteInfo[3]}</div>
                                                </div>
                                            </div>
                                            <div style = {{width:curWidth,height:offsetValue(2,100),position:"absolute",top:offsetValue(2,100)}}>
                                                <div style = {styleInfo.mInviteText}>{this.state.referee}</div>
                                                <div style = {styleInfo.mInviteBg}>
                                                    <input id = "inputInvite" style = {styleInfo.mInput} type = 'text' placeholder = {this.state.inputBefor} 
                                                    onChange = {this.inputChange} /> 
                                                </div>
                                                <div style = {styleInfo.enterDiv}>
                                                    <div id = "enterBg" style = {styleInfo.enterBg}></div>
                                                    <div style = {styleInfo.copyText}
                                                        onMouseDown = {this.clickDown}
                                                        onMouseUp = {this.clickUp}
                                                        onMouseOut = {this.clickCancel}
                                                    >{this.state.inviteInfo[4]}</div>
                                                </div>                                                                                          
                                            </div>
                                        </div>
                                    );
                                }
                    		})
                    	}

                    </div>

                    <div id = "invitePage_3" style = {{width: curWidth,height: offsetValue(2, 740),position: "absolute"}}>
                        <div style = {styleInfo.ruleContentBg}>
                            {
                                this.state.inviteContent.map((item, index) => {
                                    if(index % 2 == 0){
                                        return (<div key = {index} style={styleInfo.ruleTitle}>{item}<img src="./static/img/example/img_1.png" style={{width:offsetValue(1,48.6),height:offsetValue(2,18),marginLeft:offsetValue(2,10),marginTop:offsetValue(2,12),position:"absolute"}} /></div>)
                                    } else {
                                        return (<div key = {index} style={styleInfo.ruleContent} dangerouslySetInnerHTML={{__html:item}}></div>)
                                    }
                                })
                           }
                        </div>
                       
                    </div>

                    <div id = "invitePage_2">
                        <div style={styleInfo.accountText}>{this.state.inviteItem[0]}</div>
                        <div style={styleInfo.totleNumText}>{this.state.inviteItem[1]}</div>
                        <div style={styleInfo.totleNumStr}>{this.state.subordinates.length}</div>
                        <div style={styleInfo.subordinatesBg} id = "subordinate">
                            {
                                this.state.subordinates.map((item,index) =>{
                                	var itemBg = {
                                		width:curWidth-offsetValue(1,80),
								        height:offsetValue(2,120),
								        backgroundColor:color.textColor_12,
								        position:"absolute",
								        top:offsetValue(2,140)*index
                                	}
                                    return(
                                      <div key={index} style={itemBg}>
                                        <div style={styleInfo.itemIcon}></div>
                                        <div style={styleInfo.itemName}>{item.name}</div>
                                        {/*<div style={styleInfo.itemJe}>{this.state.inviteItem[2]+item.num}</div>*/}
                                      </div>
                                    );     
                                  })
                            }
                        </div>     
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
        backgroundColor:color.textColor_7
    },

    midDiv:{
        width: curWidth,
        height: offsetValue(2, 740),
        position: "absolute",
        top: offsetValue(2,itemtop + 60),
    },

    ruleContentBg:{
        width: curWidth,
        height: offsetValue(2, 600),
        position: "absolute",
        top: offsetValue(2, 30),
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
        width:curWidth/3,
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
        width:curWidth/3,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,18),
        color:color.textColor_1,
        left:curWidth/3
    },
    buttonName_2:{
        width:curWidth/3,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,18),
        color:color.textColor_1,
        left:curWidth/3*2
    },

    choiceStarImg:{
        width:offsetValue(1,120),
        height:offsetValue(2,3),
        position:"absolute",
        left:(curWidth/3 - offsetValue(1,120))*0.5,
        top:offsetValue(2,50),
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/example/xiahuaxian2.png)"      
    },
    starLineDiv:{
        width:curWidth - (curWidth/5 - offsetValue(1,100)),
        height:offsetValue(2,2),
        position:"absolute",
        left:(curWidth/5 - offsetValue(1,100))*0.5,
        top:offsetValue(2,52),
        backgroundColor:"#41455a"
    },

    linkImage:{
        width:curWidth,
        height:offsetValue(2,496),
        position:"absolute",
        left:0,
        top:0,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/example/img.png)" 
    },

    inviteLinkBg:{
        width:curWidth-offsetValue(1,240),
        height:offsetValue(2,50),
        position:"absolute",
        left:offsetValue(1,70),
        top:offsetValue(2,550),
        border:"2px solid #6f7597",
        textAlign:"center",
        lineHeight:offsetValue(2,50) + "px",
        color:color.textColor_2,
        fontSize:offsetValue(3,16),
    },

    inviteBtn:{
        width:offsetValue(1,94.5),
        height:offsetValue(2,54),
        position:"absolute",
        left:curWidth-offsetValue(1,166),
        top:offsetValue(2,550),
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/example/copyBtn.png)" ,
        textAlign:"center",
        lineHeight:offsetValue(2,54) + "px",
        color:"white",
        fontSize:offsetValue(3,18)
    },
    ruleTitle:{
        height:offsetValue(2,40),   
        marginLeft:offsetValue(1,40),
        lineHeight:offsetValue(2,40) + "px",
        color:color.textColor_5,
        fontSize:offsetValue(3,20),
        fontStyle:"italic",
        fontWeight:"bold"
    },
    ruleTitleImg:{
        width:offsetValue(1,48.6),
        height:offsetValue(2,18),
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/example/img_1.png)" ,
    },
    ruleContent:{
        width:curWidth - offsetValue(1,100),
        marginLeft:offsetValue(1,40),
        marginBottom: offsetValue(1,30),
        color:"white",
        fontSize:offsetValue(3,15),
    },
    accountText:{
        height:offsetValue(2,40),  
        position:"absolute", 
        left:offsetValue(1,40),
        lineHeight:offsetValue(2,40) + "px",
        color:"white",
        fontSize:offsetValue(3,20),
    },
    totleNumText:{
        height:offsetValue(2,40), 
        position:"absolute",  
        right:offsetValue(1,80),
        lineHeight:offsetValue(2,40) + "px",
        color:color.textColor_1,
        fontSize:offsetValue(3,20),
    },
    totleNumStr:{
        height:offsetValue(2,40), 
        position:"absolute",  
        right:offsetValue(1,60),
        lineHeight:offsetValue(2,40) + "px",
        color:color.textColor_6,
        fontSize:offsetValue(3,20)
    },
    subordinatesBg:{
        width:curWidth - offsetValue(1,80),
        height:offsetValue(2,680),
        position:"absolute",
        left:offsetValue(1,40),
        top:offsetValue(2,itemtop+50),
    },

    itemIcon:{
        width:offsetValue(3,80),
        height:offsetValue(3,80),
        left:offsetValue(1,10),
        top:offsetValue(2,20),
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:"url(./static/img/example/touxiang2.png)" ,
        position:"absolute",
    },
    itemName:{
        width:offsetValue(1,300),
        height:offsetValue(2,120),
        left:offsetValue(1,120),
        lineHeight:offsetValue(2,120) + "px",
        color:color.textColor_1,
        fontSize:offsetValue(3,20),
        position:"absolute",
        textAlign:"left",
    },
    itemJe:{
        width:offsetValue(1,300),
        height:offsetValue(2,60),
        left:offsetValue(1,120),
        lineHeight:offsetValue(2,60) + "px",
        color:color.textColor_6,
        fontSize:offsetValue(3,20),
        position:"absolute",
        textAlign:"left",
        bottom:offsetValue(2,15)
    },
    mobileInviteSty:{
        width:curWidth,
        height:offsetValue(2,200),
        top:offsetValue(2,510),
        position:"absolute"
    },

    mInviteText:{
    	width:curWidth - offsetValue(1,60),
    	height:offsetValue(2,40),
    	top:0,
    	position:"absolute",
    	left:offsetValue(1,30),
    	textAlign:"left",
    	lineHeight:offsetValue(2,40) + "px",
    	color:color.textColor_2,
    	fontSize:offsetValue(3,20)
    },

    mInviteBg:{
    	width:offsetValue(1,440),
    	height:offsetValue(2,60),
    	backgroundColor:color.textColor_15,
    	borderRadius:5,
    	position:"absolute",
    	left:offsetValue(1,30),
    	top:offsetValue(2,40)
    },
    mInviteLink:{
    	width:offsetValue(1,440),
    	height:offsetValue(2,60),
    	position:"absolute",
    	textAlign:"center",
    	lineHeight:offsetValue(2,60) + "px",
    	color:color.textColor_1,
    	fontSize:offsetValue(3,18)
    },
    mInput:{
    	width:offsetValue(1,440),
    	height:offsetValue(2,60),
    	position:"absolute",
    	border:"none",
    	backgroundColor:color.textColor_15,
    	color:color.textColor_11,
    	textAlign:"center",
    	fontSize:offsetValue(3,20),
    	outline:"none"
    },
    copyDiv:{
    	width:offsetValue(1,120),
    	height:offsetValue(2,60),
    	position:"absolute",
    	backgroundImage:"url(./static/img/example/fuzhi.png)" ,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        top:offsetValue(2,40),
        left:offsetValue(1,490)    	
    },
    enterDiv:{
    	width:offsetValue(1,120),
    	height:offsetValue(2,60),
    	position:"absolute",
    	backgroundImage:"url(./static/img/example/tijiao.png)" ,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        top:offsetValue(2,40),
        left:offsetValue(1,490)   
    },
    copyBg:{
    	width:offsetValue(1,116),
    	height:offsetValue(2,56),
    	position:"absolute",
    	backgroundImage:"url(./static/img/example/fuzhi_curr.png)",
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat', 
        top:offsetValue(2,2),
        left:offsetValue(1,2),
        display:"none"	
    },
    copyText:{
    	width:offsetValue(1,116),
    	height:offsetValue(2,56),
    	position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,56) + "px",
        color:"white",
        fontSize:offsetValue(3,22),
        top:offsetValue(2,2),
        left:offsetValue(1,2),
    },
    enterBg:{
    	width:offsetValue(1,116),
    	height:offsetValue(2,56),
    	position:"absolute",
    	backgroundImage:"url(./static/img/example/tijiao_curr.png)",
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat', 
        top:offsetValue(2,2),
        left:offsetValue(1,2),
        display:"none"
    },
}

module.exports = Pinvite;