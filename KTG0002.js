//import { KanbanState, KanbanGridBase } from '../KanbanBase.js';
//import { KanbanPlayerType } from '../KanbanPlayer.js';
export class KTG0002 extends KanbanGridBase {
    constructor(ktv, screen, containerID, gridID, parameter) {
        super(ktv, screen, containerID, gridID);
        this.url = parameter["url"];
        this.workshop = parameter["Workshop"];
        this.title = parameter["Title"];
        this.subtitle = parameter["Subtitle"];
        this.titlecolor = parameter["TitleColor"];
        this.subtitlecolor = parameter["SubtitleColor"];
        this.playerType = KanbanPlayerType.GridScroll;
        this.Initializing();
    }
    Initializing() {
        this.ContainerSetup();
        this.GridSetup();
        this.LoadData();
    }

    ContainerSetup() {
        this.state = KanbanState.Initializing;
        let html = `<h2 style="color:${this.titlecolor || 'black'};text-align: center;">${this.title || 'SANTONI织机车间进度看板   TIẾN ĐỘ SẢN LƯỢNG DỆT SANTONI'}</h2>
        <h3 style="color:${this.subtitlecolor || 'black'};text-align: center;">${this.subtitle || ""}</h3>     

        <div id="${this.gridID}" style="height: 89%;">
        </div>`;
        this.container.append(html);
    }

    sum_col(input,type ="sum") {
        return {
            column: input,
            name:input,
            summaryType: type,
            displayFormat: "{0}",
            showInGroupFooter: true,
            alignByColumn: true,
            alignment: "center",
        };
    }

    GridSetup() {
        let temp = {
            first:[],
            second:[],
        };
        const brheader = (header, info) => {
            $("<div>").html(info.column.caption.replace(/\n/g, "<br/>")).appendTo(header);
            // add the <br/> thay cho \n voi cac header
        }

        this.grid = $('#' + this.gridID + '').dxDataGrid(BASIC_GRID_OPTION).dxDataGrid('instance');
        this.grid.option('columns', [
            { "dataField": "Workline", "caption": `机台号\nSố máy`, "dataType": "string", "headerCellTemplate": brheader },
            { "dataField": "StyleNo", "caption": `款号\nMã hàng`, "dataType": "string", width: "15%", "headerCellTemplate": brheader },
            { "dataField": "StyleNo", "caption": `款号\nMã hàng`, "dataType": "string", "headerCellTemplate": brheader, groupIndex: 0 },
            { "dataField": "MO", "caption": `生产制单号\nMã đơn sản xuất`, "dataType": "string", "headerCellTemplate": brheader },
            { "dataField": "Quantity", "caption": `当日织布产量\nSản lượng dệt trong ngày`, "dataType": "number", "headerCellTemplate": brheader },
            { "dataField": "AimQty", "caption": `当日计划织布产量\nSản lượng kế hoạch trong ngày`, "dataType": "number", },
            {
                "caption": `完成比例\nTỉ lệ hoàn thành`, "headerCellTemplate": brheader, "calculateCellValue": function (data) {
                    typeof data.AimQty === "undefined" || data.AimQty === null ? data.data_mor = "" : data.data_mor = ((data.Quantity / data.AimQty) * 100).toFixed(2) + "%" || "0%"
                    return data.data_mor
                }
            },
            { "dataField": "ExportDate", "caption": `出货日期\nNgày xuất hàng`, "dataType": "date", "headerCellTemplate": brheader },


        ]);
        this.grid.option('summary', {
            groupItems: [{
                "column": "StyleNo",
                "summaryType": "max",
                "displayFormat": "按款号小计 Tổng sản lượng của mã hàng",
                "minWidth": 150,
                "showInGroupFooter": true,
            },
            this.sum_col('Quantity',"custom"),
            this.sum_col('AimQty',"custom"),
            this.sum_col('完成比例\nTỉ lệ hoàn thành',"custom"),

            ],
            totalItems: [
                {
                    "column": "StyleNo",
                    "summaryType": "max",
                    "displayFormat": "总计 Tổng sản lượng",
                    "minWidth": 150,
                    "showInGroupFooter": true,
                },
                this.sum_col('Quantity',"custom"),
                this.sum_col('AimQty',"custom"),

                this.sum_col('完成比例\nTỉ lệ hoàn thành',"custom"),
            ],     
            calculateCustomSummary: function (e) {
                if(e.name == "Quantity") {
                    switch(e.summaryProcess) {
                        case "start":
                            // Initializing "totalValue" here
                            e.totalValue=0
                            break;
                        case "calculate":
                            // Modifying "totalValue" here
                            e.totalValue += e.value;
                            break;
                        case "finalize":
                            temp.second[0]=e.totalValue

                            // Assigning the final value to "totalValue" here
                            break;
                    }
                }
                else if(e.name == "AimQty") {
                    switch(e.summaryProcess) {
                        case "start":
                            // Initializing "totalValue" here
                            e.totalValue=0
                            break;
                        case "calculate":
                            // Modifying "totalValue" here
                            e.totalValue += e.value;
                            break;
                        case "finalize":
                            // Assigning the final value to "totalValue" here
                            temp.second[1]=e.totalValue

                            break;
                    }
                }
                else if(e.name == "完成比例\nTỉ lệ hoàn thành") {
                    switch(e.summaryProcess) {
                        case "start":
                            // Initializing "totalValue" here
                            e.totalValue=0
                            break;
                        case "calculate":
                            // Modifying "totalValue" here
                            break;
                        case "finalize":
                            e.totalValue=((temp.second[0]/temp.second[1])*100).toFixed(2) +"%"
                            // Assigning the final value to "totalValue" here
                            break;
                    }
                }
            } 
        });
        this.grid.option('onCellPrepared', (e) => {
            if (e.rowType == "header") {
                e.cellElement.css('font-weight', 'bold');
                e.cellElement.css('background-color', '#F4B084');

            }
            else if (e.rowType === "group") {
                e.cellElement.css("display", "none");
                //
            }
            else if (e.rowType === "data") {
                if (typeof e.value == 'undefined') temp.first.push(e.rowIndex);
                if (typeof e.value === 'string' && e.columnIndex === 6) {
                    if (parseInt(e.value.slice(0, e.value.length)) < 100 && new Date(e.data.ExportDate) - Date.now() < 864000000) e.cellElement.css('background-color', 'red');
                }

            }
            else if (e.rowType === "groupFooter") {
                e.cellElement.css('background-color', '#FCE4D6');
                e.cellElement.css('font-weight', 'bold');
                e.columnIndex > 3 ? e.cellElement.css("border", "1px solid #ddd") : null;
            }
            else if (e.rowType === "totalFooter") {
                e.cellElement.css('background-color', '#F4B084');
                e.cellElement.css('font-weight', 'bold');
                e.columnIndex > 3 ? e.cellElement.css("border", "1px solid #ddd") : null;
            }

            e.cellElement.css('text-align', 'center');
            e.cellElement.css('vertical-align', 'middle');
            e.cellElement.css('font-size', this.fontSize || 14 + 'px');
            e.cellElement.css("color", "black");
            e.cellElement.css("padding", "0px");
        });
        this.grid.option('onContentReady', (e) => {
            temp.first.forEach(item => {
                e.element.find(`.dx-row.dx-data-row.dx-row-lines.dx-column-lines[aria-rowindex='${item + 1}']`).css('background-color', 'yellow')
            })
    
            //set full row color nếu có trùng lặp
            e.element.find('.dx-datagrid-summary-item').css('color', 'black');
            e.element.find('.dx-datagrid-total-footer').css('background-color', 'rgb(250,191,143)');
        });
        this.grid.option('filterRow.visible', false);
    }

