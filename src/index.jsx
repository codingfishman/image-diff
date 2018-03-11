import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImageCropper from 'component/image-cropper';
import Style from './index.less';
import CommonStyle from './style/common.less';
import CompareLine from 'component/compare-line';
const ResembleJs = require('imports!./lib/resemble');


const defaultImageOne = require('url?limit=10000000!assets/demo.png');
const defaultImageTwo = require('url?limit=10000000!assets/demo-changed.png');

// 视觉稿颜色
const designIdentifyColor = {
  red: 45,
  green: 185,
  blue: 245,
};

// 开发稿颜色
const devIdentifyColor = {
  red: 255,
  green: 82,
  blue: 82
};

ResembleJs.outputSettings({
  errorColor: designIdentifyColor,
  errorTwoColor: devIdentifyColor,
  errorType: 'flatDifferenceIntensity', // flatDifferenceIntensity
  transparency: 0.9,
  largeImageThreshold: 1500,
  useCrossOrigin: false
});

class App extends React.Component {
  constructor () {
    super();
    this.state = {
      diffImageUrl: '',
      diffPercentage: -1,
      inDiff: false
    };

    this.doDiff = this.doDiff.bind(this);
    this.loadDemo = this.loadDemo.bind(this);

    this.cropperOneRef = null;
    this.cropperTwoRef = null;
    this.resembleTimeoutRef = null;
  }

  static propTypes = {

  }

  loadDemo () {
    this.cropperOneRef && this.cropperOneRef.loadDemo();
    this.cropperTwoRef && this.cropperTwoRef.loadDemo();
    setTimeout(() => {
      this.doDiff();
    }, 500);
  }

  doDiff() {
    if (!this.cropperOneRef || !this.cropperTwoRef) {
      return null;
    }

    const source = this.cropperOneRef.getCropperData();
    const target = this.cropperTwoRef.getCropperData();
    if (!source || !target) {
      return;
    }
    this.setState({
      inDiff: true,
      diffPercentage: -1
    });

    this.resembleTimeoutRef && clearTimeout(this.resembleTimeoutRef);

    this.resembleTimeoutRef = setTimeout(() => {
      const diff = ResembleJs(source)
        .compareTo(target)
        .onComplete((data) => {
          console.info(`resebmle data`, data);
          this.setState({
            inDiff: false,
            diffPercentage: data.misMatchPercentage,
            diffImageUrl: data.getImageDataUrl()
          });
        });

      diff.scaleToSameSize();
    }, 60);

  }

  getDiffResultDiv () {
    if (this.state.inDiff || !this.state.diffImageUrl) {
      return;
    }

    return (
      <div className={Style.diffImageWrapper} >
        <img src={this.state.diffImageUrl} width="100%" />
      </div>
    );
  }

  getDiffPercentDiv () {
    const relativePercentage = (100 - this.state.diffPercentage).toFixed(2);
    const diffPercentageDiv = (
      <div className={Style.diffPercentageWrapper}>匹配度：<span >{relativePercentage}</span>%</div>
    );

    return this.state.diffPercentage >= 0 ? diffPercentageDiv : null;
  }

  getLoadingDiv () {
    const diffTipDiv = (
      <div className={Style.diffStatus}>
        <i className="fa fa-circle-o-notch fa-spin fa-fw"></i>
        正在比对中...
      </div>
    );

    return this.state.inDiff ? diffTipDiv : null;
  }

  render () {


    return (
      <div className={Style.wrapper} >
        <CompareLine />
        <CompareLine />
        <CompareLine />
        <div className={Style.cropperWrapper} >
          <div className={Style.cropperWrapperItem}>
            <div className={Style.cropperHeaderLine} />
            <ImageCropper
              ref={(ref) => {this.cropperOneRef = ref;}}
              doCheck={this.doDiff}
              demoImageUrl={defaultImageOne}
              tipText="选择视觉稿截图"
              title="视觉稿"
              identifyColor={`rgb(${designIdentifyColor.red}, ${designIdentifyColor.green}, ${designIdentifyColor.blue})`}
            />
          </div>
          <div className={Style.cropperWrapperItem + ' ' + Style.cropperWrapperItemRight}>
            <div className={Style.cropperHeaderLine + ' ' + Style.right} />
            <ImageCropper
              ref={(ref) => {this.cropperTwoRef = ref;}}
              doCheck={this.doDiff}
              demoImageUrl={defaultImageTwo}
              tipText="选择页面截图"
              title="开发稿"
              identifyColor={`rgb(${devIdentifyColor.red}, ${devIdentifyColor.green}, ${devIdentifyColor.blue})`}
            />
          </div>
        </div>
        <div className={Style.diffWrapper} >
          <div className={Style.headDiv} >
            <button className={CommonStyle.btn + ' ' + Style.btn} onClick={this.doDiff} > 开始比较 </button>
            <a href="javascript:void(0)" onClick={this.loadDemo} > 查看示例 </a>
            <a href="https://github.com/codingfishman/image-diff/blob/master/help.md" target="_blank" > 使用说明 </a>
            {this.getLoadingDiv()}
            {this.getDiffPercentDiv()}
          </div>
          {this.getDiffResultDiv()}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));