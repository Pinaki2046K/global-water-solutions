import { prisma } from "./lib/db"; async function m() { console.log(await prisma.service.count({ where: { nextServiceDueDate: { lte: new Date() } } })); }; m();
