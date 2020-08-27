
exports.seed = function(knex, Promise) {
  return knex('projects').insert([   
    {
      "title": "Organize closet",
      "summary": "need to get rid of items I don't use",
      "importance": 3,
      "user_id": "1",
     
  },
  {
      "title": "Work on React Project",
      "summary": "CRUD and state management",
      "importance": 2,
      "user_id": "2",
      
  },
  {
    "title": "Visit Mom and Dad",
    "summary": "Check to see how dad is doing after surgery",
    "importance": 1, 
    "user_id": "1"
},
{
  "title": "VWash my Car",
  "summary": "need to wash my dirty car",
  "importance": 1, 
  "user_id": "3"
}

  ]);
};
