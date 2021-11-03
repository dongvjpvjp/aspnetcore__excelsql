//import { KanbanState, KanbanGridBase } from '../KanbanBase.js';
//import { KanbanPlayerType } from '../KanbanPlayer.js';

export class CustomEmployeeEfficiency extends KanbanGridBase {
    constructor(ktv, screen, containerID, gridID, parameter) {
        super(ktv, screen, containerID, gridID);
        this.playerType = KanbanPlayerType.GridScroll;
        //this.workshop = parameter["Workshop"];
        this.Initializing();
    }
    Initializing() {
        this.ContainerSetup();
        this.GridSetup();
        this.LoadData();
    }

    ContainerSetup() {
        this.state = KanbanState.Initializing;
        let html = ` <h2 class="text-center" style="font-size:5vh">丝印摆料看板</h2>
        <div id="`+ this.gridID + `" style="max-height: 90vh !important;">
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
        this.grid.option('columns', [
            { dataField: "Department", caption: "部门", dataType: "string", },
            { dataField: "Workshop", caption: "车间", dataType: "string", },

            { dataField: "Line_no", caption: "线别", dataType: "string", },
            { dataField: "Line_no", dataType: "string", groupIndex: 0 },

            { dataField: "Emp_id", caption: "工号", dataType: "string", },
            { dataField: "Emp_name", caption: "姓名", dataType: "string", },
            { dataField: "F8T9", width: "5%", dataType: "number", caption: "8:00-9:00" },
            { dataField: "F9T10", width: "5%", dataType: "number", caption: "9:00-10:00" },
            { dataField: "F10T11", width: "5%", dataType: "number", caption: "10:00-11:00" },
            { dataField: "F11T12", width: "5%", dataType: "number", caption: "11:00-12:00" },
            { dataField: "F12T1230", width: "5%", dataType: "number", caption: "12:00-13:00" },
            {
                caption: "上午小计", width: "5%", calculateCellValue: function (data) {
                    data.data_mor = data.F8T9 + data.F9T10 + data.F10T11 + data.F11T12 + data.F12T1230
                    return data.data_mor;
                }
            },
            { dataField: "F1330T1430", width: "5%", dataType: "number", caption: "13:00-14:00" },
            { dataField: "F1430T1530", width: "5%", dataType: "number", caption: "14:00-15:00" },
            { dataField: "F1530T1630", width: "5%", dataType: "number", caption: "15:00-16:00" },
            { dataField: "F1630T1730", width: "5%", dataType: "number", caption: "16:00-17:00" },
            { dataField: "F1730T1830", width: "5%", dataType: "number", caption: "17:00-18:00" },
            { dataField: "F1800T1900", width: "5%", dataType: "number", caption: "18:00-19:00" },

            {
                caption: "下午小计", width: "5%", calculateCellValue: function (data) {
                    data.data_aft = data.F1330T1430 + data.F1430T1530 + data.F1530T1630 + data.F1630T1730 + data.F1730T1830 + data.F1800T1900
                    return data.data_aft
                }
            },

            {
                caption: "汇总", width: "5%", calculateCellValue: function (data) {
                    return data.data_mor + data.data_aft
                }
            }
        ]);
        this.grid.option('summary', {
            groupItems: [
                {
                    column: "Line_no",
                    summaryType: "max",
                    displayFormat: "{0}",
                    minWidth: 150,
                    showInGroupFooter: true,

                },
                this.sum_col("F8T9"),
                this.sum_col("F9T10"),
                this.sum_col("F10T11"),
                this.sum_col("F11T12"),
                this.sum_col("F12T1230"),
                this.sum_col("上午小计"),
                this.sum_col("F1330T1430"),
                this.sum_col("F1430T1530"),
                this.sum_col("F1530T1630"),
                this.sum_col("F1630T1730"),
                this.sum_col("F1730T1830"),
                this.sum_col("F1800T1900"),
                this.sum_col("下午小计"),
                this.sum_col("汇总"),
            ],
            totalItems: [
                {
                    column: "Line_no",
                    summaryType: "max",
                    displayFormat: " ESP 汇总 ",
                    minWidth: 150,
                    showInGroupFooter: true,
                },
                this.sum_col("F8T9"),
                this.sum_col("F9T10"),
                this.sum_col("F10T11"),
                this.sum_col("F11T12"),
                this.sum_col("F12T1230"),
                this.sum_col("上午小计"),
                this.sum_col("F1330T1430"),
                this.sum_col("F1430T1530"),
                this.sum_col("F1530T1630"),
                this.sum_col("F1630T1730"),
                this.sum_col("F1730T1830"),
                this.sum_col("F1800T1900"),
                this.sum_col("下午小计"),
                this.sum_col("汇总"),
            ]

        });
        this.grid.option('onCellPrepared', (e) => {
            if (e.rowType === "header") {
                e.cellElement.css("background-color", "rgb(141,180,226)");
                e.cellElement.css('font-weight', 'bold');
                //
            }
            else if (e.rowType === "group") {
                e.cellElement.css("display", "none");
                //
            } else if (e.rowType === "groupFooter") {
                e.cellElement.css("background-color", "rgb(253,233,217)");
                e.cellElement.css('font-weight', 'bold');
            } else if (e.rowType === "totalFooter") {
                e.cellElement.css("background-color", "rgb(250,191,143)");
                e.cellElement.css('font-weight', 'bold');
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
        $.get("/GridData/GetESPEmployeeEfficiency").then((response) => {
            try {
                this.grid.option('dataSource', response.data);
                if (!this.firstLoadDone) {
                    super.KanbanPlayerSetup();
                    this.state = KanbanState.ContentReady;
                    this.firstLoadDone = true;
                }
            }
            catch (e) {
                alert(e);
            }

        });

        setTimeout(() => {
            this.LoadData();
        }, 1000 * 25 * 60);
    }
}