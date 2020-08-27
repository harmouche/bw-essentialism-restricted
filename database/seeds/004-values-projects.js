
exports.seed = function(knex, Promise) {
  return knex('project_value').insert([   
    {project_id: "1", value_id: "5"},
    {project_id: "2", value_id: "9"},
    {project_id: "3", value_id: "13"},
    {project_id: "4", value_id: "36"},
    {project_id: "1", value_id: "7"},
    {project_id: "2", value_id: "12"},
    {project_id: "3", value_id: "28"},
    {project_id: "4", value_id: "37"}
  ]);
};
