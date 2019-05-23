export interface ITask {
    id: number,
    name: string,
    description: string,
    budget: number,
    status: 'S' | 'IP' | 'C', // Started | In Progress | Completed
    start_date: string,
    end_date: string,
    parent: number,
    props?: any
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const generateTask = (id: number = 0, parent: number = 0) => {
    return {
        id: id || Math.floor(Math.random() * 100),
        name: 'Name - ' + Math.floor(Math.random() * 100),
        description: 'Description',
        budget: Math.floor(Math.random() * 2000),
        status: 'S',
        parent,
        start_date: '2019-05-0' + getRandomArbitrary(1, 9),
        end_date: '2019-05-' + getRandomArbitrary(10, 31)
    } as ITask
}

export default generateTask;