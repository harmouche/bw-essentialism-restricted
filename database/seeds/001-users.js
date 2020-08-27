
exports.seed = function(knex) {
  return knex('users').insert([
    {"name": "user1",
    "username": "user1@gmail.com",
    "password": "$2a$08$py3ghVTH4z6nZJKTaSt7ye5L23EWehDJ2UFsLObFE5Mtvsq2c5VOi"},
    {"name": "user2",
    "username": "user2@gmail.com",
    "password": "$2a$08$py3ghVTH4z6nZJKTaSt7ye5L23EWehDJ2UFsLObFE5Mtvsq2c5VOi"},
    {"name": "user3",
    "username": "user3@gmail.com",
    "password": "$2a$08$py3ghVTH4z6nZJKTaSt7ye5L23EWehDJ2UFsLObFE5Mtvsq2c5VOi"},
    {"name": "user4",
    "username": "user4@gmail.com",
    "password": "$2a$08$py3ghVTH4z6nZJKTaSt7ye5L23EWehDJ2UFsLObFE5Mtvsq2c5VOi"},
  ]);
};
