  
const db = require('../database/connection')
function find() {
    if(process.env.NODE_ENV !== "production") {
        return db('projects as p')
        .with("val", qb => {
            qb.select("pv.project_id", db.raw("JSON_GROUP_ARRAY(JSON_OBJECT('id', v.id, 'value_name', v.value_name)) as [values]"))
                .from("values as v")
                .join("project_value as pv", "pv.value_id", "v.id")
                .groupBy("pv.project_id")
                .orderBy("pv.project_id")
        })
        .leftJoin("val", "val.project_id", "p.id")
        .select("p.*", "val.values")
        .then(projects => {
            return projects.map(project => {
                if(!project.values) {
                    project.values = []
                } else {
                    project.values = JSON.parse(project.values);
                }
                return project;
            })
        })
    } else {
        return db("projects as p")
            .with("val", qb => {
                qb.select("pv.project_id", db.raw("ARRAY_AGG(ROW_TO_JSON(v)) as values"))
                    .from(db.raw("(SELECT id, value_name from values) v"))
                    .join("project_value as pv", "pv.value_id", "v.id")
                    .groupBy("project_id")
                    .orderBy("project_id")
            })
            .leftJoin("val", "val.project_id", "p.id")
            .select("p.*", "val.values")
            .then(projects => {
                return projects.map(project => {
                    if(!project.values) project.values = [];
                    return project;
                })
            })
    }
}
function findBy(filter) {
    return db("projects").where(filter);
}
function findById(id) {
    if(process.env.NODE_ENV !== "production") {
        return db('projects as p')
        .with("val", qb => {
            qb.select("pv.project_id", db.raw("JSON_GROUP_ARRAY(JSON_OBJECT('id', v.id, 'value_name', v.value_name)) as [values]"))
                .from("values as v")
                .join("project_value as pv", "pv.value_id", "v.id")
                .groupBy("pv.project_id")
        })
        .leftJoin("val", "val.project_id", "p.id")
        .select("p.*", "val.values")
        .where({id: id})
        .first()
        .then(project => {
            if(!project.values) {
                project.values = []
            } else {
                project.values = JSON.parse(project.values);
            }
            return project;
        })
    } else {
        return db("projects as p")
            .with("val", qb => {
                qb.select("pv.project_id", db.raw("ARRAY_AGG(ROW_TO_JSON(v)) as values"))
                    .from(db.raw("(SELECT id, value_name from values) v"))
                    .join("project_value as pv", "pv.value_id", "v.id")
                    .groupBy("project_id")
            })
            .leftJoin("val", "val.project_id", "p.id")
            .select("p.*", "val.values")
            .where({id: id})
            .first()
            .then(project => {
                    if(!project.values) project.values = [];
                    return project;
            })
    }
}
function findvalues(id) {
    return db( 'values as c')
    .join('projects as s', 's.id', 'c.scheme_id',)
    .select('s.scheme_name', 'c.step_number', 'c.instructions', )
    .where({ scheme_id: id });
}
function add(projectData) {
    return db.transaction(trx => {
        return trx
            .insert({
                title: projectData.title,
                summary: projectData.summary,
                importance: projectData.importance,
                user_id: projectData.user_id
            }, "id")
            .into("projects")
            .then(async ([id]) => {
                if(!projectData.values) return id;
                const rows = projectData.values.map(val => ({
                    project_id: id,
                    value_id: val.id
                }))
                await db.batchInsert("project_value", rows).transacting(trx);
                return id;
            })
    })
    .then(id => findById(id));
}
function addStep(stepData) {
    return db('values','projects').insert(stepData)
}
function update(changes, id) {
    const values = changes.values ? [...changes.values] : null;
    const projectData = changes;
    delete projectData.values;
    return db
        .transaction(function (trx) {
            return db("projects")
                .transacting(trx)
                .where({ id: id })
                .update(projectData, "id")
                .then(async function () {
                    if (!values) return id;
                    await db("project_value")
                        .transacting(trx)
                        .where({ project_id: id })
                        .del();
                    const rows = values.map((val) => ({
                        project_id: id,
                        value_id: val.id
                    }));
                    await db.batchInsert("project_value", rows).transacting(trx);
                    return id;
            });
    })
    .then((id) => findById(id));
}
function remove(id) {
    return db('projects').where({ id }).del();
}
module.exports = {
find, 
findBy,
findById,
findvalues,
add,
addStep,
update,
remove
}