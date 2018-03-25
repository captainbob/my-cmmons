import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import getLodop from './lodop';

const borderWidth = 1.49;
const htmlTemplate = (head, body) => {
    //body .ant-table-body > table
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <style>
				body,
				html {
					width: 100%;
				}
				.ptable,.ptable table {
					border-collapse: collapse;
					width: 100%;
				}
				.ptable tr th,
				.ptable tr td {
					padding: 0px !important;
					margin: 0px !important;
					position: relative;
					font-size: 10px;
					border-color:black;
					border-style: solid;
					border-width: 0;
					border-right-width: ${borderWidth}px;
					border-bottom-width: ${borderWidth}px;
				}
				.ptable>thead tr th{
                    padding:5px 2px !important;
                }
				.ptable tr th:first-child,
				.ptable tr td:first-child {
					border-left-width:${borderWidth}px;
				}
				.ptable tr:first-child th{
					border-top-width: ${borderWidth}px;
				}
				.ptable>tbody:first-child>tr:first-child>*{
					border-top-width: ${borderWidth}px;
				}
				.ptable table tr th,
				.ptable table tr td{
					border-width: 0;
					border-top-width:${borderWidth}px;
					border-left-width: ${borderWidth}px;
				}
				.ptable table tr:first-child>*{
					border-top-width: 0;
				}
				.ptable table tr td:first-child{
					border-left-width: 0;
				}
				.ptable table > thead + tbody > tr > *,
				.ptable table > tbody + tfoot > tr > *,
				.ptable table > thead + tbody + tfoot > tr > *{
					border-top-width: ${borderWidth}px !important;
				}
            </style>
            ${head}
        </head>
        <body>
            ${body}
        </body>
    </html>`
}

class HTML extends Component {
    static defaultProps = {
        buttonOptions: {},
        isTable: false,
        auto: true
    }

    render() {
        React.Children.only(this.props.children);

        if (!this.node) {
            this.node = document.createElement('div');
            this.node.style.width = '0px';
            this.node.style.height = '0px';
            this.node.style.overflow = 'hidden';
            document.body.appendChild(this.node);
        }

        ReactDOM.unstable_renderSubtreeIntoContainer(this, this.props.children, this.node);

        return <Button {...this.props.buttonOptions} onClick={this.onClick}></Button>;
    }

    componentWillUnmount() {
        if (this.node) {
            document.body.removeChild(this.node);
        }
    }

    onClick = (event) => {
        if (this.props.auto) {
            this.print().then((html) => {
                if (this.props.buttonOptions.onClick) {
                    this.props.buttonOptions.onClick(event, html);
                }
            }).catch(err => {
                if (this.props.buttonOptions.onClick) {
                    this.props.buttonOptions.onClick(event, err);
                }
            });
        } else {
            if (this.props.buttonOptions.onClick) {
                this.props.buttonOptions.onClick(event, {
                    fork: () => { return this.print(); }
                });
            }
        }
    }

    print = () => {
        console.log('this.props:',this.props)
        let {top,printConfig} = this.props;
        top = (top||0) + 50;
        let paperWidth = this.props.paperWidth || 0;
        let paperHeight = this.props.paperHeight || 0;
        paperHeight =paperHeight * 3.75;    //mm转成px
        let marginBottom = this.props.marginBottom;
        return new Promise((resolve, reject) => {
            if (!window.LODOP) {
                window.LODOP = getLodop();
            }
            let node = this.node.children[0].children[0].children[0].children[0].children[0].children[0];
            node.children[0].classList.add("ptable");
            let html = htmlTemplate(document.getElementsByTagName('head')[0].innerHTML, node.innerHTML);

            html = html.replace(/<\/tbody>/g, `</tbody>`+this.tfoot);
            html = html.replace(/data-ptable-/g, '');
            html = html.replace(/ant-table-/g, '');
            html = html.replace(/<colgroup>/g, '');
            html = html.replace(/<col>/g, '');
            html = html.replace(/<\/colgroup>/g, '');
            try {
                window.LODOP.PRINT_INIT("单据打印");
                let { headCount } = this.props;
                let headCountTpl = `<div>
                    ${headCount}
                </div>`;

                // $("body").append(headCountTpl);
                // $(htmlToDom(headCountTpl).children[0])
                if (headCount && headCount.length) {
                    window.LODOP.ADD_PRINT_HTM(20, '2%', '96%', top, headCountTpl);
                }
                if (!this.props.isTable) {
                    window.LODOP.ADD_PRINT_HTM(top, '2%', '96%', paperHeight ? paperHeight - top : '85%', html);
                } else {
                    window.LODOP.ADD_PRINT_TABLE(top, '2%', '96%', paperHeight ? paperHeight - top - marginBottom : '85%', html);
                }
                window.LODOP.SET_PRINT_STYLEA(0, 'Offset2Top', -(top - 50));
                if (printConfig.paper){
                    window.LODOP.SET_PRINTER_INDEX(printConfig.printerIndex);//指定打印机
                    window.LODOP.SET_PRINT_PAGESIZE(printConfig.direction+1,0,0,printConfig.paper);//指定方向和纸张
                    // 页面手动设置大于1页时，预览时不可更改页码
                    if (printConfig.num && printConfig.num > 1){
                        window.LODOP.SET_PRINT_COPIES(printConfig.num || 1);//指定份数
                    }
                    // window.LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true);
                    // window.LODOP.SET_PRINT_MODE("FULL_HEIGHT_FOR_OVERFLOW",true);
                    if (printConfig.direction===1){
		                window.LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);//横向时的正向显示
                    }
                    window.LODOP.SET_PRINT_MODE("RESELECT_PRINTER",false);
                    window.LODOP.SET_PRINT_MODE("RESELECT_ORIENT",false);
                    window.LODOP.SET_PRINT_MODE("RESELECT_PAGESIZE",false);
                    window.LODOP.SET_PRINT_MODE("RESELECT_COPIES",false);

                }
                window.LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT","Auto-Width");//按整宽不变形缩放
                window.LODOP.PREVIEW();
                resolve(html);
            } catch (err) {
                reject(html);
            }
        });
    }
    get tfoot() {
        return `<tfoot>
        ${this.props.isTable === false ? '' : `<tr>
                    <td colSpan="${this.props.columnsLength || 1}" style="text-align:center;padding:8;">
                        <font data-ptable-tdata="PageNO" style="text-align:right;">###</font>
                        <font>/</font>
                        <font data-ptable-tdata="PageCount" style="text-align:left;">###</font>
                    </td>
                </tr>`}
                
        </tfoot>`
    }
}
/*字符串转dom对象*/
function htmlToDom(txt) {
    try //Internet Explorer
    {
        window.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        window.xmlDoc.async = "false";
        window.xmlDoc.loadXML(txt);
        //alert('IE');
        return (xmlDoc);
    }
    catch (e) {
        try //Firefox, Mozilla, Opera, etc.
        {
            window.parser = new DOMParser();
            window.xmlDoc = parser.parseFromString(txt, "text/xml");
            //alert('FMO');
            return (xmlDoc);
        }
        catch (e) { alert(e.message) }
    }
    return (null);
}

module.exports = HTML;