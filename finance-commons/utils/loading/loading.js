import createElement from '../createQuerySelector';
import styles from './loading.less'
export default (...params) => {
  return new IsLoading(params);
};

// form表单元素
const formElements = ['form', 'input', 'textarea', 'label', 'fieldset', 'select', 'button'];
// 默认配置
/**
 * type： switch  表示切换，
 *   full-overlay 全局遮罩
 *   overlay 遮罩
 * text 在加载过程中显示什么提示文字
 * disableSource 目标dom
 * disableList 即某几个按钮不可用
 */
const optionsDefault = {
  'type': 'switch',        // switch | replace | full-overlay | overlay
  'text': 'loading',       // Text to display in the loader
  'disableSource': true,   // true | false
  'disableList': []
};

class IsLoading {
  constructor(params) {
    let options = {};
    if (params.length === 0 || (params.length === 1 && !params[0].nodeType)) { //没有参数时， 类型为全局遮罩
      this._target = null;
      options = { ...params[0], type: 'full-overlay' };
    } else {
      this._target = params[0];
      options = params[1];
    }
    this._options = { ...optionsDefault, ...options };
    this._fullOverlayId = 'is-loading-full-overlay';
  }
  // loading的方式
  loading() {
    switch (this._options.type) {
      case 'replace': this._onReplaceType(); break;
      case 'full-overlay': this._onFullOverlayType(); break;
      case 'overlay': this._onElementOverlayType(); break;
      default: this._onSwitchType(); break;
    }
  }
  // 获取目标内容的值
  get targetContent() {
    if (this.isTargetValue) {
      return this._target.value;
    } else {
      return this._target.textContent;
    }
  }
  // 设置targetContent的值
  set targetContent(val) {
    if (this.isTargetValue) {
      this._target.value = val;
    } else {
      this._target.textContent = val;
    }
  }
  // 判断是不是input类型button，如果不是，获取该值的方式不同
  get isTargetValue() {
    const node = this._target.nodeName.toLowerCase();
    const type = this._target.attributes.type;

    return (node === 'input' && type && (type.value.toLowerCase() === 'button' || type.value.toLowerCase() === 'submit'));
  }
  // 还原原来的target的内容
  restoreContent() {
    const content = this._target.getAttribute('data-is-loading-content');
    if (this.isTargetValue) {
      this._target.value = content;
    } else {
      this._target.textContent = content;
    }
  }

  // switch状态的，将按钮的内容换成 options中的text
  _onSwitchType() {
    this._toggleElements(false);
    this._target.setAttribute('data-is-loading-content', this.targetContent);
    this.targetContent = this._options.text;
  }
  // replace状态的，将按钮的内容换成 新的span.is-loading.isl-loading-target里的内容
  _onReplaceType() {
    this._toggleElements(false);
    this._target.setAttribute('data-is-loading-content', this.targetContent);
    this._target.innerHTML = '';
    this._target.appendChild(createElement('span.is-loading.is-loading-target', this._options.text));
  }
  // 元素overlay的效果，
  _onElementOverlayType() {
    this._toggleElements(false);
    const overlayWrapperClass = '.is-loading-element-overlay';

    if (this._prop('position') === 'static') {
      this._target.setAttribute('data-is-loading-position', 'static');
      this._target.classList.add('is-loading-element-overlay-target');
    }

    if (!this._target.querySelector(overlayWrapperClass)) {
      const overlay = createElement(overlayWrapperClass,
        createElement('.is-loading-text-wrapper', this._options.text)
      );
      overlay.style.borderRadius = this._prop('border-radius');
      this._target.appendChild(overlay);
    }
  }
  // full-overlay 状态
  _onFullOverlayType() {
    this._toggleElements(false);
    this._showFullOverlay();
  }
  // 显示overlay状态的dom
  _showFullOverlay() {
    let overlay = document.querySelector(this._fullOverlayId);

    if (!overlay) {
      overlay = createElement(`#${this._fullOverlayId}`,
        createElement('.is-loading-text-wrapper', this._options.text)
      );
      document.querySelector('body').appendChild(overlay);
    }
  }

  // 获取css的值
  _prop(prop) {
    // getComputedStyle（元素，伪类）
    return window.getComputedStyle(this._target).getPropertyValue(prop);
  }
  // toggle disable状态
  _toggleElements(status = true) {
    let list = [...this._options.disableList];
    if (this._target && this._options.disableSource === true) {
      list.unshift(this._target);
    }
    list.forEach(item => {
      if (formElements.includes(item.tagName.toLowerCase())) {
        if (status === true) {
          item.removeAttribute('disabled');
        } else {
          item.setAttribute('disabled', 'disabled');
        }
      }
      if (status === true) {
        item.classList.remove('disabled');
      } else {
        item.classList.add('disabled');
      }
    });
  }

  // 删除loadding状态
  remove() {
    this._toggleElements(true);
    if (this._options.type === 'switch') {
      this.restoreContent();
    }
    if (this._target) {
      this._target.removeAttribute('data-is-loading-content');
    }
    if (this._options.type === 'full-overlay') {
      let overlay = document.getElementById(this._fullOverlayId);
      document.querySelector('body').removeChild(overlay);
    }
    if (this._target && this._target.getAttribute('data-is-loading-position')) {
      this._target.classList.remove('is-loading-element-overlay-target');
    }
  }
}