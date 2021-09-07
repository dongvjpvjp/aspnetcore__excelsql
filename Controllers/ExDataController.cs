using Microsoft.AspNetCore.Http;
using DevExtreme.AspNet.Data;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExReport.Models;
using DevExtreme.AspNet.Mvc;
using System.Data.Entity.Migrations;
using System.Collections;

namespace ExReport.Controllers
{
    public class ExDataController : Controller
    {
        private readonly ExDataContext db;
        public ExDataController(ExDataContext context)
        {
            db = context;
        }
        // GET: ExDataController
        public ActionResult Index() 
        {
            return View();
        }
        public ActionResult Temp()
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
        public ActionResult AddExData([FromBody] string values)
        {
            var exdata = new ExData();
            JsonConvert.PopulateObject(values, exdata);
            db.ExDatas.Attach(exdata);
            db.SaveChanges();
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
        [HttpPut]
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
        }
        /* [HttpPut]
        public object UpdateExData([FromBody] ExData[] values)
        {
            //var update = new ArrayList();
            //var add = new ArrayList();
            List<object> add = new List<object>();
            List<object> update = new List<object>();


            dynamic[] Kteam = new dynamic[3];
            foreach (var item in values)
            {
                var emp = db.ExDatas.FirstOrDefault(x => x.ID == item.ID);
                if (emp == null) add.Add(emp); else update.Add(emp);
            }
            
            

            //JsonConvert.PopulateObject(values, emp);
            
            db.ExDatas.UpdateRange((IEnumerable<ExData>)update);
            //emp = values;
            db.SaveChanges();
            return RedirectToAction("AddExData",new { values = (IEnumerable<ExData>) add });
        } */


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

    }
}
