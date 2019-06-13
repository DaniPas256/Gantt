# Gantt Chart

Hello! This is simple gantt chart. I created it as my portfolio project. I hope You will enjoy it.

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

## Screens

Create tasks and connect them with relations

![enter image description here](https://dpcode.pl/screenshots/gantt/screen1.jpg)

Flexible scale, Your tasks can have duration of 1 day or 1 year or more

![enter image description here](https://dpcode.pl/screenshots/gantt/screen2.jpg)

![enter image description here](https://dpcode.pl/screenshots/gantt/screen3.jpg)

![enter image description here](https://dpcode.pl/screenshots/gantt/screen4.jpg)