//import { KanbanState, KanbanGridBase } from '../KanbanBase.js';
//import { KanbanPlayerType } from '../KanbanPlayer.js';
export class KTG0001 extends KanbanGridBase {
    constructor(ktv, screen, containerID, gridID, parameter) {
        super(ktv, screen, containerID, gridID);
        this.workshop = parameter["Workshop"];
        this.workline = parameter["workline"];
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
        let html = `<h2 style="color:${this.titlecolor||'black'};text-align: center;">` + this.title + `</h2>
        <h3 style="color:${this.subtitlecolor||'black'};text-align: center;">` + this.subtitle + `</h3>     

        <div id="`+ this.gridID + `" style="height: 89%;">
        </div>`;
        this.container.append(html);
    }

    sum_col(input) {
        return {
            column: input,
            summaryType: "sum",
            displayFormat: "{0}",
            showInGroupFooter: true,
            alignByColumn: true,
            alignment: "center",
        };
    }

    GridSetup() {
        this.grid = $('#' + this.gridID + '').dxDataGrid(BASIC_GRID_OPTION).dxDataGrid('instance');
        const brheader = (header, info) => {  
            $("<div>").html(info.column.caption.replace(/\n/g, "<br/>")).appendTo(header);  
            // add the <br/> thay cho \n voi cac header
        }   
        this.grid.option('columns', [
            { dataField: "Workline", caption: `生产线\nChuyền sản xuất`, dataType: "string", headerCellTemplate: brheader},
            { dataField: "StyleNo", caption: `款号\nMã hàng`, dataType: "string",width: "15%",headerCellTemplate: brheader
        },
            { dataField: "Workline", caption: `生产线\nChuyền sản xuất`, dataType: "string", headerCellTemplate: brheader, groupIndex: 0},

            { dataField: "ColorNo", caption: `颜色\nMàu sắc`, dataType: "string",headerCellTemplate: brheader },
            { dataField: "Zdcode", caption: `工单号\nĐơn sản xuất`, dataType: "string",headerCellTemplate: brheader },

            { dataField: "PlanQty", caption: `当天计划\nKế hoạch trong ngày`, dataType: "number", },
            { dataField: "TodayMaterialUpQty", caption: `当天已上料数量\nSố lượng liệu lên chuyền trong ngày`, dataType: "number",headerCellTemplate: brheader },
            {
                caption: `当天上料欠数\nSố lượng lên chuyền còn thiếu trong ngày`,headerCellTemplate: brheader, calculateCellValue: function (data) {
                    data.data_mor = data.PlanQty-data.TodayMaterialUpQty
                    return data.data_mor || 0;
                }
            },
            { dataField: "MOQty", caption: `订单数\nSố lượng đơn hàng `, dataType: "number",headerCellTemplate: brheader },
            { dataField: "AccumulatedQty", caption: `工单上料累计\nLũy kế số lượng lên chuyền `,headerCellTemplate: brheader, dataType: "number", },
            {
                caption: `工单上料欠数\nLũy kế số lượng lên chuyền còn thiếu`, headerCellTemplate: brheader,calculateCellValue: function (data) {
                    return data.MOQty - data.AccumulatedQty || 0
                }
            }
        ]);
        this.grid.option('summary', {
            totalItems: [
                {
                    column: "StyleNo",
                    summaryType: "max",
                    displayFormat: "汇总 Tổng",
                    minWidth: 150,
                    showInGroupFooter: true,
                },
                this.sum_col("PlanQty"),
                this.sum_col("TodayMaterialUpQty"),
                this.sum_col(`当天上料欠数\nSố lượng lên chuyền còn thiếu trong ngày`),
                this.sum_col(`MOQty`),
                this.sum_col(`AccumlatedQty`),
                this.sum_col(`工单上料欠数\nLũy kế số lượng lên chuyền còn thiếu`),
            ]

        });
        this.grid.option('onCellPrepared', (e) => {

            
           if (e.rowType == "header") {
                e.cellElement.css('vertical-align', "middle");
                e.cellElement.css('text-align', "center");
                e.cellElement.css('font-weight', 'bold');
                e.cellElement.css('background-color', 'rgb(169,208,142)');

            }
            else if (e.rowType === "group") {
                e.cellElement.css("display", "none");
                //
            }
            else if (e.rowType === "totalFooter") {
                e.cellElement.css('background-color', 'rgb(248,203,173)');
                e.cellElement.css('font-weight', 'bold');
                e.columnIndex > 4 ? e.cellElement.css("border", "1px solid #ddd") : null;
            }
            else {
              //  e.cellElement.css('color', "black");
                e.cellElement.css('text-align', "right");
            }
            e.cellElement.css('text-align', 'center');
            e.cellElement.css('vertical-align', 'middle');
            e.cellElement.css('font-size', this.containerHeight / 100 * 2 + 'px');
            e.cellElement.css("color", "black");
            e.cellElement.css("padding", "2px 0px");
        });
        this.grid.option('onContentReady', (e) => {
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
        AjaxBase(null, "/GridData/GetFWSMaterialUps", "GET", { workline: this.workline}, (response) => {
            this.grid.option('dataSource', response.data);
            super.KanbanPlayerSetup();
            this.state = KanbanState.ContentReady;       
        });

        setTimeout(() => {
            this.LoadData();
        }, 1000 * 25 * 60);
    }
}