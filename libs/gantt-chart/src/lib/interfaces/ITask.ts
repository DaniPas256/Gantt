export interface ITask {
    id: number,
    name: string,
    description: string,
    budget: number,
    status: 'S' | 'IP' | 'C', // Started | In Progress | Completed
    start_date: string,
    end_date: string,
    parent: number,
    progress: number,
    props?: any
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const generateTask = (id: number = 0, parent: number = 0) => {
    return {
        id: id || Math.floor(Math.random() * 100),
        name: 'Name - ' + Math.floor(Math.random() * 100),
        description: 'Description',
        budget: Math.floor(Math.random() * 2000),
        status: ['S', 'IP', 'C'][getRandomArbitrary(0, 3)],
        parent,
        start_date: '2019-05-0' + getRandomArbitrary(1, 9),
        end_date: '2019-05-' + getRandomArbitrary(10, 31),
        progress: getRandomArbitrary(0, 100)
    } as ITask
}

export const emptyTask = (id: number = 0, parent: number = 0) => {
    return {
        id: id || Math.floor(Math.random() * 10000000),
        name: '',
        description: '',
        budget: 0,
        status: 'S',
        parent,
        start_date: '',
        end_date: '',
        progress: 0
    } as ITask
}