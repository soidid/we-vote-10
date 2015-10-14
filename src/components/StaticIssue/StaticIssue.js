import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import Slideshow from '../../components/Slideshow/Slideshow.js';
import IssueFigure from '../../components/IssueFigure/IssueFigure.js';
import IssueArticle from '../../components/IssueArticle/IssueArticle.js';
import Missions from '../../components/Missions/Missions.js';

@connect(
    state => ({
                issues: state.issues
              }),
    dispatch => bindActionCreators({}, dispatch))

export default class StaticIssue extends Component {
  static propTypes = {
     issues: PropTypes.object.isRequired,
     processing: "none"
  }

  constructor(props) { super(props)   
     this.state = {
        currentIssueName: props.currentIssueName, //URL
        currentView: props.currentView
     }
  }
  _informProcessing(){
      const {processing} = this.state;
      if(processing === "processing"){
          setTimeout(()=>{
              this.setState({
                 processing: "done"
              })
              setTimeout(()=>{
                 this.setState({
                    processing: "none"
                 })
              }, 1000)
          }, 5000)
      }

  }
  componentDidMount(){
      this._updateCurrentIssueFromURL();
      this._informProcessing();
      
  }
  componentDidUpdate(){
      this._informProcessing();
      
  }
  _updateCurrentIssueFromURL(){
      //console.log("mount - static issue : update pathname form url")
      if(window){
        let pathname = window.location.pathname;
        
        if(pathname.indexOf(".html")!==-1){
           pathname = pathname.split(".html")[0]
        }
        pathname = pathname.split("/");
        
        let value = pathname[3] || "parties";
        if(["parties","legislators","positions"].indexOf(value)===-1){
           value = "parties";
        }
        this.setState({
          currentIssueName: pathname[2],
          currentView: value

        })
        
      }

  }
  componentWillReceiveProps(nextProps){
      //console.log(nextProps.currentIssueName)
      let processing = (nextProps.currentIssueName === "nuclear-power") ? "processing" : "none";
      this.setState({
          currentIssueName: nextProps.currentIssueName,
          currentView: nextProps.currentView,
          processing: processing
      })

  }

  render(){
      const styles = require('./StaticIssue.scss');

      const {issues, setCurrentView} = this.props;
      const {currentView, currentIssueName} = this.state;
      const currentIssue = issues[currentIssueName];
      
      if(!currentIssue) return <div></div>;


      // 顯示處理中
      const {processing} = this.state;
      let processingItem;
      switch(processing){
          case 'processing':
              processingItem = <div className={styles.processingItem}>立場分析中⋯⋯</div>;
              break;

          case 'done':
          processingItem = <div className={styles.processingItem}>立場分析中⋯⋯</div>;
              processingItem = <div className={styles.processingItem}>立場分析 DONE</div>;
              break;

          case 'none':
              processingItem = <div className={`${styles.processingItem} ${styles.processingItemHide}`}>立場分析 GONE</div>;
              break;
          
      }
      

       // 協力 NGO
      const { collaborators } = currentIssue;
      let collaboratorItems = collaborators.map((ngo, index)=>{
          return <a className={`${styles.ia} ${styles.bright}`}
                    href={ngo.link}
                    target="_blank"
                    key={index}>{ngo.name}</a>
      });

      return (
        <div className={styles.wrap}>
            {processingItem}
            <div className={styles.innerWrap}>
                
                <Slideshow currentIssue={currentIssue}
                           topic={currentIssue.title}/>

                <IssueFigure currentView={currentView}
                             currentIssue={currentIssue}
                             currentIssueName={currentIssueName}
                             setCurrentView={setCurrentView} />

                <IssueArticle issue={currentIssue.titleEng} />

                <Missions issues={issues}
                          skipIssue={currentIssueName}
                          showComingMission={false}/>

                <div className={styles.collaboratorInfo}>
                    特別感謝{collaboratorItems}協助議題資料
                </div>

             </div>
        </div>
      )
  }
}
