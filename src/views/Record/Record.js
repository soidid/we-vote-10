import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from "react-router";
import { connect } from 'react-redux';
import moment from 'moment';

import {setIdFilter} from '../../ducks/records';

import cht2url from '../../utils/cht2url';
import candidates_name2id from '../../utils/candidates_name2id';
import eng2cht from '../../utils/eng2cht';

import CandidatePhoto from '../../components/CandidatePhoto/CandidatePhoto.js';

@connect(
    state => ({candidates: state.candidates,
               issues: state.issues,
               records: state.records
               }),
    dispatch => bindActionCreators({setIdFilter}, dispatch))

export default class Candidate extends Component {
  static propTypes = {
      issues: PropTypes.object.isRequired,
      setIdFilter: PropTypes.func.isRequired,
      records: PropTypes.object.isRequired
  }
  componentWillMount(){
      const id = this.props.params.recordId;
      const { setIdFilter } = this.props;
      setIdFilter(id);
  }
  componentWillReceiveProps(nextProps){
      
      const id = this.props.params.recordId;
      const nextId = nextProps.params.recordId;

      if(id !== nextId){
          const { setIdFilter } = this.props;
          setIdFilter(id);
      }

  }
  render() {
    const styles = require('./Record.scss');
    const {records, issues} = this.props;
    const data = records.data;
    let date = moment.unix(data.date);

    /*
    category: "發言"
    clarificationContent: ""
    clarificationLastUpdate: ""
    content: "本院黃委員昭順，針對近日同性婚姻合法化爭議，認為人生而平等，同性婚姻權益等同於異性之婚姻權，應與其享婚姻中相同的權利與義務，亦應受憲法婚姻自由之保障，對於同性婚姻也應採取理解並尊重之態度，儘速修正相關法令，以期落實平等原則，特向行政院提出質詢。"
    date: 1336665600
    id: 1
    issue: "婚姻平權"
    legislator: "黃昭順"
    lyURL: "http://lci.ly.gov.tw/LyLCEW/communique1/final/pdf/101/32/LCIDC01_1013201.pdf"
    meeting: "院會"
    meetingCategory: "院會書面質詢"
    party: "KMT"
    position: "aye"
    positionJudgement: "贊成同性婚姻合法化"
    */

    let question;
    if(issues[cht2url(data.issue)])
       question = issues[cht2url(data.issue)].question;
    if(!data.position) return <div></div>

    let clarification;
    if(data.clarificationContent){
        clarification = (
          <div className={styles.clarificationContent}>
            {data.clarificationLastUpdate}
            {data.clarificationContent}
          </div>
        )
    
    }else{
        clarification = (
          <div className={styles.clarificationContent}>沒有澄清資訊。</div>
        )
    }

    return (
      <div className={styles.wrap}>
      
      <div className={styles.form}>
         
         
         <div className={styles.issueRow}>
              <div className={styles.issueName}>{data.issue}</div>
              <div className={styles.issueQuestion}>{question}</div>
         </div>    
         
         <div className={styles.peopleRow}>
            <Link to={`/candidates/${candidates_name2id(data.legislator)}`} className={styles.avatar}>
              <CandidatePhoto id={candidates_name2id(data.legislator)}/>
            </Link>

            <div className={styles.profileBlock}>
                <div className={styles.isCurrent}>第八屆立委</div>
                <div className={styles.isCandidate}>2016 參選人：新北市第十一選區</div>
                <div className={styles.avatarName}>
                      <div className={` ${styles["party-flag"]} ${styles[data.party]} `}></div>
                      {data.legislator}
                </div>
            </div>
           
         </div>

         <div className={styles.judegementRow}>
              立場判斷
              <div className={` ${styles.positionCube} ${styles[data.position]}`}></div>
              {data.positionJudgement}
         </div>

         <div className={styles.recordRow}>
            <div className={styles.content}>
                <div className={styles.contentMeta}>
                  <div className={styles.date}>{date.format('YYYY-MM-DD')}</div>
                  <div className={styles.category}>{data.category}</div>
                </div>
                <div className={styles.contentMain}>{data.content}</div>
            </div>
            <a className={styles.lyURL}
               href={data.lyURL}
               target="_new" >中華民國立法院原始資料</a>
         </div>

         <div className={styles.clarifyRow}>
            <div className={styles.clarifyTitle}>委員澄清</div>
         </div>
         {clarification}

      </div>
         <div className={styles.clarifyButton}>內容如果有錯誤，歡迎來函澄清</div>
      </div>
    );
  }
}