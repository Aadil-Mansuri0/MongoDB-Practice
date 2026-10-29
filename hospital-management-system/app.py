"""Educational Hospital Management System using Flask and MongoDB."""
import os
from datetime import datetime, timezone
from flask import Flask, jsonify, redirect, render_template_string, request, url_for
from dotenv import load_dotenv
from pymongo import MongoClient
import mongomock

load_dotenv()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "local-development-only")
DB_NAME = os.getenv("DB_NAME", "HospitalDB")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/HospitalDB")
COLLECTIONS = ("patients", "doctors", "appointments", "medical_records", "prescriptions", "billing", "rooms")

def seed(db):
    samples = {
      "patients":[{"patient_id":"P101","name":"Rahul Sharma","age":34,"gender":"Male","blood_group":"B+","phone":"9000000101","address":"Jaipur"},{"patient_id":"P102","name":"Priya Verma","age":28,"gender":"Female","blood_group":"O+","phone":"9000000102","address":"Ajmer"}],
      "doctors":[{"doctor_id":"D101","name":"Dr. Meera Joshi","specialization":"Cardiology","experience":8,"consultation_fee":700,"available":True},{"doctor_id":"D102","name":"Dr. Arjun Singh","specialization":"Orthopedics","experience":6,"consultation_fee":500,"available":True}],
      "appointments":[{"appointment_id":"A101","patient_id":"P101","doctor_id":"D101","appointment_date":"2026-11-01","status":"Scheduled","reason":"Routine check-up"}],
      "medical_records":[],"prescriptions":[],
      "billing":[{"bill_id":"B101","patient_id":"P101","amount":700,"payment_status":"Paid","bill_date":"2026-10-20"}],
      "rooms":[{"room_number":"101","room_type":"General","total_beds":4,"occupied_beds":1,"charge_per_day":1200}]}
    for name, docs in samples.items():
        if docs and db[name].count_documents({}) == 0: db[name].insert_many(docs)

def connect():
    try:
        c=MongoClient(MONGO_URI,serverSelectionTimeoutMS=1800); c.admin.command("ping")
        return c,c[DB_NAME],False
    except Exception:
        c=mongomock.MongoClient(); return c,c[DB_NAME],True
client,db,DEMO=connect()
seed(db)

