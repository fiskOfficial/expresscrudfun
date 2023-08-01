export function randomID () {
    return Math.random().toString(36);
}
export const randomID2 =  () => Math.random().toString(36).slice(2);


export async function standartFileRead () {
    const content = await fs.readFile("./db/tasks.json", 'utf8');
    const tasks = JSON.parse(content);
    return tasks;
}