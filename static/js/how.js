import React from 'react';
import Tool from '../../src/common/tools';

const getLanguage = Tool.GetLanguage;
const offsetValue = Tool.offsetValue;
const curWidth = Tool.curWidth;
const curHeight = Tool.curHeight;
const mobileWidth = Tool.mobileWidth;
const mobileHeight = Tool.mobileHeight;
const itemOffset = 8;
const itemtop = 18;
const color = Tool.textColorJson;
let curPage = 1;

class How extends React.Component{
    constructor(props){
        super(props);
        this.state = {
                        howInfo:getLanguage("howInfo"),
                        howContent:getLanguage("howContent"),
                        curText:"",
                     };

        this.itemClick = this.itemClick.bind(this);
    }

    componentDidMount(){
        // this.buttonName = document.getElementsByName("howBtn")[0];
        var howBtn = document.getElementsByName("howBtn");
        for(var i = 0; i < 4; i++){
            howBtn[i].style.color = i == 0?"white":color.textColor_2;
        }


        this.setState({curText:this.state.howContent[0]});
    }

    changeHowLanguage = () =>{
    	this.setState({
            howInfo:getLanguage("howInfo"),
            howContent:getLanguage("howContent"), 
            curText:getLanguage("howContent")[curPage - 1],		
    	});
    }

    
    itemClick(event){
        let index = parseInt(event.target.getAttribute('data-index'));
        if(this.starImg == null){
            this.starImg = document.getElementById("howLineImg");
        }

        console.log(index);
        this.starImg.style.left = (curWidth/4 - offsetValue(1,120))*0.5 + curWidth/4*index + "px"; 
        console.log(this.starImg.style.left);
        var howBtn = document.getElementsByName("howBtn");
        for(var i = 0; i < 4; i++){
            howBtn[i].style.color = i != index?color.textColor_2:"white";       
        }  
        
        this.setState({curText:this.state.howContent[index]});   

        curPage = index + 1;    
    }


    render(){
    	return(
            <div id = "HowPage" style = {styleInfo.centerDiv}>
                <div style = {styleInfo.starInfoDiv}>
                  <div style = {styleInfo.starDiv}>
                    {
                      this.state.howInfo.map((item,index) =>{
                        return(
                              <div key = {index} 
                                style = {styleInfo["buttonName_" + index]}
                                onClick={this.itemClick}
                                data-index={index}
                                name = "howBtn"
                              >{item}</div>
                            );    
                      })
                    }
                  </div>
                  <div style = {styleInfo.starLineDiv}></div>
                  <div id = "howLineImg" style = {styleInfo.choiceStarImg}></div>
                </div>
                <div id = "howShow" style = {styleInfo.cenBotDiv} dangerouslySetInnerHTML={{__html:this.state.curText}}></div>
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
        width:curWidth/4,
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
        width:curWidth/4,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,18),
        color:color.textColor_1,
        left:curWidth/4
    },
    buttonName_2:{
        width:curWidth/4,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,18),
        color:color.textColor_1,
        left:curWidth/4*2
    },
    buttonName_3:{
        width:curWidth/4,
        height:offsetValue(2,40),
        position:"absolute",
        textAlign:"center",
        lineHeight:offsetValue(2,40) + "px",
        fontSize:offsetValue(3,18),
        color:color.textColor_1,
        left:curWidth/4*3
    },

    choiceStarImg:{
        width:offsetValue(1,120),
        height:offsetValue(2,3),
        position:"absolute",
        left:(curWidth/4 - offsetValue(1,120))*0.5,
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


    cenTopDiv: {
        width: curWidth,
        height: offsetValue(2, 46),
        position: "absolute",
        top:offsetValue(2,itemtop),
    },
    cenBotDiv: {
        width: curWidth - offsetValue(1,100),
        height: offsetValue(2, 700),
        position: "absolute",
        left:offsetValue(1,50),
        top:offsetValue(2,itemtop +80),
        textAlign:"left",
        lineHeight:offsetValue(2,40) + "px",
        color:"white",
        fontSize:offsetValue(3,16)     
    },
}

module.exports = How;