//import { KanbanState, KanbanGridBase } from '../KanbanBase.js';
//import { KanbanPlayerType } from '../KanbanPlayer.js';

export class BasicGrid extends KanbanGridBase {
    constructor(ktv, screen, containerID, gridID, parameter) {
        super(ktv, screen, containerID, gridID);
        this.playerType = KanbanPlayerType.GridScroll;
        this.url = parameter["url"];
        this.columns = parameter["columns"];
        this.groupItems = parameter["groupItems"];
        this.totalItems = parameter["totalItems"];
        this.headerColor = parameter["headerColor"];
        this.groupColor = parameter["groupColor"];
        this.fontSize = parameter["fontSize"];
        this.title = parameter["Title"];
        this.subtitle = parameter["Subtitle"];
        this.titlecolor = parameter["TitleColor"];
        this.subtitlecolor = parameter["SubtitleColor"];
        //
        this.url = parameter["url"];
        this.method = parameter["method"];
        this.workshop = parameter["Workshop"] || "";
        this.etsServer = parameter["etsServer"] ? parameter["etsServer"] : "ETSHP";
        this.GxNo = parameter["GxNo"] ? parameter["GxNo"] : (parameter["gxNo"] ? parameter["gxNo"] : "698");
        this.gxName = parameter["gxName"] ? parameter["gxName"] : (parameter["GxName"] ? parameter["GxName"] : "");
        this.lineNo = parameter["LineNo"] ? parameter["LineNo"] : "";
        this.useCustomLine = parameter["useCustomLine"] ? parameter["useCustomLine"] : false;
        this.Initializing();
    }
    Initializing() {
        this.ContainerSetup();
        this.GridSetup();
        this.LoadData();
    }

    ContainerSetup() {
        this.state = KanbanState.Initializing;
        let html = `<h2 style="color:${this.titlecolor || "black"};text-align: center;">` + this.title + `</h2>
        <h3 style="color:${this.subtitlecolor || "black"};text-align: center;">` + this.subtitle + `</h3>
        <div id="`+ this.gridID + `" style="height: 89%;">
        </div>`;
        this.container.append(html);
    }


    GridSetup() {

        this.grid = $('#' + this.gridID + '').dxDataGrid(BASIC_GRID_OPTION).dxDataGrid('instance');
        let brheader = (header, info) => {
            $("<div>").html(info.column.caption.replace(/\n/g, "<br/>")).appendTo(header);
        }

        let newarr = [], ndarr = [];
        this.columns.forEach((item, index, arr) => {
            let temp = {};
            Object.assign(temp, item);
            if (item.hasOwnProperty('dataField')) {
                Object.defineProperty(temp, 'headerCellTemplate', {
                    value: brheader,
                    writable: true,
                })
                Object.defineProperty(temp, 'alignment', {
                    value: "center",
                    writable: true,
                })
            }
            else {
                Object.defineProperties(temp, {
                    headerCellTemplate: {
                        value: brheader,
                        writable: true,
                    },
                    calculateCellValue: {
                        value: (data) => eval(item.calculateCellValue),
                        writable: true,
                    },
                    alignment: {
                        value: "center",
                        writable: true,
                    }
                })
            }
            newarr.push(temp);
        })
        this.grid.option('columns', newarr);

        newarr = [];
        this.groupItems ? this.groupItems.forEach(item => {
            let temp = {};
            Object.assign(temp, item);
            if (item.hasOwnProperty('displayFormat')) {
                Object.defineProperties(temp, {
                    //column,showincolumn,displayformat
                    summaryType: {
                        value: "max",
                        writable: true,
                    },
                    minWidth: {
                        value: 150,
                        writable: true,
                    },
                    showInGroupFooter: {
                        value: true,
                        writable: true,
                    },
                    alignByColumn: {
                        value: true,
                        writable: true,
                    },

                })
            }
            else Object.defineProperties(temp, {
                //column
                summaryType: {
                    value: "sum",
                    writable: true,
                },
                displayFormat: {
                    value: "{0}",
                    writable: true,
                },
                showInGroupFooter: {
                    value: true,
                    writable: true,
                },
                alignByColumn: {
                    value: true,
                    writable: true,
                },


            })
            newarr.push(temp);
        }) : null
        this.totalItems ? this.totalItems.forEach(item => {
            let temp = {};
            Object.assign(temp, item);
            if (item.hasOwnProperty('displayFormat')) {
                Object.defineProperties(temp, {
                    summaryType: {
                        value: "max",
                        writable: true,
                    },
                    minWidth: {
                        value: 150,
                        writable: true,
                    },
                    showInGroupFooter: {
                        value: true,
                        writable: true,
                    },
                    alignment: {
                        value: "center",
                        writable: true,
                    }
                })
            }
            else Object.defineProperties(temp, {
                summaryType: {
                    value: "sum",
                    writable: true,
                },
                displayFormat: {
                    value: "{0}",
                    writable: true,
                },
                showInGroupFooter: {
                    value: true,
                    writable: true,
                },
                alignment: {
                    value: "center",
                    writable: true,
                }
            })
            ndarr.push(temp);
        }) : null
        this.grid.option('summary', {
            groupItems: newarr || [],
            totalItems: ndarr || [],
        });
        this.grid.option('onCellPrepared', (e) => {
            if (e.rowType === "header") {
                e.cellElement.css("background-color", this.headerColor || "rgb(250,191,143)");
                e.cellElement.css('font-weight', 'bold');
                e.cellElement.css("color", "black")

            } else if (e.rowType === "data") {
                //do nothing
            }
            else if (e.rowType === "group") {
                e.cellElement.css("display", "none");
                //
            } else if (e.rowType === "groupFooter" || e.rowType === "totalFooter") {
                e.cellElement.css("background-color", this.groupColor || "rgb(250,191,143)");
                e.cellElement.css('font-weight', 'bold');
            }
            e.cellElement.css('text-align', 'center');
            e.cellElement.css('vertical-align', 'middle');
            e.cellElement.css('font-size', this.fontSize || 16 + 'px');

        });
        this.grid.option('filterRow.visible', false);
        this.grid.option('onContentReady', (e) => {
            e.element.find('.dx-datagrid-summary-item').css('color', 'black');
            e.element.find('.dx-datagrid-total-footer').css('background-color', this.groupColor || "rgb(250,191,143)");
            e.element.find('.dx-datagrid-summary-item.dx-datagrid-text-content').css('text-align', "center");
            e.element.find('.dx-datagrid-content.dx-datagrid-scroll-container').css('padding', '0px');
        });
    }

