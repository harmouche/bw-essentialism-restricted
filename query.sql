-- //selecting projects details and related VALUES per user_id 

SELECT projects.*,
       v.id as value_id,
       v.value_name
  FROM projects
       JOIN
       project_value ON projects.id = project_value.project_id AND 
                        projects.user_id = '1'
       JOIN
       [values] as v ON project_value.value_id = v.id