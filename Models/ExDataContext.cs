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
        public DbSet<ExData> ExDatas { get; set; }
    }
}
