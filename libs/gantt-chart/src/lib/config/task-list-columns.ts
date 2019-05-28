import { ITask } from '../interfaces/ITask';
import * as moment from 'moment';

export const columns = [
    {
        id: 'wbs',
        header: 'WBS',
        width: 40,
        template: (task: ITask) => {
            return task.props.$number;
        },
        visible: true,
        classes: () => { return '' },
        edit: {
            editable: (task: ITask) => { return true },
            field_name: 'wbs',
            field_type: 'text'
        }
    },
    {
        id: 'name',
        header: 'Task name',
        width: 250,
        indent: true,
        template: (task: ITask) => {
            const delayed = `<span class = 'delayed_sign'>⚠</span>`;
            const icon = `${task.props.has_children ? (!task.props.expanded ? `<i class="fa fa-folder-o task-icon" aria-hidden="true"></i>` : `<i class="fa fa-folder-open-o task-icon" aria-hidden="true"></i>`) : `<i class="fa fa-file-o task-icon" aria-hidden="true"></i>`}`;
            return `<span class = 'expand__tree'></span> ${icon} ${task.name} ${task.props.is_delayed ? delayed : ''} `;
        },
        click_event: (task) => {
            task.props.expanded = !task.props.expanded;
        },
        visible: true,
        classes: () => { return '' },
        edit: {
            editable: (task: ITask) => { return true },
            field_name: 'wbs',
            field_type: 'text'
        }
    },
    {
        id: 'start_date',
        header: 'Start',
        width: 100,
        template: (task: ITask) => {
            return moment(task.start_date).format('DD.MM.YYYY');
        },
        visible: true,
        classes: () => { return '' },
        edit: {
            editable: (task: ITask) => { return true },
            field_name: 'wbs',
            field_type: 'text'
        }
    },
    {
        id: 'end_date',
        header: 'End',
        width: 100,
        template: (task: ITask) => {
            return moment(task.end_date).format('DD.MM.YYYY');
        },
        visible: true,
        classes: () => { return '' },
        edit: {
            editable: (task: ITask) => { return true },
            field_name: 'wbs',
            field_type: 'text'
        }
    },
    {
        id: 'status',
        header: 'Status',
        width: 100,
        template: (task: ITask) => {
            switch (task.status) {
                case 'S':
                    return 'Started';
                case 'IP':
                    return 'In Progress';
                case 'C':
                    return 'Completed'
            }
        },
        visible: true,
        classes: () => { return '' },
        edit: {
            editable: (task: ITask) => { return true },
            field_name: 'wbs',
            field_type: 'text'
        }
    },
    {
        id: 'budget',
        header: 'Budget',
        width: 100,
        template: (task: ITask) => {
            return task.props.moneyPipe(task.budget);
        },
        visible: true,
        classes: () => { return '' },
        edit: {
            editable: (task: ITask) => { return true },
            field_name: 'wbs',
            field_type: 'text'
        }
    },
    {
        id: 'Actions',
        header: 'Actions',
        width: 100,
        actions: true,
        template: (task: ITask) => {
            return ``;
        },
        visible: true,
        classes: () => { return 'actions' },
        edit: {
            editable: (task: ITask) => { return false },
        }
    }
];