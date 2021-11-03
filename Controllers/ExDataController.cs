using DevExtreme.AspNet.Data;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Linq;
using ExReport.Models;
using DevExtreme.AspNet.Mvc;
using System.Data.Entity;
namespace ExReport.Controllers
{
    public class ExDataController : Controller
    {
        private readonly ExDataContext db;
        public ExDataController(ExDataContext context)
        {
            db = context;
        }
        public ActionResult Index() 
        {
            return View();
        }

        [HttpGet]
        public object GetExData(DataSourceLoadOptions options, int ID)
        {
            var data = db.ExDatas.ToList();
            return DataSourceLoader.Load(data, options);
        }


        [HttpPost]
        public ActionResult AddExData(string values)
        {
        
            var exdata = new ExData();
            JsonConvert.PopulateObject(values, exdata);
            var emp = db.ExDatas.FirstOrDefault(x => x.Emp_id == exdata.Emp_id );
            if (emp != null)
            {
                JsonConvert.PopulateObject(values, emp);
                db.SaveChanges();
                return Ok(); ;
            }
                db.ExDatas.Attach(exdata);
                db.SaveChanges();
                return Ok();

        }

                [HttpPut]
        public object UpdateExData(int key, string values)
        {
            var emp = db.ExDatas.FirstOrDefault(x => x.ID == key);
            if (emp == null)
            {
                return BadRequest("Khong tim thay du lieu");
            }

            JsonConvert.PopulateObject(values, emp);
            db.SaveChanges();
            return Ok();
        }

        [HttpDelete]
      public object DeleteExData(int key)
      {
          var emp = db.ExDatas.FirstOrDefault(x => x.ID == key);
          if (emp != null)
          {
              db.ExDatas.Remove(emp);
              db.SaveChanges();
          }
          return Ok();
      }



        /* [HttpPost]
        public ActionResult AddExData([FromBody] ExData[] values)
         {
            // var exdata = new ExData();
             //JsonConvert.PopulateObject(values, exdata);
             db.ExDatas.AttachRange(values);
             db.SaveChanges();
             return Ok();

         }
        */



        /*  [HttpPut]
          public object UpdateExData([FromBody] int key, string values)
          {
              var emp = db.ExDatas.FirstOrDefault(x => x.ID == key);
              if (emp == null)
              {
                  return BadRequest("Khong tim thay du lieu");
              }

              JsonConvert.PopulateObject(values, emp);
              db.SaveChanges();
              return Ok();
          } */


        /*       [HttpPut]
              public object UpdateExData([FromBody]string values)
              {
                //ExData temp= (ExData)JsonConvert.DeserializeObject(values);
                var result = JsonConvert.DeserializeObject<ExData>(values);                
                var emp = db.ExDatas.FirstOrDefault(x => x.Emp_id == result.Emp_id && x.Emp_name == result.Emp_name);
                  if (emp == null)
                  {
                      return BadRequest("Khong tim thay du lieu");
                  }

                  JsonConvert.PopulateObject(values, emp);
                  db.SaveChanges();
                  return Ok();
              } 
         */

        /*
         [HttpPut]
          public object UpdateExData([FromBody] ExData values)
          {
              var emp = db.ExDatas.FirstOrDefault(x => x.Emp_id == values.Emp_id && x.Emp_name == values.Emp_name);
              if (emp == null)
              {
                  return BadRequest("Khong tim thay du lieu");
              }
                db.ExDatas.Remove(emp);
                  //db.Entry<ExData>(emp).State = Microsoft.EntityFrameworkCore.EntityState.Detached;
                  //db.ExDatas.Update(emp);
                db.ExDatas.Add(values);
                db.ExDatas.AsNoTracking();
                db.SaveChanges();
              return Ok();
          } 
        */

    //END EXDATA 1st

        
        public ActionResult Task02()
        {
           return View();
        }

         [HttpGet]
        public object GetTFWTSWCExportPlan(DataSourceLoadOptions options, int ID)
        {
            var data = db.TFWTSWCExportPlans.ToList();
            return DataSourceLoader.Load(data, options);
        }


        [HttpPost]
        public ActionResult AddTFWTSWCExportPlan(string values)
        {
            var exdata = new TFWTSWCExportPlan();
            JsonConvert.PopulateObject(values, exdata);
            var emp = db.TFWTSWCExportPlans.FirstOrDefault(x => x.Workline == exdata.Workline && x.Date == exdata.Date && x.MO == exdata.MO );
            if (emp != null)
            {
                JsonConvert.PopulateObject(values, emp);
                db.SaveChanges();
                return Ok(); ;
            }
                db.TFWTSWCExportPlans.Attach(exdata);
                db.SaveChanges();
                return Ok();

        }

        [HttpPut]
        public object UpdateTFWTSWCExportPlan(int key, string values)
        {
            var emp = db.TFWTSWCExportPlans.FirstOrDefault(x => x.ID == key);
            if (emp == null)
            {
                return BadRequest("Khong tim thay du lieu");
            }

            JsonConvert.PopulateObject(values, emp);
            db.SaveChanges();
            return Ok();
        }

        [HttpDelete]
      public object DeleteTFWTSWCExportPlan(int key)
      {
          var emp = db.TFWTSWCExportPlans.FirstOrDefault(x => x.ID == key);
          if (emp != null)
          {
              db.TFWTSWCExportPlans.Remove(emp);
              db.SaveChanges();
          }
          return Ok();
      }

}
}
