using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExReport.Models
{
    [Table("Test")]

    public class ExData
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key, Column(Order = 0)]
        public int ID { get; set; }
        [Required]
        public string Department { get; set; }

        [Required]
        public string Workshop { get; set; }

        [Required]
        public string Line_no { get; set; }

        [Required]
        public string Emp_id { get; set; }

        [Required]
        public string Emp_name { get; set; }

        public int? F8T9 { get; set; }
        public int? F9T10 { get; set; }
        public int? F10T11 { get; set; }
        public int? F11T12 { get; set; }
        public int? F12T1230 { get; set; }
        public int? F1330T1430{ get; set; }
        public int? F1430T1530 { get; set; }
        public int? F1530T1630 { get; set; }
        public int? F1630T1730 { get; set; }
        public int? F1730T1830 { get; set; }
    }  
}
