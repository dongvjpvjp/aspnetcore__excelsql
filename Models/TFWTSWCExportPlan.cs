using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExReport.Models
{
    [Table("T_FWTSWCExportPlan")]

    public class TFWTSWCExportPlan
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key, Column(Order = 0)]       
        public int ID { get; set; }
        [Required]
        public string Workline { get; set; }

        [Required]
        //[DataType(DataType.Date)]
        public DateTime Date { get; set; }

        [Required]
        public string MO { get; set; }
        [Required]
        public int PlanQty { get; set; }


    }  
}