STYLE="""<style>
body{margin:0;background:#0b1220;color:#e7eef9;font:15px/1.5 system-ui}header,main{padding:22px max(4vw,18px)}header{background:#101b2d;border-bottom:1px solid #2a3a50}h1{margin:0}nav{display:flex;flex-wrap:wrap;gap:9px;margin-top:16px}a,button{color:#e7eef9;background:#17263a;border:1px solid #31445e;border-radius:8px;padding:9px 12px;text-decoration:none;cursor:pointer}main{max-width:1150px;margin:auto}.card{background:#121f32;border:1px solid #2a3a50;border-radius:12px;padding:16px;margin:12px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}.metric{font-size:28px;color:#63dec9}input,select{padding:10px;background:#0b1423;color:#fff;border:1px solid #31445e;border-radius:7px;margin:4px}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:9px;border-bottom:1px solid #2a3a50}small{color:#9aacc4}.scroll{overflow:auto}pre{white-space:pre-wrap;overflow:auto}
</style>"""
def page(title, body):
    nav=" ".join(f'<a href="{u}">{n}</a>' for u,n in [("/","Dashboard"),("/patients","Patients"),("/doctors","Doctors"),("/appointments","Appointments"),("/billing","Billing"),("/rooms","Rooms"),("/queries","Query Lab")])
    return render_template_string(f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title>{STYLE}</head><body><header><h1>Hospital Management System</h1><p>Flask · MongoDB · CRUD · Aggregation</p><nav>{nav}</nav></header><main><p><small>Mode: {"in-memory demo" if DEMO else "MongoDB"} · Educational project only; do not use real patient data.</small></p>{body}</main></body></html>')

def docs(cursor): return [{k:(str(v) if k=="_id" else v) for k,v in d.items()} for d in cursor]
def table(records, fields):
    head="".join(f"<th>{f.replace('_',' ').title()}</th>" for f in fields)
    rows="".join("<tr>"+"".join(f"<td>{d.get(f,'')}</td>" for f in fields)+"</tr>" for d in records)
    return f'<div class="card scroll"><table><tr>{head}</tr>{rows or "<tr><td>No records found</td></tr>"}</table></div>'

@app.get("/")
def dashboard():
    stats={n:db[n].count_documents({}) for n in ("patients","doctors","appointments","billing","rooms")}
    body='<h2>Dashboard</h2><div class="grid">'+''.join(f'<div class="card"><small>{n.title()}</small><div class="metric">{v}</div></div>' for n,v in stats.items())+'</div><div class="card"><h3>Modules</h3>Patient registry, doctor directory, appointment scheduling, billing, room overview, and a MongoDB learning query lab.</div>'
    return page("Dashboard",body)
@app.route("/patients",methods=["GET","POST"])
def patients():
    msg=""
    if request.method=="POST":
        d=request.form.to_dict()
        try:
            d["age"]=int(d["age"])
            if not d.get("name","").strip() or not 0<=d["age"]<=125: raise ValueError()
            d["patient_id"]=d.get("patient_id") or f'P{db.patients.count_documents({})+101}'
            if db.patients.find_one({"patient_id":d["patient_id"]}): raise ValueError()
            d["created_at"]=datetime.now(timezone.utc).isoformat(); db.patients.insert_one(d); msg="Patient registered."
        except (KeyError,ValueError): msg="Invalid details or duplicate patient ID."
    s=request.args.get("search","").strip()
    q={"$or":[{"name":{"$regex":s,"$options":"i"}},{"patient_id":{"$regex":s,"$options":"i"}}]} if s else {}
    body=f'<h2>Patient Registry</h2><p>{msg}</p><div class="card"><form method="post"><input name="patient_id" placeholder="Patient ID (optional)"><input name="name" required placeholder="Full name"><input name="age" required type="number" min="0" max="125" placeholder="Age"><input name="gender" placeholder="Gender"><input name="blood_group" placeholder="Blood group"><input name="phone" placeholder="Phone"><input name="address" placeholder="Address"><button>Add patient</button></form><form><input name="search" value="{s}" placeholder="Search name/ID"><button>Search</button></form></div>'
    return page("Patients",body+table(docs(db.patients.find(q).sort("patient_id",1)),["patient_id","name","age","gender","blood_group","phone","address"]))
@app.post("/patients/<pid>/delete")
def delete_patient(pid):
    db.patients.delete_one({"patient_id":pid}); return redirect(url_for("patients"))
@app.get("/doctors")
def doctors(): return page("Doctors","<h2>Doctors</h2>"+table(docs(db.doctors.find().sort("name",1)),["doctor_id","name","specialization","experience","consultation_fee","available"]))
@app.route("/appointments",methods=["GET","POST"])
def appointments():
    msg=""
    if request.method=="POST":
        d=request.form.to_dict()
        if not db.patients.find_one({"patient_id":d.get("patient_id")}) or not db.doctors.find_one({"doctor_id":d.get("doctor_id")}): msg="Unknown patient or doctor ID."
        elif db.appointments.find_one({"appointment_id":d.get("appointment_id")}): msg="Appointment ID already exists."
        else: d["status"]="Scheduled"; db.appointments.insert_one(d); msg="Appointment scheduled."
    body=f'<h2>Appointments</h2><p>{msg}</p><div class="card"><form method="post"><input name="appointment_id" required placeholder="Appointment ID"><input name="patient_id" required placeholder="Patient ID"><input name="doctor_id" required placeholder="Doctor ID"><input name="appointment_date" type="date" required><input name="reason" placeholder="Reason"><button>Schedule</button></form></div>'
    return page("Appointments",body+table(docs(db.appointments.find().sort("appointment_date",1)),["appointment_id","patient_id","doctor_id","appointment_date","status","reason"]))
@app.get("/billing")
def billing():
    rev=sum((x.get("amount",0) or 0) for x in db.billing.find({"payment_status":"Paid"}))
    return page("Billing",f'<h2>Billing · Paid revenue ₹{rev}</h2>'+table(docs(db.billing.find().sort("bill_date",-1)),["bill_id","patient_id","amount","payment_status","bill_date"]))
@app.get("/rooms")
def rooms(): return page("Rooms","<h2>Ward & Bed Allocation</h2>"+table(docs(db.rooms.find().sort("room_number",1)),["room_number","room_type","total_beds","occupied_beds","charge_per_day"]))
@app.route("/queries",methods=["GET","POST"])
def queries():
    out=None
    if request.method=="POST":
        q=request.form.get("query_id")
        if q=="patients": out=docs(db.patients.find().limit(100))
        elif q=="count": out={"total_patients":db.patients.count_documents({})}
        elif q=="doctors": out=docs(db.doctors.find().sort("specialization",1).limit(100))
        elif q=="revenue": out=docs(db.billing.aggregate([{"$match":{"payment_status":"Paid"}},{"$group":{"_id":None,"totalRevenue":{"$sum":"$amount"}}}]))
        elif q=="lookup": out=docs(db.appointments.aggregate([{"$lookup":{"from":"patients","localField":"patient_id","foreignField":"patient_id","as":"patient"}},{"$unwind":{"path":"$patient","preserveNullAndEmptyArrays":True}},{"$project":{"_id":0,"appointment_id":1,"patient_id":1,"patient_name":"$patient.name","status":1}},{"$limit":100}]))
    body='<h2>MongoDB Query Lab</h2><div class="card"><form method="post"><select name="query_id"><option value="patients">All patients (find)</option><option value="count">Patient count</option><option value="doctors">Sort doctors</option><option value="revenue">Paid revenue aggregation</option><option value="lookup">Appointments with patient names ($lookup)</option></select><button>Run</button></form>'
    if out is not None: body+=f'<pre>{__import__("json").dumps(out,indent=2,default=str)}</pre>'
    return page("Query Lab",body+"</div>")
@app.get("/api/health")
def health(): return jsonify({"status":"ok","database_mode":"demo" if DEMO else "mongodb"})
@app.get("/api/stats")
def api_stats(): return jsonify({n:db[n].count_documents({}) for n in COLLECTIONS})
@app.get("/api/patients")
def api_patients(): return jsonify(docs(db.patients.find().limit(100)))
if __name__=="__main__":
    app.run(host=os.getenv("HOST","127.0.0.1"),port=int(os.getenv("PORT","5000")),debug=os.getenv("FLASK_DEBUG","false").lower()=="true" and os.getenv("ENVIRONMENT","").lower()!="production")
