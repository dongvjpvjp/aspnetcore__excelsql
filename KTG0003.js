//import { KanbanState, KanbanGridBase } from '../KanbanBase.js';
//import { KanbanPlayerType } from '../KanbanPlayer.js';
export class KTG0003 extends KanbanGridBase {
    constructor(ktv, screen, containerID, gridID, parameter) {
        super(ktv, screen, containerID, gridID);
        this.url = parameter["url"];
        this.InventoryID = parameter["InventoryID"];
        this.FromShelfNo = parameter["FromShelfNo"];
        this.ToShelfNo = parameter["ToShelfNo"];
        this.title = parameter["Title"];
        this.subtitle = parameter["Subtitle"];
        this.titlecolor = parameter["TitleColor"];
        this.subtitlecolor = parameter["SubtitleColor"];
        this.fontSize = parameter["FontSize"]
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
        let html = `<h2 style="color:${this.titlecolor || 'black'};text-align: center;">${this.title || '热熔机原料库存明细 Biểu chi tiết tồn kho nguyên liệu nhiệt dung'  }</h2>
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
            valueFormat: "#0.00",
        };
    }
    withOutTime(date){
        let temp = new Date(date) 
        temp.setHours(0,0,0,0);
        return temp||date;
        }

    GridSetup() {
        let temp = {
            yellow:[],
            orange:[],
            red:[],
        };
        const brheader = (header, info) => {
            $("<div>").html(info.column.caption.replace(/\n/g, "<br/>")).appendTo(header);
            // add the <br/> thay cho \n voi cac header
        }

        this.grid = $('#' + this.gridID + '').dxDataGrid(BASIC_GRID_OPTION).dxDataGrid('instance');
        this.grid.option('columns', [
            { "dataField": "Stack.Name", "caption": `Mã giá\n架位`, "dataType": "string", "headerCellTemplate": brheader },
            { "dataField": "StackLog.Time", "caption": `Thời gian thao tác\n操作时间`, "dataType": "datetime", "headerCellTemplate": brheader, },
            { "dataField": "B1", "caption": `Thời gian thao tác\n操作时间`, "dataType": "date", "headerCellTemplate": brheader, groupIndex: 0},
            { "dataField": "SAPMain.StyleNo", "caption": `Mã hàng\n款号`, "dataType": "string", "headerCellTemplate": brheader }, 
            { "dataField": "SAPMain.ItemNumber", "caption": `Tên vật liệu\n物料描述`, "dataType": "string", "headerCellTemplate": brheader },
            { "dataField": "SAPMain.Type", "caption": `Loại hình vật liệu\n物料类型`, "dataType": "string", "headerCellTemplate": brheader },
            { "dataField": "SAPMain.Cylinder", "caption": `Số mẻ\n缸号`, "dataType": "string", },
            { "dataField": "SAPMain.Color", "caption": `Số màu\n色号`, "dataType": "string", "headerCellTemplate": brheader },
            { "dataField": "SAPMain.GroupColor", "caption": `Mã tổ\n组号`, "dataType": "string", "alignment":"right","headerCellTemplate": brheader },
            { "dataField": "SAPMain.ActualAmonut", "caption": `Số lượng thực tế\n实际数量`, "dataType": "number", "headerCellTemplate": brheader },
            { "dataField": "SAPMain.VolumeNumber", "caption": `Số cuộn\n卷号`, "dataType": "number", "headerCellTemplate": brheader },
            { "dataField": "SAPMain.Weight", "caption": `Trọng lượng\n重量`, "dataType": "number", },

        ]);
        this.grid.option('summary', {
            groupItems: [{
                "column": "B1",
                "showInColumn":"H",
                "summaryType": "max",
                "displayFormat": "合计",
                "minWidth": 150,
                "showInGroupFooter": true,
            },
            this.sum_col('I'),
            this.sum_col('U'),
            this.sum_col('P'),

            ],
            totalItems: [{
                "column": "H",
                "summaryType": "max",
                "displayFormat": "合计",
                "minWidth": 150,
                "showInGroupFooter": true,
            },
            this.sum_col('I'),
            this.sum_col('U'),
            this.sum_col('P'),
            ],
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
                
                if (e.columnIndex === 2) {
                    if (this.withOutTime(Date.now()) - this.withOutTime(new Date(e.value)) > 1.5778463 *Math.pow(10,10) && (e.data.E == "ZR01" || e.data.E =="ZROH")) temp.red.push(e.rowIndex);
                    else if (this.withOutTime(Date.now()) - this.withOutTime(new Date(e.value)) > 7.88923149 * Math.pow(10,9)  && (e.data.E == "ZR01" || e.data.E =="ZROH") ) temp.orange.push(e.rowIndex);
                    else if (this.withOutTime(Date.now()) - this.withOutTime(new Date(e.value)) > 2160000000  && e.data.E == "ZR01" ) temp.yellow.push(e.rowIndex);
                    // COLOR
                }

            }
            else if (e.rowType === "groupFooter") {
                e.cellElement.css('background-color', '#FCE4D6');
                e.cellElement.css('font-weight', 'bold');


                e.columnIndex > 8 ? e.cellElement.css("border", "1px solid #ddd") : null;
                e.columnIndex === 9 ? e.cellElement.css("text-align", "right") : null;

            }
            else if (e.rowType === "totalFooter") {
                e.cellElement.css('background-color', '#F4B084');
                e.cellElement.css('font-weight', 'bold');
                e.columnIndex > 8 ? e.cellElement.css("border", "1px solid #ddd") : null;
                e.columnIndex === 9 ? e.cellElement.css("text-align", "right") : null;

            }

            e.cellElement.css('text-align', 'center');
            e.cellElement.css('vertical-align', 'middle');
            e.cellElement.css('font-size', this.fontSize || 16 +  'px');
            e.cellElement.css("color", "black");
            e.cellElement.css("padding", "0px");
        });
        this.grid.option('onContentReady', (e) => {
            temp.yellow.forEach(item => {
                e.element.find(`.dx-row.dx-data-row.dx-row-lines.dx-column-lines[aria-rowindex='${item + 1}']`).css('background-color', 'yellow')
                e.element.find(`.dx-row.dx-data-row.dx-row-lines.dx-column-lines[aria-rowindex='${item + 1}'] + tr > td[aria-colindex="9"] ~ td`).css('background-color', 'yellow')
            })
            temp.orange.forEach(item => {
                e.element.find(`.dx-row.dx-data-row.dx-row-lines.dx-column-lines[aria-rowindex='${item + 1}']`).css('background-color', 'orange')
                e.element.find(`.dx-row.dx-data-row.dx-row-lines.dx-column-lines[aria-rowindex='${item + 1}'] + tr > td[aria-colindex="9"] ~ td`).css('background-color', 'orange')
            })
            temp.red.forEach(item => {
                e.element.find(`.dx-row.dx-data-row.dx-row-lines.dx-column-lines[aria-rowindex='${item + 1}']`).css('background-color', 'red')
                e.element.find(`.dx-row.dx-data-row.dx-row-lines.dx-column-lines[aria-rowindex='${item + 1}'] + tr > td[aria-colindex="9"] ~ td`).css('background-color', 'red')
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
        AjaxBase(null, this.url || "/WHS/WHS0001", "POST", { InventoryID:this.InventoryID, FromShelfNo:this.FromShelfNo , ToShelfNo:this.ToShelfNo }, (response) => {
        // { "dataField": "Stack.Name", "caption": `Mã giá\n架位`, "dataType": "string", "headerCellTemplate": brheader },
        // { "dataField": "StackLog.Time", "caption": `Thời gian thao tác\n操作时间`, "dataType": "datetime", "headerCellTemplate": brheader, },
        // { "dataField": "B1", "caption": `Thời gian thao tác\n操作时间`, "dataType": "date", "headerCellTemplate": brheader, groupIndex: 0},
        // { "dataField": "SAPMain.StyleNo", "caption": `Mã hàng\n款号`, "dataType": "string", "headerCellTemplate": brheader }, 
        // { "dataField": "SAPMain.ItemNumber", "caption": `Tên vật liệu\n物料描述`, "dataType": "string", "headerCellTemplate": brheader },
        // { "dataField": "SAPMain.Type", "caption": `Loại hình vật liệu\n物料类型`, "dataType": "string", "headerCellTemplate": brheader },
        // { "dataField": "SAPMain.Cylinder", "caption": `Số mẻ\n缸号`, "dataType": "string", },
        // { "dataField": "SAPMain.Color", "caption": `Số màu\n色号`, "dataType": "string", "headerCellTemplate": brheader },
        // { "dataField": "SAPMain.GroupColor", "caption": `Mã tổ\n组号`, "dataType": "string", "alignment":"right","headerCellTemplate": brheader },
        // { "dataField": "SAPMain.ActualAmonut", "caption": `Số lượng thực tế\n实际数量`, "dataType": "number", "headerCellTemplate": brheader },
        // { "dataField": "SAPMain.VolumeNumber", "caption": `Số cuộn\n卷号`, "dataType": "number", "headerCellTemplate": brheader },
        // { "dataField": "SAPMain.Weight", "caption": `Trọng lượng\n重量`, "dataType": "number", },
            response.data.forEach((item,index,arr)=>{
                Object.defineProperty(item,"B1",{writable:true})
                item.B1 = this.withOutTime(new Date(item.StackLog.Time)).toString();
             });
            this.grid.option('dataSource', response.data);
            super.KanbanPlayerSetup();
            this.state = KanbanState.ContentReady;
        });
        // { "dataField": "A", "caption": `Mã giá\n架位`, "dataType": "string", "headerCellTemplate": brheader },
        //     { "dataField": "B", "caption": `Thời gian thao tác\n操作时间`, "dataType": "datetime", "headerCellTemplate": brheader, },
        //     { "dataField": "B1", "caption": `Thời gian thao tác\n操作时间`, "dataType": "date", "headerCellTemplate": brheader, groupIndex: 0},
        //     { "dataField": "C", "caption": `Mã hàng\n款号`, "dataType": "string", "headerCellTemplate": brheader }, 
        //     { "dataField": "D", "caption": `Tên vật liệu\n物料描述`, "dataType": "string", "headerCellTemplate": brheader },
        //     { "dataField": "E", "caption": `Loại hình vật liệu\n物料类型`, "dataType": "string", "headerCellTemplate": brheader },
        //     { "dataField": "F", "caption": `Số mẻ\n缸号`, "dataType": "string", },
        //     { "dataField": "G", "caption": `Số màu\n色号`, "dataType": "string", "headerCellTemplate": brheader },
        //     { "dataField": "H", "caption": `Mã tổ\n组号`, "dataType": "string", "alignment":"right","headerCellTemplate": brheader },
        //     { "dataField": "I", "caption": `Số lượng thực tế\n实际数量`, "dataType": "number", "headerCellTemplate": brheader },
        //     { "dataField": "U", "caption": `Số cuộn\n卷号`, "dataType": "number", "headerCellTemplate": brheader },
        //     { "dataField": "P", "caption": `Trọng lượng\n重量`, "dataType": "number", },
        // let test = [
        //     {
        //         A:"BCUT-053-06",B:new Date().toString(),C:"R01XBWF21041-J1",D:"62733795 48\"",E:"ZROH",F:"B210118091-005",G:"A01A002 BLACK 095A",H:"专缸专组-1"
        //         ,I:24,U:19,P:7.2
        //     },
        //     {
        //         A:"BCUT-173-10",B:"1/10/2020  8:27:00",C:"V01CG1050L43-J1",D:"LUSH-P 43\"",E:"ZR01",F:"42869-1A",G:"V01U596 135105 C505 56DY 0\"",H:"专缸专组"
        //         ,I:7.6,U:4,P:1.1
        //     },
        //     {
        //         A:"BCUT-073-05",B:"16/10/2021  8:00:00 ",C:"R01XBWF20546-J2",D:"642561352 48\"",E:"ZROH",F:"B210118071-006",G:"A01A007 BLUE 095A",H:"专缸专组"
        //         ,I:20,U:15,P:6.5
        //     },
        //     {
        //         A:"BCUT-053-06",B:"16/10/2021  9:20:00 ",C:"R01XBWF21950-J2",D:"52233795 48\"",E:"ZR01",F:"42869-1A",G:"A01A005 WHITE 097A",H:"专缸专组"
        //         ,I:19,U:12,P:5.4
        //     }
        // ]
        // test.forEach((item,index,arr)=>{
        //     Object.defineProperty(item,"B1",{writable:true})
        //     item.B1 = this.withOutTime(new Date(item.B)).toString();
        // });
        // this.grid.option('dataSource', test)

        setTimeout(() => {
            this.LoadData();
        }, 1000 * 25 * 60);
    }
}