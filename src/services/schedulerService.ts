import * as taskRepo from '../repositories/taskRepo';

export const runWorker = () => {
    setInterval(async () => {
        try {
            const tasks = await taskRepo.pickDueTasks(5); // Take 5 tasks

            if (tasks.length > 0) {
                const promises = tasks.map(async (task) => {
                    try {
                        await new Promise(r => setTimeout(r, 1000)); 
                        await taskRepo.completeTask(task.id, 'COMPLETED');
                    } catch (err) {
                        await taskRepo.completeTask(task.id, 'FAILED');
                    }
                });

                await Promise.all(promises);
            }
        } catch (error) {
            console.error('Scheduler Error:', error);
        }
    }, 10000); // Interval
};