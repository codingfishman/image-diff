/*
* 创建对比线的组件
*
*/

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import CommonStyle from '../style/common.less';
import Style from './compare-line.less';

class CompareLine extends React.Component {
  constructor () {
    super ();
    this.state = {
      dragBarTop: ''
    };

    this.onDragbarMoveUp = this.onDragbarMoveUp.bind(this);
    this.onDragbarMove = this.onDragbarMove.bind(this);
    this.onDragbarMoveDown = this.onDragbarMoveDown.bind(this);
  }

  static propTypes = {

  }

  onDragbarMove(event) {
    this.setState({
      dragBarTop: event.pageY
    });
  }

  onDragbarMoveUp(event) {
    console.info(`event`,event);
    this.setState({
      contentLeft: event.pageX
    });

    document.removeEventListener('mousemove', this.onDragbarMove);
    document.removeEventListener('mouseup', this.onDragbarMoveUp);
  }

  onDragbarMoveDown(event) {
    document.addEventListener('mousemove', this.onDragbarMove);

    document.addEventListener('mouseup', this.onDragbarMoveUp);
  }

  render () {

    const dragBarStyle = {
      top: this.state.dragBarTop
    };

    return (
      <div
        className={Style.dragBar}
        style={dragBarStyle}
        onMouseDown={this.onDragbarMoveDown}
      >
        <div className={Style.line} />
      </div>
    );
  }
}

export default CompareLine;