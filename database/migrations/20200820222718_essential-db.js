
exports.up = function(knex) {
    return knex.schema
    .createTable('values', tbl => {
        tbl.increments();
        tbl.string('value_name', 128).notNullable().unique();

    })
    .createTable('projects', tbl => {
        tbl.increments();
        tbl.string('title', 128);
        tbl.string('summary', 256);
        tbl.integer('importance');
        tbl.integer('user_id')
            .unsigned()
            .notNullable()
            .references('users.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE'); 
        tbl.integer('value_a');
         
        
    })
   /*  .createTable("values", tbl => {
        tbl.integer("project_id")
            .unsigned()
            .notNullable()
            .references("projects.id")
            .onUpdate("CASCADE")
            .onDelte("CASCADE")
        tbl.string("value_name", 128).notNullable();
        tbl.primary(["project_id", "value_name"])
    }) */
    .createTable('project_value', tbl => {
        tbl.integer('value_id')
            .unsigned()
            .notNullable()
            .references('values.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        tbl.integer('project_id')
            .unsigned()
            .notNullable()
            .references('projects.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        tbl.primary(['value_id', 'project_id']); //use this syntax if you want a unique primary key for every entry, if you logging entries with the same output use incriments()           
    })
};

exports.down = function(knex) {
  knex.schema
  .dropTableIfExists('project_value')
  .dropTableIfExists('projects')
  .dropTableIfExists('values')
  .dropTableIfExists('users')
};
