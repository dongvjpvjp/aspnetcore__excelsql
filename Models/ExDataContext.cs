using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ExReport.Models
{
    public class ExDataContext : DbContext
    {
        public ExDataContext(DbContextOptions<ExDataContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
        public DbSet<ExData> ExDatas { get; set; }
        public DbSet<TFWTSWCExportPlan> TFWTSWCExportPlans {get;set;}
    }
}