    GridConfig(ds) {
        //None

    }
    LoadData() {
        this.state = KanbanState.LoadingData;
        AjaxBase(null, this.url || "/STN/STN0001", "GET", { Workshop: this.workshop }, (response) => {
            this.grid.option('dataSource', response.data);
            super.KanbanPlayerSetup();
            this.state = KanbanState.ContentReady;
        });
        let test = [
            {
                "Workline": "100-28-15",
                "StyleNo": "S1001871AW03_2502",
                "MO": "71001781",
                "Quantity": 80,
                "AimQty": 500,
                "ExportDate": "12/15/2021"
            },
            {
                "Workline": "99-28-15",
                "StyleNo": "S1001871AW03_2502",
                "MO": "71001782",
                "Quantity": 100,
                "AimQty": 500,
                "ExportDate": "12/15/2021"
            },
            {
                "Workline": "99-28-15",
                "StyleNo": "S1002154AV01_2602",
                "MO": "21000376",
                "Quantity": 50,

                "ExportDate": "11/26/2021"
            },
            {
                "Workline": "10-28-18",
                "StyleNo": "S1002154AV01_2602",
                "MO": "21000376",
                "Quantity": 12,
                "AimQty": 523,
                "ExportDate": "11/26/2021"
            },
            {
                "Workline": "10-28-18",
                "StyleNo": "S1002154AV01_2602",
                "MO": "21000376",
                "Quantity": 100,
                "AimQty": 100,
                "ExportDate": "11/26/2021"
            },
            {
                "Workline": "10-28-18",
                "StyleNo": "S1002154AV01_2602",
                "MO": "21000376",
                "Quantity": 100,
                "AimQty": 10000,
                "ExportDate": "10/29/2021"
            },
            {
                "Workline": "10-28-18",
                "StyleNo": "S1002154AV01_2602",
                "MO": "21000376",
                "Quantity": 12,
                "AimQty": 523,
                "ExportDate": "11/26/2021"
            },
            {
                "Workline": "10-28-18",
                "StyleNo": "S10021zxs54AV01_2602",
                "MO": "21000376",
                "Quantity": 12,
                "AimQty": 523,
                "ExportDate": "11/26/2021"
            },
            {
                "Workline": "99-28-15",
                "StyleNo": "S10021zxs54AV01_2602",
                "MO": "21000376",
                "Quantity": 50,
                "ExportDate": "11/26/2021"
            },
        ]
        this.grid.option('dataSource', test)

        setTimeout(() => {
            this.LoadData();
        }, 1000 * 25 * 60);
    }
}