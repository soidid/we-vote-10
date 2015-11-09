import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';

export default class Shell extends Component {
  render() {
    return (
      <div>
        Shell
         {this.props.children}
      </div>
    );
  }




}
