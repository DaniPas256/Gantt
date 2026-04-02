# Gantt Chart

Simple gantt chart. I created it as my portfolio project.

[DEMO](https://danipas256.github.io/Gantt/)

# Features

- Create/edit task
- Set task as child of another task
- Drag tasks
- Resize tasks
- Drag task progress
- Create relations between tasks ( no logic behind )
- Remove relations
- Fit scale to tasks
- Zoom scale
- Lock scale from auto resizing
- Choose visible columns

## ToDo

There is hell of work to do, most imporant:

- Change task order in task list
- Add logic behind relations
- Emit events, i.e. onBeforeTaskDrag, onTaskDrag, onAfterTaskDrag
- Inline edit mode
- Set task name of left/right side of task if it not fit inside

## Technology stack

- Angular 6 with Nx workspace - gantt as lib
- Typescript
- SCSS
- RxJS
