const createTask = (id, duration) => {
    return () => {
        console.log(`-> Task ${id} started...(will take ${duration}ms)`)
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`<- Task ${id} finished.`);
                resolve(`Result from task ${id}`);
            }, duration);
        });
    };
};


const tasks = [
    createTask(1, 1000),
    createTask(2, 2000),
    createTask(3, 3000),
    createTask(4, 4000),
    createTask(5, 5000),
    createTask(6, 6000),
    createTask(7, 7000),
    createTask(8, 8000),
];

async function promiseRateLimiter(tasks, concurrency) {

    const result = [];
    let nextTaskIndex = 0;
    const worker = async () => {
        while (nextTaskIndex < tasks.length) {
            const taskIndex = nextTaskIndex++;
            const task = tasks[taskIndex];

            if (task) {
                try {
                    const result = await task();
                    result[taskIndex] = result;
                } catch (error) {
                    result[taskIndex] = { error: `Task ${taskIndex + 1} failed: ${error.message}` };
                }
            }

        }
    };
    const workPool = [];
    for (let i = 0; i < concurrency; i++) {
        workPool.push(worker())
    }
    await Promise.all(workPool);
    console.log(" Rate Limiter Logic Needs to Be Implemented.")
    return result;
}

async function main() {
    console.log("Starting rate limiter with a concurrency of 3...");
    console.log("=================================================");
    const concurrencyLimit = 3;
    const startTime = Date.now();
    const results = await promiseRateLimiter(tasks, concurrencyLimit);
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log("\n=================================================");
    console.log("All tasks completed!");
    console.log(`Total duration: ${duration}s`);
    console.log("Results in original order:", results);
}
main();