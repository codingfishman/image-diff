import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import CommonStyle from '../style/common.less';
import Style from './image-cropper.less';

class ImageCropper extends React.Component {
  constructor () {
    super ();
    this.state = {
      cropperImageUrl: '',
      cropperDataUrl: '',
      imageName: '',
      imageList: {},
      activeIndex: -1,
      cropperMeta: {}
    };

    this.renderCropper = this.renderCropper.bind(this);
    this.getCropperData = this.getCropperData.bind(this);
    this.loadDemo = this.loadDemo.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.renderSpecifiedImage = this.renderSpecifiedImage.bind(this);
    this.reset = this.reset.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.getCropperMetaData = this.getCropperMetaData.bind(this);
  }

  static propTypes = {
    doCheck: PropTypes.func,
    demoImageUrl: PropTypes.string,
    tipText: PropTypes.string,
    title: PropTypes.string,
    identifyColor: PropTypes.string // 当有不一致的颜色时，用于区分的颜色
  }

  loadDemo () {
    this.state.cropperImageUrl = this.props.demoImageUrl;
    this.setState({
      cropperImageUrl: this.props.demoImageUrl
    });
  }

  reset () {
    this.cropperRef && this.cropperRef.reset();
    // this.props.doCheck();
  }

  onImageChange (event) {
    this.state.imageList = event.target.files;
    this.setState({
      activeIndex: 0
    });

    this.renderCropper(event.target.files[0]);
  }

  renderSpecifiedImage (index) {
    const image = this.state.imageList[index];
    this.setState({
      activeIndex: index
    });

    this.renderCropper(image);
  }

  renderCropper (image) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      this.setState({
        cropperImageUrl: reader.result,
        imageName: image.name
      });
    }, false);

    reader.readAsDataURL(image);
  }

  zoomIn () {
    this.cropperRef && this.cropperRef.zoom(0.1);
  }

  zoomOut () {
    this.cropperRef && this.cropperRef.zoom(-0.1);
  }

  getCropperData () {
    const cropperRef = this.cropperRef;
    return cropperRef && cropperRef.getCroppedCanvas() ? cropperRef.getCroppedCanvas().toDataURL() : '';
  }

  getCropperMetaData () {
    const cropperRef = this.cropperRef;
    if (cropperRef) {
      this.setState({
        cropperMeta: cropperRef.getCropBoxData()
      });
    } else {
      this.setState({
        cropperMeta: {}
      });
    }
  }

  getCropperDiv () {
    const self = this;
    const cropperSrc = this.state.cropperImageUrl;
    const cropper = (
      <Cropper
        ref={(ref) => {self.cropperRef = ref;}}
        src={cropperSrc}
        style={{ height: '100%', width: '100%' }}
        // cropend={this.props.doCheck}
        cropBoxResizable={true}
        autoCropArea={1}
        cropBoxMovable={true}
        dragMode="crop"
        zoomable={true}
        zoomOnTouch={false}
        zoomOnWheel={false}
        cropmove={this.getCropperMetaData}
        ready={this.getCropperMetaData}
        // zoom={this.props.doCheck}
      />
    );

    const uploadClick = function () {
      self.fileInput.click();
    };

    const getCropperBoxMetaDiv = function () {
      const { cropperMeta } = self.state;
      if (typeof cropperMeta.width !== 'undefined') {
        return (
          <div className={Style.metaData} >
            <span>{cropperMeta.width.toFixed(2)} x {cropperMeta.height.toFixed(2)}</span>
          </div>
        );

      } else {
        return null;
      }
    };

    const uploadTipDiv = (
      <div className={Style.uploadTip} onClick={uploadClick} >
        <div style={{ 'textAlign': 'center' }}>
          <div>{this.props.tipText}</div>
          <div className={CommonStyle.hintText} >可选择多张图片</div>
        </div>
      </div>
    );

    return (
      <div className={Style.cropperWrapper} >
        {getCropperBoxMetaDiv()}
        {cropperSrc ? cropper : uploadTipDiv }

      </div>
    );
  }

  render () {
    const self = this;
    const { identifyColor } = this.props;

    const resetButton = <a href="javascript:void(0)" onClick={this.reset}>重置图片</a>;
    const zoomBtns = (
      <div className={Style.zoomBtn}>
        <button className={CommonStyle.btn + ' ' + CommonStyle.ghost} onClick={this.zoomIn}  > + </button>
        <button className={CommonStyle.btn + ' ' + CommonStyle.ghost} onClick={this.zoomOut} > - </button>
      </div>
    );

    const imageListDiv = [];

    const getImageListDiv = () => {
      const { imageList } = this.state;
      if (this.state.imageList.length) {
        for (let i = 0 ; i < imageList.length; i++) {
          const activeClass = this.state.activeIndex === i ? Style.activeImage : '';
          imageListDiv.push(<a
              href="javascript:void(0)"
              onClick={this.renderSpecifiedImage.bind(this, i)}
              key={i}
              className={activeClass}
            >
              {imageList[i].name}
            </a>
          );
        }
      }
      return imageListDiv;
    };

    return (
      <div className={Style.wrapper} >
        <div className={Style.cropperTitle} style={{ color: identifyColor }} >{this.props.title}</div>
        {this.getCropperDiv()}
        <div style={{ overflow:'hidden' }}>
          <div className={Style.bottom} >
            <div className={Style.uploadButton} >
              <input
                type="file"
                ref={(ref) => { this.fileInput = ref; }}
                onChange={(evt) => this.onImageChange(evt)}
                accept="image/png, image/jpeg"
                multiple
              />
              <div>
                <span><i className="fa fa-upload" aria-hidden="true" />点击上传</span>
              </div>
            </div>

            {this.state.cropperImageUrl ? resetButton : null }
          </div>
          {this.state.cropperImageUrl ? zoomBtns : null}
        </div>
        <div className={Style.uploadedImageList} >
            {getImageListDiv()}
        </div>
      </div>
    );
  }
}

export default ImageCropper;