    GridConfig(ds) {
        //None

    }
    LoadData() {
        // columns: this.columns, groupItems: this.groupItems, totalItems: this.totalItems, headerColor: this.headerColor, groupColor: this.groupColor
        let postData = {
            workshop: this.workshop,
            gxNo: this.GxNo,
            useCustomLine: this.useCustomLine,
        };

        if (this.lineNo) {
            postData.lineNo = this.lineNo
        };

        if (this.lineNo) {
            postData.gxName = this.gxName
        };

        if (this.etsServer) {
            postData.etsServer = this.etsServer
        };
        AjaxBase(null, this.url || "", this.method || "GET", postData, (response) => {

            let test = [
                {
                    Workshop: "HMW-A", IsUrgent: 100, NotPrinted: 50, NotPrepared: 40, Prepared: 20, Completed: 30
                },
                {
                    Workshop: "HMW-B", IsUrgent: 100, NotPrinted: 60, NotPrepared: 40, Prepared: 25, Completed: 35
                },
                {
                    Workshop: "CUT-A", IsUrgent: 100, NotPrinted: 70, NotPrepared: 35, Prepared: 30, Completed: 35
                },
            ]
            response.data && response.data != "" ? this.grid.option('dataSource', response.data) : null;

            // 
            if (!this.firstLoadDone) {
                this.state = KanbanState.ContentReady;
                this.firstLoadDone = true;
                super.KanbanPlayerSetup();
            }
        });
        setTimeout(() => {
            this.LoadData();
        }, 1000 * 25 * 60);
    }
}
// TEMP JSON REQ PARAM
// let temp = {
//         "url":"/GridData/GetESPEmployeeEfficiency"
//     "columns": [
//         {
//             "dataField": "Workshop", "caption": "Bộ phận lĩnh liệu\n 领料部门", "dataType": "string", "width": "10%"
//         },
//         {
//             "dataField": "IsUrgent", "caption": "Đơn gấp\n急单", "dataType": "number", "width": "10%"
//         },
//         {
//             "dataField": "NotPrinted", "caption": "Chưa in\n 未打印", "dataType": "number", "width": "10%"
//         },
//         {
//             "dataField": "NotPrepared", "caption": "Chưa sắp liệu\n 未备料", "dataType": "number", "width": "10%"
//         },
//         {
//             "dataField": "Prepared", "caption": "Đã sắp liệu \n 已备料", "dataType": "number"
//         },
//         {
//             "dataField": "Completed", "caption": "Đã hoàn thành\n已完成", "dataType": "number"
//         },
//     ],
//     "groupItems": [],
//     "totalItems": [{
//         "column": "Workshop",
//         "displayFormat": "Tổng trong ngày 当日总计",
//
//     },
    // {
    //     "column": "IsUrgent",
    // },
    // {
    //     "column": "NotPrinted",
    // },
    // {
    //     "column": "NotPrepared",
    // },
    // {
    //     "column": "Prepared",
    // },
    // {
    //     "column": "Prepared",
    // },
    // {
    //     "column": "Completed",
    // },
// ],
//     "headerColor": "rgb(250,191,143)",
//     "groupColor": "rgb(250,191,143)",
//     "fontSize ": "16",
// "Title":"ABC",
// "Subtitle":"abc"
// }
