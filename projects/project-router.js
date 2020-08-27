const express = require('express');

const Projects = require('./project-model');

const router = express.Router();

router.get('/', (req, res) => {
  const token = req.decodedJwt;
  console.log(token)

  Projects.find()
  .then(projects => {
    const userProjects = projects.filter(project => project.user_id === req.decodedJwt.subject);
    res.json(userProjects);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get projects' });
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log("info from req.param", req.params)

  Projects.findById(id)
  .then(project => {
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Could not find project with given id.' })
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get projects' });
  });
});

router.get('/:id/values', (req, res) => {
  const { id } = req.params;

  Projects.findvalues(id)
  .then(values => {
    if (values.length) {
      res.json(values);
    } else {
      res.status(404).json({ message: 'Could not find values for given project' })
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get values' });
  });
});

router.post('/', (req, res) => {
  const projectData = req.body;

  projectData.user_id = req.decodedJwt.subject;

  Projects.add(projectData)
  .then(project => {
    res.status(201).json(project);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new project' });
  });
});

router.post('/:id/values', (req, res) => {
  const stepData = req.body;
  const { id } = req.params; 

  Projects.findById(id)
  .then(project => {
    if (project) {
      Projects.addStep(stepData, id)
      .then(step => {
        res.status(201).json(step);
      })
    } else {
      res.status(404).json({ message: 'Could not find project with given id.' })
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new step' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Projects.findById(id)
  .then(project => {
    if (project) {
      Projects.update(changes, id)
      .then(updatedproject => {
        res.json(updatedproject);
      });
    } else {
      res.status(404).json({ message: 'Could not find project with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update project' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Projects.remove(id)
  .then(deleted => {
    if (deleted) {
      res.json({ removed: deleted });
    } else {
      res.status(404).json({ message: 'Could not find project with given id' });
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete project' });
  });
});

module.exports = router;